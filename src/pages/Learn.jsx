import { useState } from 'react'
import { Accordion, Button } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import AutomatonPlayer from '../components/AutomatonPlayer.jsx'
import PdfViewer from '../components/PdfViewer.jsx'
import TermModal from '../components/TermModal.jsx'
import { TOPICS } from '../data/content'
import { findTerms } from '../data/terms'
import { useScope } from '../useScope'

function Learn() {
  const { subjectId, week, valid, learn, docs, label } = useScope()
  const [term, setTerm] = useState(null)
  const [picked, setPicked] = useState(0)
  if (!valid) return <Navigate to="/" replace />

  // Weeks with slides show the PDF itself (one tab per document). Weeks without slides yet keep their learn cards.
  const doc = docs.length ? docs[Math.min(picked, docs.length - 1)] : null
  const slideWeeks = new Set(docs.map((d) => d.week))
  const cards = learn.filter((c) => !slideWeeks.has(c.week))

  const topics = Object.keys(TOPICS).filter((k) => cards.some((c) => c.topic === k))
  return (
    <>
      <Crumbs subjectId={subjectId} week={week} current="Learn" />
      <h1 className="h3 mb-3">Learn <small className="text-body-secondary fs-6">{label}</small></h1>
      {doc && (
        <>
          <div className="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Documents">
            {docs.map((d, i) => (
              <Button key={d.file} variant={d === doc ? 'primary' : 'outline-primary'} aria-pressed={d === doc} onClick={() => setPicked(i)}>{d.title}</Button>
            ))}
          </div>
          <PdfViewer key={doc.file} file={doc.file} title={doc.title} height="85vh" />
        </>
      )}
      {doc && topics.length > 0 && <h2 className="h5 mt-4 mb-3">Notes for the weeks without slides yet</h2>}
      {topics.map((topic) => (
        <section key={topic} className="mb-4" aria-labelledby={`topic-${topic}`}>
          <h2 className="h5" id={`topic-${topic}`}>{TOPICS[topic]}</h2>
          <Accordion alwaysOpen>
            {cards.filter((c) => c.topic === topic).map((c, i) => {
              const terms = c.subject === 'webprog' ? findTerms(c.title, c.text).slice(0, 8) : [] // the term list is for Web Programming I
              return (
                <Accordion.Item eventKey={String(i)} key={c.title}>
                  <Accordion.Header>{c.title}</Accordion.Header>
                  <Accordion.Body>
                    <p style={{ whiteSpace: 'pre-line' }}>{c.text}</p>
                    {c.code && <pre className="code" tabIndex={0} aria-label={`Code example: ${c.title}`}><code>{c.code}</code></pre>}
                    {c.automaton && <AutomatonPlayer automaton={c.automaton} tryThese={c.tryThese} />}
                    {terms.length > 0 && (
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        <span className="small text-body-secondary">Look up:</span>
                        {terms.map((t) => (
                          <Button key={t.wiki} size="sm" variant="outline-primary" onClick={() => setTerm(t)}>
                            {t.label} <span className="visually-hidden">: open the explanation</span>
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
      {!doc && !topics.length && <p className="text-body-secondary">No learn cards here yet.</p>}
      <TermModal term={term} onHide={() => setTerm(null)} />
    </>
  )
}

export default Learn
