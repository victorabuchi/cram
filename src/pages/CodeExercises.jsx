import { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import CodeQuestion from '../components/CodeQuestion.jsx'
import { useProgress } from '../hooks/useProgress'
import { useScope } from '../useScope'

// Write-the-function exercises, one per page, with a numbered navigator (a question counts as done once all its tests pass).
function CodeExercises() {
  const { subjectId, week, valid, items, label } = useScope()
  const { progress, record } = useProgress()
  const [index, setIndex] = useState(0)
  const list = items.filter((i) => i.kind === 'code')
  if (!valid) return <Navigate to="/" replace />

  const item = list[index]
  const done = (i) => (progress[i.id]?.right ?? 0) > 0
  const doneCount = list.filter(done).length

  return (
    <>
      <Crumbs subjectId={subjectId} week={week} current="Code exercises" />
      <h1 className="h3">Code exercises <small className="text-body-secondary fs-6">{label}</small></h1>
      {!list.length && <p className="text-body-secondary">No code exercises here yet.</p>}
      {item && (
        <Row className="g-4">
          <Col lg={9} order={2} className="order-lg-1">
            <Card body>
              <p className="text-body-secondary small mb-2">Question {index + 1} of {list.length}</p>
              <CodeQuestion
                key={item.id}
                item={item}
                passed={done(item)}
                onPassed={() => !done(item) && record(item.id, true)}
                onPeek={() => !done(item) && record(item.id, false)}
              />
              <div className="d-flex gap-2 mt-3">
                <Button variant="outline-secondary" onClick={() => setIndex(index - 1)} disabled={index === 0}>Back</Button>
                <Button onClick={() => setIndex(index + 1)} disabled={index === list.length - 1}>Next</Button>
              </div>
            </Card>
          </Col>
          <Col lg={3} className="order-lg-2">
            <Card body as="nav" aria-label="Question navigation">
              <h2 className="h6">Questions</h2>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {list.map((q, n) => (
                  <Button
                    key={q.id}
                    size="sm"
                    variant={n === index ? 'primary' : done(q) ? 'success' : 'outline-secondary'}
                    aria-current={n === index ? 'step' : undefined}
                    aria-label={`Question ${n + 1}${done(q) ? ', done' : ''}`}
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

export default CodeExercises
