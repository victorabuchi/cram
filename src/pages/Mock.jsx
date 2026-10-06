import { useState } from 'react'
import { Accordion, Alert, Button, Form, ProgressBar } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Crumbs from '../components/Crumbs.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import TopicPicker from '../components/TopicPicker.jsx'
import { topicsIn } from '../data/content'
import { recordResult, shuffle } from '../storage'
import { useScope } from '../useScope'

const MOCK_MCQ = 20
const MOCK_EXPLAIN = 3
const EXPLAIN_POINTS = 3

function Mock() {
  const { subjectId, week, valid, items, label } = useScope()
  const setTopics = topicsIn(items.filter((d) => d.kind === 'mcq' || d.kind === 'explain'))
  const [selected, setSelected] = useState(setTopics)
  const [mock, setMock] = useState(null) // { items, index, results }
  const [ticks, setTicks] = useState({}) // explain id -> boolean[]
  const [saved, setSaved] = useState(false)
  if (!valid) return <Navigate to="/" replace />

  const crumbs = <Crumbs subjectId={subjectId} week={week} current="Practice test" />

  const start = () => {
    const pool = items.filter((d) => selected.includes(d.topic))
    const mcq = shuffle(pool.filter((d) => d.kind === 'mcq')).slice(0, MOCK_MCQ)
    const exp = shuffle(pool.filter((d) => d.kind === 'explain')).slice(0, MOCK_EXPLAIN)
    if (!mcq.length && !exp.length) return
    setMock({ items: [...mcq, ...exp], index: 0, results: {} })
    setTicks(Object.fromEntries(exp.map((i) => [i.id, i.keyPoints.map(() => false)])))
    setSaved(false)
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

  if (mock.index < mock.items.length) {
    const item = mock.items[mock.index]
    const isLast = mock.index + 1 >= mock.items.length
    return (
      <>
        {crumbs}
        <ProgressBar now={(mock.index / mock.items.length) * 100} className="mb-2" style={{ height: 8 }} />
        <p className="text-body-secondary small">
          Question {mock.index + 1} of {mock.items.length}{item.kind === 'explain' && ' · open question'}
        </p>
        <QuestionCard
          key={item.id}
          item={item}
          instant={false}
          lastLabel={isLast ? 'Finish test' : 'Next question'}
          onScore={(score, detail) => setMock((m) => ({ ...m, results: { ...m.results, [item.id]: { score, ...detail } } }))}
          onNext={() => setMock((m) => ({ ...m, index: m.index + 1 }))}
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

  // Multiple-choice results go into progress once, when the test finishes; open questions on request.
  const saveAll = () => {
    mcqs.forEach((i) => recordResult(i.id, mock.results[i.id]?.score === 1))
    exps.forEach((i) => recordResult(i.id, ticks[i.id].filter(Boolean).length / ticks[i.id].length >= 0.7))
    setSaved(true)
    toast.success('Results saved to your progress')
  }

  return (
    <>
      {crumbs}
      <h1 className="h3">Practice test results</h1>
      <Alert variant={scaled >= 15 ? 'success' : 'danger'}>
        <strong>Estimated score: {scaled} / 30</strong> (pass line 15) · multiple choice {mcqPts}/{mcqs.length}
        {exps.length > 0 && ` · open questions ${expPts.toFixed(1)}/${exps.length * EXPLAIN_POINTS}`}
      </Alert>

      {exps.length > 0 && (
        <>
          <h2 className="h5">Open questions: grade yourself honestly</h2>
          <p className="text-body-secondary small">Compare your answer with the model answer and tick each key point you actually covered.</p>
          <Accordion alwaysOpen defaultActiveKey={exps.map((i) => i.id)} className="mb-4">
            {exps.map((i) => (
              <Accordion.Item eventKey={i.id} key={i.id}>
                <Accordion.Header>{i.q}</Accordion.Header>
                <Accordion.Body>
                  {i.code && <pre className="code"><code>{i.code}</code></pre>}
                  <strong>Your answer</strong>
                  <p className="border-start border-3 ps-3 text-body-secondary" style={{ whiteSpace: 'pre-wrap' }}>{mock.results[i.id]?.text?.trim() || '(empty)'}</p>
                  <strong>Model answer</strong>
                  <p>{i.model}</p>
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

      <h2 className="h5">{wrong.length ? `Multiple choice: review ${wrong.length} mistake${wrong.length > 1 ? 's' : ''}` : 'Multiple choice: all correct!'}</h2>
      <Accordion alwaysOpen defaultActiveKey={wrong.map((i) => i.id)} className="mb-4">
        {wrong.map((i) => (
          <Accordion.Item eventKey={i.id} key={i.id}>
            <Accordion.Header>{i.q}</Accordion.Header>
            <Accordion.Body>
              {i.code && <pre className="code"><code>{i.code}</code></pre>}
              <p className="border-start border-3 ps-3 text-body-secondary">You answered: {mock.results[i.id]?.chosen ?? '(nothing)'}</p>
              <p className="mb-0">Correct: {i.options[0]}{i.why ? ` (${i.why})` : ''}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <div className="d-flex gap-2">
        <Button variant="outline-primary" onClick={saveAll} disabled={saved}>{saved ? 'Saved to progress' : 'Save results to my progress'}</Button>
        <Button onClick={() => setMock(null)}>New practice test</Button>
      </div>
    </>
  )
}

export default Mock
