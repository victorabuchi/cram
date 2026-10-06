import { Accordion } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import { TOPICS } from '../data/content'
import { useScope } from '../useScope'

function Learn() {
  const { subjectId, week, valid, learn, label } = useScope()
  if (!valid) return <Navigate to="/" replace />

  const topics = Object.keys(TOPICS).filter((k) => learn.some((c) => c.topic === k))
  return (
    <>
      <Crumbs subjectId={subjectId} week={week} current="Learn" />
      <h1 className="h3 mb-3">Learn <small className="text-body-secondary fs-6">{label}</small></h1>
      {topics.map((topic) => (
        <section key={topic} className="mb-4">
          <h2 className="h5">{TOPICS[topic]}</h2>
          <Accordion alwaysOpen>
            {learn.filter((c) => c.topic === topic).map((c, i) => (
              <Accordion.Item eventKey={String(i)} key={c.title}>
                <Accordion.Header>{c.title}</Accordion.Header>
                <Accordion.Body>
                  <p>{c.text}</p>
                  <pre className="code"><code>{c.code}</code></pre>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </section>
      ))}
      {!topics.length && <p className="text-body-secondary">No learn cards here yet.</p>}
    </>
  )
}

export default Learn
