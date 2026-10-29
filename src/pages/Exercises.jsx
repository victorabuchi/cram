import { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Navigate, useSearchParams } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import PaperQuestion from '../components/PaperQuestion.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import { useProgress } from '../hooks/useProgress'
import { useScope } from '../useScope'

// The course exercise sheets: tasks the test is built from. Pen-and-paper tasks (kind "paper") and the explain-style design tasks.
// One sheet at a time: the sheets are listed by week, and ?exercise=Exercise+2 picks one (the first sheet of the scope otherwise).
function Exercises() {
  const { subjectId, week, subject, valid, items, label } = useScope()
  const { progress, record } = useProgress()
  const [params, setParams] = useSearchParams()
  const [pos, setPos] = useState({ sheet: null, index: 0 }) // the task you are on, in the sheet it belongs to
  if (!valid) return <Navigate to="/" replace />

  const all = items.filter((i) => i.exercise)
  const sheets = [...new Set(all.map((i) => i.exercise))]
  const sheet = sheets.includes(params.get('exercise')) ? params.get('exercise') : sheets[0]
  const list = all.filter((i) => i.exercise === sheet)
  const index = pos.sheet === sheet ? pos.index : 0 // another sheet (also by Back in the browser) starts at its first task
  const setIndex = (n) => setPos({ sheet, index: n })
  const weeks = subject.weeks
    .map((w) => ({ ...w, sheets: sheets.filter((s) => all.find((i) => i.exercise === s).week === w.n) }))
    .filter((w) => w.sheets.length)

  const item = list[index]
  const done = (i) => (progress[i.id]?.right ?? 0) > 0
  const doneIn = (s) => all.filter((i) => i.exercise === s && done(i)).length
  const countIn = (s) => all.filter((i) => i.exercise === s).length
  const doneCount = list.filter(done).length
  const next = () => setIndex(Math.min(index + 1, list.length - 1))
  const pick = (s) => setParams({ exercise: s })

  return (
    <>
      <Crumbs subjectId={subjectId} week={week} current="Exercises" />
      <h1 className="h3">Exercises <small className="text-body-secondary fs-6">{label}</small></h1>
      {!all.length && <p className="text-body-secondary">No exercises here yet.</p>}
      {sheets.length > 1 && (
        <Card body as="nav" aria-label="Exercise sheets" className="mb-4">
          {weeks.map((w) => (
            <div key={w.n} className="d-flex align-items-start gap-2 mb-2">
              <span className="small fw-bold text-nowrap pt-1">Week {w.n}<span className="fw-normal text-body-secondary d-none d-md-inline"> · {w.title}</span></span>
              <div className="d-flex flex-wrap gap-2">
                {w.sheets.map((s) => (
                  <Button key={s} size="sm" variant={s === sheet ? 'primary' : 'outline-secondary'} aria-pressed={s === sheet} onClick={() => pick(s)}>
                    {s} <span className="opacity-75">({doneIn(s)}/{countIn(s)})</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}
      {item && (
        <Row className="g-4">
          <Col lg={9} className="order-2 order-lg-1">
            <Card body>
              <p className="text-body-secondary small mb-2">{item.exercise} · task {index + 1} of {list.length}</p>
              {item.kind === 'paper' ? (
                <PaperQuestion
                  key={item.id}
                  item={item}
                  lastLabel={index === list.length - 1 ? 'Last task' : 'Next task'}
                  onScore={(correct) => record(item.id, correct)}
                  onNext={next}
                />
              ) : (
                <QuestionCard
                  key={item.id}
                  item={item}
                  instant
                  lastLabel={index === list.length - 1 ? 'Finish' : 'Next task'}
                  onScore={(score) => record(item.id, score >= 0.7)}
                  onNext={next}
                  onBack={index > 0 ? () => setIndex(index - 1) : undefined}
                />
              )}
              {item.kind === 'paper' && (
                <div className="d-flex gap-2 mt-3">
                  <Button variant="outline-secondary" onClick={() => setIndex(index - 1)} disabled={index === 0}>Back</Button>
                </div>
              )}
            </Card>
          </Col>
          <Col lg={3} className="order-1 order-lg-2">
            <Card body as="nav" aria-label="Task navigation">
              <h2 className="h6">{sheet}</h2>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {list.map((q, n) => (
                  <Button
                    key={q.id}
                    size="sm"
                    variant={n === index ? 'primary' : done(q) ? 'success' : 'outline-secondary'}
                    aria-current={n === index ? 'step' : undefined}
                    aria-label={`${q.exercise}, task ${n + 1}${done(q) ? ', done' : ''}`}
                    onClick={() => setIndex(n)}
                  >
                    {n + 1}
                  </Button>
                ))}
              </div>
              <p className="small text-body-secondary mb-0">{doneCount} of {list.length} done</p>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default Exercises
