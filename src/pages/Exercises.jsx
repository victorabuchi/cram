import { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import NotationHelp from '../components/NotationHelp.jsx'
import PaperQuestion from '../components/PaperQuestion.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import { useProgress } from '../hooks/useProgress'
import { useScope } from '../useScope'

// The course exercise sheets: tasks the test is built from. Pen-and-paper tasks (kind "paper") and the explain-style design tasks.
function Exercises() {
  const { subjectId, week, valid, items, label } = useScope()
  const { progress, record } = useProgress()
  const [index, setIndex] = useState(0)
  const [sheet, setSheet] = useState(false)
  const list = items.filter((i) => i.exercise)
  if (!valid) return <Navigate to="/" replace />

  const item = list[index]
  const done = (i) => (progress[i.id]?.right ?? 0) > 0
  const doneCount = list.filter(done).length
  const next = () => setIndex(Math.min(index + 1, list.length - 1))

  return (
    <>
      <Crumbs subjectId={subjectId} week={week} current="Exercises" />
      <h1 className="h3">Exercises <small className="text-body-secondary fs-6">{label}</small></h1>
      {!list.length && <p className="text-body-secondary">No exercises here yet.</p>}
      {list.some((i) => i.kind === 'paper' && i.subject === 'bmc') && (
        <div className="notation-bar mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="small fw-semibold me-1">Notation used in every task:</span>
            {[['Q', 'states'], ['Σ', 'alphabet'], ['s', 'start state'], ['F', 'accepting states'], ['δ', 'transition rules']].map(([symbol, meaning]) => (
              <span key={symbol} className="kn-chip"><span className="kn-chip-key">{symbol}</span><span className="kn-chip-value">{meaning}</span></span>
            ))}
            <Button size="sm" variant={sheet ? 'secondary' : 'dark'} onClick={() => setSheet(!sheet)} aria-expanded={sheet} className="ms-lg-auto">{sheet ? 'Hide cheat sheet' : 'Full cheat sheet'}</Button>
          </div>
          {sheet && <div className="mt-3"><NotationHelp /></div>}
        </div>
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
              <h2 className="h6">Tasks</h2>
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
