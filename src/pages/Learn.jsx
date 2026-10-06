import { useState } from 'react'
import { Accordion, Button } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import TermModal from '../components/TermModal.jsx'
import { TOPICS } from '../data/content'
import { findTerms } from '../data/terms'
import { useScope } from '../useScope'

function Learn() {
  const { subjectId, week, valid, learn, label } = useScope()
  const [term, setTerm] = useState(null)
  if (!valid) return <Navigate to="/" replace />

  const topics = Object.keys(TOPICS).filter((k) => learn.some((c) => c.topic === k))
  return (
    <>
      <Crumbs subjectId={subjectId} week={week} current="Learn" />
      <h1 className="h3 mb-3">Learn <small className="text-body-secondary fs-6">{label}</small></h1>
      {topics.map((topic) => (
        <section key={topic} className="mb-4" aria-labelledby={`topic-${topic}`}>
          <h2 className="h5" id={`topic-${topic}`}>{TOPICS[topic]}</h2>
          <Accordion alwaysOpen>
            {learn.filter((c) => c.topic === topic).map((c, i) => {
              const terms = findTerms(c.title, c.text).slice(0, 8)
              return (
                <Accordion.Item eventKey={String(i)} key={c.title}>
                  <Accordion.Header>{c.title}</Accordion.Header>
                  <Accordion.Body>
                    <p>{c.text}</p>
                    <pre className="code" tabIndex={0} aria-label={`Code example: ${c.title}`}><code>{c.code}</code></pre>
                    {terms.length > 0 && (
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        <span className="small text-body-secondary">Look up:</span>
                        {terms.map((t) => (
                          <Button key={t.wiki} size="sm" variant="outline-primary" onClick={() => setTerm(t)}>
                            {t.label}<span className="visually-hidden"> on Wikipedia</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </section>
      ))}
      {!topics.length && <p className="text-body-secondary">No learn cards here yet.</p>}
      <TermModal term={term} onHide={() => setTerm(null)} />
    </>
  )
}

export default Learn
