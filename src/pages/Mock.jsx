import { useEffect, useReducer, useRef, useState } from 'react'
import { Accordion, Alert, Button, Form } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Crumbs from '../components/Crumbs.jsx'
import Meter from '../components/Meter.jsx'
import Automaton from '../components/Automaton.jsx'
import AutomatonPlayer from '../components/AutomatonPlayer.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import TopicPicker from '../components/TopicPicker.jsx'
import { QUESTION_SETS, topicsIn } from '../data/content'
import { useProgress } from '../hooks/useProgress'
import { shuffle } from '../storage'
import { isFinished, sessionReducer } from '../reducers/session'
import { useScope } from '../useScope'

const MOCK_MCQ = 20
const MOCK_EXPLAIN = 3
const EXPLAIN_POINTS = 3

// test=false: a random practice test. test=true: a fixed set of questions in their own order: `set` is a key of QUESTION_SETS
// ("practice" = the Moodle Practice quiz, "real" = the question set).
function Mock({ test = false, set = 'practice' }) {
  const questionSet = QUESTION_SETS[set]
  const { subjectId, week, valid, items: allItems, label } = useScope()
  const items = test
    ? allItems.filter((i) => i[questionSet.key]).sort((a, b) => a[questionSet.key] - b[questionSet.key])
    : allItems.filter((i) => i.kind !== 'code') // the test has no coding questions
  const setTopics = topicsIn(items.filter((d) => d.kind === 'mcq' || d.kind === 'explain'))
  const [selected, setSelected] = useState(setTopics)
  const [mock, dispatch] = useReducer(sessionReducer, null)
  const { record } = useProgress()
  const [ticks, setTicks] = useState({}) // explain id -> boolean[]
  const [saved, setSaved] = useState(false)
  // The multiple-choice answers go into progress by themselves when the test is finished (once); the self-graded open questions on request.
  const savedMcq = useRef(false)
  const finished = !!mock && isFinished(mock)
  useEffect(() => {
    if (!finished || savedMcq.current) return
    savedMcq.current = true
    mock.items.filter((i) => i.kind === 'mcq').forEach((i) => record(i.id, mock.results[i.id]?.score === 1))
  }, [finished]) // eslint-disable-line -- runs once per finished test
  if (!valid) return <Navigate to="/" replace />

  const crumbs = <Crumbs subjectId={subjectId} week={week} current={test ? questionSet.title : 'Practice test'} />

  const startFixed = () => {
    dispatch({ type: 'start', items })
    setTicks(Object.fromEntries(items.filter((i) => i.kind === 'explain').map((i) => [i.id, i.keyPoints.map(() => false)])))
    setSaved(false)
    savedMcq.current = false
  }

  const start = () => {
    const pool = items.filter((d) => selected.includes(d.topic))
    const mcq = shuffle(pool.filter((d) => d.kind === 'mcq')).slice(0, MOCK_MCQ)
    const exp = shuffle(pool.filter((d) => d.kind === 'explain')).slice(0, MOCK_EXPLAIN)
    if (!mcq.length && !exp.length) return
    dispatch({ type: 'start', items: [...mcq, ...exp] })
    setTicks(Object.fromEntries(exp.map((i) => [i.id, i.keyPoints.map(() => false)])))
    setSaved(false)
    savedMcq.current = false
  }

  if (!mock && test) {
    return (
      <>
        {crumbs}
        <h1 className="h3">{questionSet.title}</h1>
        <p>{questionSet.intro.replace('{n}', items.length)}</p>
        <p className="text-body-secondary small">{items.length} questions so far. No feedback until the end. You can go back and change answers.</p>
        <Button onClick={startFixed} disabled={!items.length}>Attempt quiz</Button>
      </>
    )
  }

  if (!mock) {
    return (
      <>
        {crumbs}
        <h1 className="h3">Practice test <small className="text-body-secondary fs-6">{label}</small></h1>
        <p>{MOCK_MCQ} multiple-choice questions and {MOCK_EXPLAIN} "explain the code" questions. No feedback until the end. Close your notes, like in SEB.</p>
        <p className="text-body-secondary small">The question set is 30 points with 15 to pass. The exact question mix is unknown, so this score is an estimate scaled to 30.</p>
        <TopicPicker topics={setTopics} items={items.filter((d) => d.kind === 'mcq' || d.kind === 'explain')} selected={selected} onChange={setSelected} />
        <Button onClick={start} disabled={!selected.length}>Start practice test</Button>
      </>
    )
  }

  if (!isFinished(mock)) {
    const item = mock.items[mock.index]
    const isLast = mock.index + 1 >= mock.items.length
    return (
      <>
        {crumbs}
        <Meter now={(mock.index / mock.items.length) * 100} className="mb-2" label="Test progress" />
        <p className="text-body-secondary small">
          Question {mock.index + 1} of {mock.items.length}{item.kind === 'explain' && ' · open question'}
        </p>
        <QuestionCard
          key={item.id}
          item={item}
          instant={false}
          lastLabel={isLast ? 'Finish test' : 'Next question'}
          onScore={(score, detail) => dispatch({ type: 'answer', item, score, detail })}
          onNext={() => dispatch({ type: 'next' })}
          onBack={mock.index > 0 ? () => dispatch({ type: 'back' }) : undefined}
          draft={mock.drafts[item.id]}
          onDraft={(draft) => dispatch({ type: 'draft', id: item.id, draft })}
        />
      </>
    )
  }

  // ----- results -----
  const mcqs = mock.items.filter((i) => i.kind === 'mcq')
  const exps = mock.items.filter((i) => i.kind === 'explain')
  const maxPoints = mcqs.length + exps.length * EXPLAIN_POINTS
  const mcqPts = mcqs.filter((i) => mock.results[i.id]?.score === 1).length
  const expPts = exps.reduce((sum, i) => sum + (ticks[i.id].filter(Boolean).length / ticks[i.id].length) * EXPLAIN_POINTS, 0)
  const scaled = maxPoints ? Math.round(((mcqPts + expPts) / maxPoints) * 30) : 0
  const wrong = mcqs.filter((i) => mock.results[i.id]?.score !== 1)

  // Multiple-choice results were saved when the test finished; the open questions you graded yourself are saved on request.
  const saveAll = () => {
    exps.forEach((i) => record(i.id, ticks[i.id].filter(Boolean).length / ticks[i.id].length >= 0.7))
    setSaved(true)
    toast.success('Results saved to your progress')
  }

  return (
    <>
      {crumbs}
      <h1 className="h3">{test ? `${questionSet.title} results` : 'Practice test results'}</h1>
      {test ? (
        <Alert variant="info" role="status">
          <strong>Multiple choice: {mcqPts} of {mcqs.length} correct.</strong>
          {exps.length > 0 && ` Open questions are not graded here: compare your answers with the model answers (${expPts.toFixed(1)} of ${exps.length * EXPLAIN_POINTS} by your own ticks).`}
        </Alert>
      ) : (
        <Alert variant={scaled >= 15 ? 'success' : 'danger'}>
          <strong>Estimated score: {scaled} / 30</strong> (pass line 15) · multiple choice {mcqPts}/{mcqs.length}
          {exps.length > 0 && ` · open questions ${expPts.toFixed(1)}/${exps.length * EXPLAIN_POINTS}`}
        </Alert>
      )}

      {exps.length > 0 && (
        <>
          <h2 className="h5">Open questions: grade yourself honestly</h2>
          <p className="text-body-secondary small">Compare your answer with the model answer and tick each key point you actually covered.</p>
          <Accordion alwaysOpen defaultActiveKey={exps.map((i) => i.id)} className="mb-4">
            {exps.map((i) => (
              <Accordion.Item eventKey={i.id} key={i.id}>
                <Accordion.Header>Question {mock.items.indexOf(i) + 1}: {i.q}</Accordion.Header>
                <Accordion.Body>
                  {i.code && <pre className="code"><code>{i.code}</code></pre>}
                  {i.automaton && <Automaton automaton={i.automaton} />}
                  <strong>Your answer</strong>
                  <p className="border-start border-3 ps-3 text-body-secondary" style={{ whiteSpace: 'pre-wrap' }}>{mock.results[i.id]?.text?.trim() || '(empty)'}</p>
                  <strong>Model answer</strong>
                  <p>{i.model}</p>
                  {i.modelAutomaton && <AutomatonPlayer automaton={i.modelAutomaton} />}
                  {i.keyPoints.map((k, n) => (
                    <Form.Check
                      key={k}
                      id={`${i.id}-${n}`}
                      label={k}
                      checked={ticks[i.id][n]}
                      disabled={saved}
                      onChange={(e) => setTicks({ ...ticks, [i.id]: ticks[i.id].map((t, j) => (j === n ? e.target.checked : t)) })}
                    />
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}

      <h2 className="h5">Multiple choice: every question as you answered it</h2>
      <p className="text-body-secondary small">
        {wrong.length ? `${wrong.length} mistake${wrong.length > 1 ? 's are' : ' is'} open below.` : 'All correct!'} Your answer is marked, and the correct answer and the explanation are shown under each question.
      </p>
      <Accordion alwaysOpen defaultActiveKey={wrong.map((i) => i.id)} className="mb-4">
        {mcqs.map((i) => {
          const ok = mock.results[i.id]?.score === 1
          return (
            <Accordion.Item eventKey={i.id} key={i.id}>
              <Accordion.Header>
                <span className={`me-2 fw-semibold ${ok ? 'text-success' : 'text-danger'}`}>{ok ? '✓ Correct' : '✗ Wrong'}</span>
                Question {mock.items.indexOf(i) + 1}
              </Accordion.Header>
              <Accordion.Body>
                <QuestionCard item={i} instant={false} readOnly draft={mock.drafts[i.id]} />
              </Accordion.Body>
            </Accordion.Item>
          )
        })}
      </Accordion>

      <div className="d-flex gap-2">
        <Button variant="outline-primary" onClick={saveAll} disabled={saved}>{saved ? 'Saved to progress' : 'Save results to my progress'}</Button>
        <span className="align-self-center small text-body-secondary">Multiple-choice results are already saved. This also saves your self-graded open questions.</span>
        <Button onClick={() => dispatch({ type: 'end' })}>{test ? 'Attempt again' : 'New practice test'}</Button>
      </div>
    </>
  )
}

export default Mock
