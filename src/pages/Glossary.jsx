import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Form, InputGroup, ListGroup, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getSummary, searchTitles } from '../api/wikipedia'

// Quick starting points, one per course topic.
const SUGGESTIONS = ['HTML', 'CSS', 'Git', 'GitHub', 'Bootstrap (front-end framework)', 'Document Object Model', 'JavaScript', 'JSON', 'REST', 'Ajax (programming)', 'React (software)', 'Single-page application', 'Web accessibility']

function Glossary() {
  const [term, setTerm] = useState('')
  const [matches, setMatches] = useState([])
  const [article, setArticle] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | error | empty
  const [error, setError] = useState('')

  const open = async (key) => {
    setStatus('loading')
    try {
      const summary = await getSummary(key)
      setArticle(summary)
      setStatus(summary ? 'idle' : 'empty')
    } catch (e) {
      setError(e.message)
      setStatus('error')
      toast.error('Could not load the article')
    }
  }

  const search = async (text) => {
    const query = text.trim()
    if (!query) return
    setStatus('loading')
    setArticle(null)
    try {
      const results = await searchTitles(query)
      setMatches(results)
      if (!results.length) return setStatus('empty')
      await open(results[0].key)
    } catch (e) {
      setError(e.message)
      setStatus('error')
      toast.error('Search failed')
    }
  }

  // Start with the most useful term for this course.
  useEffect(() => {
    search('React (software)')
  }, [])

  return (
    <>
      <h1 className="h3">Glossary</h1>
      <p className="text-body-secondary">Look up any term from the course. Summaries come live from the Wikipedia REST API.</p>

      <Form onSubmit={(e) => { e.preventDefault(); search(term) }} className="mb-3">
        <InputGroup>
          <Form.Control aria-label="Search term" placeholder="e.g. Document Object Model" value={term} onChange={(e) => setTerm(e.target.value)} />
          <Button type="submit" disabled={status === 'loading'}>Look up</Button>
        </InputGroup>
      </Form>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {SUGGESTIONS.map((s) => (
          <Badge key={s} as="button" bg="secondary" className="border-0" onClick={() => { setTerm(s); search(s) }}>{s}</Badge>
        ))}
      </div>

      {status === 'loading' && <div className="text-center my-4"><Spinner animation="border" role="status"><span className="visually-hidden">Loading…</span></Spinner></div>}
      {status === 'error' && <Alert variant="danger">Something went wrong: {error}</Alert>}
      {status === 'empty' && <Alert variant="warning">No article found. Try another spelling or a suggestion above.</Alert>}

      {article && status !== 'loading' && (
        <Card className="mb-3">
          <Card.Body className="d-flex gap-3 flex-column flex-sm-row">
            {article.thumbnail && <img className="thumb align-self-start" src={article.thumbnail} alt="" />}
            <div>
              <Card.Title as="h2">{article.title}</Card.Title>
              {article.description && <Card.Subtitle className="text-body-secondary mb-2">{article.description}</Card.Subtitle>}
              <Card.Text>{article.extract}</Card.Text>
              {article.url && <a href={article.url} target="_blank" rel="noreferrer">Read more on Wikipedia</a>}
            </div>
          </Card.Body>
        </Card>
      )}

      {matches.length > 1 && status !== 'loading' && (
        <>
          <h2 className="h6">Other matches</h2>
          <ListGroup>
            {matches.slice(1).map((m) => (
              <ListGroup.Item action key={m.key} onClick={() => open(m.key)}>
                {m.title} {m.description && <span className="text-body-secondary">· {m.description}</span>}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
    </>
  )
}

export default Glossary
