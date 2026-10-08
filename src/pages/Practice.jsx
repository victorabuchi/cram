import { useReducer, useState } from 'react'
import { Accordion, Button, Form } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import Meter from '../components/Meter.jsx'
import Automaton from '../components/Automaton.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import TopicPicker from '../components/TopicPicker.jsx'
import { KIND_NAMES, TOPICS, topicsIn } from '../data/content'
import { useProgress } from '../hooks/useProgress'
import { isDue, shuffle } from '../storage'
import { isFinished, sessionReducer } from '../reducers/session'
import { useScope } from '../useScope'

// Every selected question is asked. The ones that are due or new come first (lowest Leitner box first), then the rest, shuffled.
function pickItems(pool, progress) {
  const byBox = (a) => shuffle(a).sort((x, y) => (progress[x.id]?.box ?? -1) - (progress[y.id]?.box ?? -1))
  const due = pool.filter((d) => isDue(progress, d.id))
  const rest = pool.filter((d) => !due.includes(d))
  return [...byBox(due), ...shuffle(rest)]
}

function Practice() {
  const { subjectId, week, valid, items: allItems, label } = useScope()
  const items = allItems.filter((i) => i.kind !== 'code') // code exercises have their own page
  const topics = topicsIn(items)
  const [selected, setSelected] = useState(topics)
  const [withExplain, setWithExplain] = useState(true)
  const [session, dispatch] = useReducer(sessionReducer, null)
  const { progress, record } = useProgress()
  if (!valid) return <Navigate to="/" replace />

  const pool = items.filter((d) => selected.includes(d.topic) && (withExplain || d.kind !== 'explain'))
  const start = () => {
    if (pool.length) dispatch({ type: 'start', items: pickItems(pool, progress) })
  }

  const crumbs = <Crumbs subjectId={subjectId} week={week} current="Practice" />

  if (!session) {
    return (
      <>
        {crumbs}
        <h1 className="h3">Practice <small className="text-body-secondary fs-6">{label}</small></h1>
        <p>Pick topics. You get every question of the topics you pick ({pool.length} now): new ones and the ones you missed come first.</p>
        <TopicPicker topics={topics} items={items} selected={selected} onChange={setSelected} />
        <Form.Check
          id="with-explain"
          className="mb-3"
          label='Include "explain the code" questions (you write an answer, then self-grade)'
          checked={withExplain}
          onChange={(e) => setWithExplain(e.target.checked)}
        />
        <Button onClick={start} disabled={!selected.length}>Start session</Button>
      </>
    )
  }

  if (isFinished(session)) {
    return (
      <>
        {crumbs}
        <h1 className="h3">{session.right} / {session.items.length} correct</h1>
        <p>{session.wrong.length ? 'These will come back sooner:' : 'Clean sweep. They will come back later to make sure it stuck.'}</p>
        <Accordion defaultActiveKey={session.wrong.map((_, i) => String(i))} alwaysOpen className="mb-3">
          {session.wrong.map((w, i) => (
            <Accordion.Item eventKey={String(i)} key={w.id}>
              <Accordion.Header>{w.q || w.title}</Accordion.Header>
              <Accordion.Body>
                {w.code && <pre className="code"><code>{w.code.replace(/\{\{\d+\}\}/g, '___')}</code></pre>}
                {w.automaton && <Automaton automaton={w.automaton} />}
                <p className="mb-0">
                  {w.kind === 'mcq' ? `Answer: ${w.options[0]}${w.why ? ` (${w.why})` : ''}` : w.kind === 'explain' ? w.model : `Answer: ${w.answers.map((a) => (Array.isArray(a) ? a[0] : a)).join(' · ')}`}
                </p>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        <Button onClick={() => dispatch({ type: 'end' })}>Another session</Button>
      </>
    )
  }

  const item = session.items[session.index]
  const isLast = session.index + 1 >= session.items.length
  return (
    <>
      {crumbs}
      <Meter now={(session.index / session.items.length) * 100} className="mb-2" label="Session progress" />
      <p className="text-body-secondary small">
        Question {session.index + 1} of {session.items.length} · {TOPICS[item.topic]} · {KIND_NAMES[item.kind]}
      </p>
      <QuestionCard
        key={item.id}
        item={item}
        instant
        lastLabel={isLast ? 'Finish' : 'Next'}
        onScore={(score) => {
          record(item.id, score >= 0.7)
          dispatch({ type: 'answer', item, score })
        }}
        onNext={() => dispatch({ type: 'next' })}
        onBack={session.index > 0 ? () => dispatch({ type: 'back' }) : undefined}
        draft={session.drafts[item.id]}
        onDraft={(draft) => dispatch({ type: 'draft', id: item.id, draft })}
      />
    </>
  )
}

export default Practice
