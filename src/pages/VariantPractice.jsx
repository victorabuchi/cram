import { useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Navigate, useSearchParams } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import PaperQuestion from '../components/PaperQuestion.jsx'
import { ITEMS } from '../data/content'
import { useProgress } from '../hooks/useProgress'
import { useScope } from '../useScope'

// Practice: every exercise task again with different values, with the answers. Solve on paper, show the answer, say how it went.
function VariantPractice() {
  const { subjectId, week, valid, variants: list, label } = useScope()
  const { progress, record } = useProgress()
  const [params] = useSearchParams()
  const start = list.findIndex((v) => v.of === params.get('for'))
  const [index, setIndex] = useState(start >= 0 ? start : 0)
  if (!valid) return <Navigate to="/" replace />

  const item = list[index]
  const done = (v) => (progress[v.id]?.right ?? 0) > 0
  const source = item && ITEMS.find((i) => i.id === item.of)
  const next = () => setIndex(Math.min(index + 1, list.length - 1))

  return (
    <>
      <Crumbs subjectId={subjectId} week={week} current="Practice" />
      <h1 className="h3">Practice <small className="text-body-secondary fs-6">{label}</small></h1>
      <p className="text-body-secondary">The exercise tasks again with other values. Solve each one on paper, then show the answer. Do them again until you can solve them without help.</p>
      {!list.length && <p className="text-body-secondary">No practice tasks here yet.</p>}
      {item && (
        <Row className="g-4">
          <Col lg={9} className="order-2 order-lg-1">
            <Card body>
              <p className="text-body-secondary small mb-2">
                Practice task {index + 1} of {list.length}{source && <> · the same idea as <strong>{source.title}</strong> in {source.exercise}</>}
              </p>
              <PaperQuestion
                key={item.id}
                item={item}
                unsureLabel="Still unsure"
                lastLabel={index === list.length - 1 ? 'Last task' : 'Next task'}
                onScore={(correct) => record(item.id, correct)}
                onNext={next}
              />
              <div className="d-flex gap-2 mt-3">
                <Button variant="outline-secondary" onClick={() => setIndex(index - 1)} disabled={index === 0}>Back</Button>
              </div>
            </Card>
          </Col>
          <Col lg={3} className="order-1 order-lg-2">
            <Card body as="nav" aria-label="Practice navigation">
              <h2 className="h6">Tasks</h2>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {list.map((q, n) => (
                  <Button
                    key={q.id}
                    size="sm"
                    variant={n === index ? 'primary' : done(q) ? 'success' : 'secondary'}
                    aria-current={n === index ? 'step' : undefined}
                    aria-label={`Practice task ${n + 1}${done(q) ? ', done' : ''}`}
                    onClick={() => setIndex(n)}
                  >
                    {n + 1}
                  </Button>
                ))}
              </div>
              <p className="small text-body-secondary mb-0">{list.filter(done).length} of {list.length} done</p>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default VariantPractice
