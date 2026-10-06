import { useEffect, useRef, useState } from 'react'
import { Accordion, Alert, Badge, Button, Card, Form, InputGroup, ListGroup, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { searchTitles } from '../api/wikipedia'
import { getSubject } from '../data/subjects'
import { TERMS } from '../data/terms'
import { useTerms } from '../hooks/useTerms'
import { useWikiArticle } from '../hooks/useWikiArticle'
import { read, write } from '../storage'

const RECENT_KEY = 'scribletics_recent_searches'
const FEATURED = ['React', 'JSON', 'Document Object Model', 'Git', 'Bootstrap', 'REST']

function ArticleCard({ termKey }) {
  const { status, article, error } = useWikiArticle(termKey)
  const { saved, dispatch } = useTerms()
  const headingRef = useRef(null)
  const isSaved = article && saved.some((t) => t.key === article.key)

  // Move focus to the article heading once it has loaded, so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (status === 'ready') headingRef.current?.focus()
  }, [status, article])

  if (status === 'loading') return <div className="text-center my-4"><Spinner animation="border" role="status"><span className="visually-hidden">Loading article…</span></Spinner></div>
  if (status === 'error') return <Alert variant="danger">Something went wrong: {error}</Alert>
  if (status === 'missing') return <Alert variant="warning">No article found. Try another spelling or one of the suggestions.</Alert>
  if (status !== 'ready') return null

  const toggle = () => {
    if (isSaved) dispatch({ type: 'remove', key: article.key })
    else dispatch({ type: 'save', term: { key: article.key, title: article.title } })
    toast[isSaved ? 'info' : 'success'](isSaved ? `Removed ${article.title}` : `Saved ${article.title}`)
  }

  return (
    <Card className="mb-3">
      <Card.Body className="d-flex gap-3 flex-column flex-sm-row">
        {article.thumbnail && <img className="thumb align-self-start" src={article.thumbnail} alt={`Illustration for ${article.title}`} />}
        <div>
          <Card.Title as="h2" tabIndex={-1} ref={headingRef}>{article.title}</Card.Title>
          {article.description && <Card.Subtitle className="text-body-secondary mb-2">{article.description}</Card.Subtitle>}
          <Card.Text>{article.extract}</Card.Text>
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <Button size="sm" variant={isSaved ? 'outline-secondary' : 'outline-primary'} onClick={toggle} aria-pressed={!!isSaved}>
              {isSaved ? 'Saved' : 'Save to my terms'}
            </Button>
            <a href={article.url} target="_blank" rel="noreferrer">Read more on Wikipedia <span className="visually-hidden">(opens in a new tab)</span></a>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

function SearchTab({ termKey, open }) {
  const [text, setText] = useState('')
  const [matches, setMatches] = useState([])
  const [state, setState] = useState({ status: 'idle', error: '' })
  const [recent, setRecent] = useState(() => read(RECENT_KEY, []))
  const inputRef = useRef(null)
  const controllerRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    return () => controllerRef.current?.abort()
  }, [])

  const search = async (query) => {
    const q = query.trim()
    if (!q) return
    controllerRef.current?.abort() // a newer search replaces any request still in flight
    const controller = new AbortController()
    controllerRef.current = controller
    setState({ status: 'loading', error: '' })
    try {
      const results = await searchTitles(q, { signal: controller.signal })
      setMatches(results)
      setState({ status: results.length ? 'idle' : 'empty', error: '' })
      if (results.length) {
        open(results[0].key)
        const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 6)
        setRecent(next)
        write(RECENT_KEY, next)
      }
    } catch (e) {
      if (e.name === 'AbortError') return
      setState({ status: 'error', error: e.message })
      toast.error('Search failed')
    }
  }

  return (
    <>
      <Form role="search" onSubmit={(e) => { e.preventDefault(); search(text) }} className="mb-3">
        <InputGroup>
          <Form.Control ref={inputRef} aria-label="Search term" placeholder="e.g. Document Object Model" value={text} onChange={(e) => setText(e.target.value)} />
          <Button type="submit" disabled={state.status === 'loading'}>Look up</Button>
        </InputGroup>
      </Form>

      <div className="mb-3">
        <span className="me-2 small text-body-secondary">Try:</span>
        {FEATURED.map((s) => (
          <Button key={s} size="sm" variant="outline-secondary" className="me-2 mb-2" onClick={() => { setText(s); search(s) }}>{s}</Button>
        ))}
      </div>
      {recent.length > 0 && (
        <div className="mb-3">
          <span className="me-2 small text-body-secondary">Recent:</span>
          {recent.map((r) => (
            <Badge key={r} as="button" type="button" bg="secondary" className="border-0 me-2" onClick={() => { setText(r); search(r) }}>{r}</Badge>
          ))}
        </div>
      )}

      <div aria-live="polite">
        {state.status === 'loading' && <div className="text-center my-3"><Spinner animation="border" role="status"><span className="visually-hidden">Searching…</span></Spinner></div>}
        {state.status === 'error' && <Alert variant="danger">Something went wrong: {state.error}</Alert>}
        {state.status === 'empty' && <Alert variant="warning">No article found. Try another spelling.</Alert>}
      </div>

      {termKey && <ArticleCard termKey={termKey} />}

      {matches.length > 1 && (
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

function ByWeekTab({ open }) {
  const weeks = getSubject('webprog').weeks // the term list belongs to Web Programming I
  return (
    <Accordion defaultActiveKey="1">
      {weeks.map((w) => (
        <Accordion.Item eventKey={String(w.n)} key={w.n}>
          <Accordion.Header>Week {w.n}: {w.title}</Accordion.Header>
          <Accordion.Body className="d-flex flex-wrap gap-2">
            {TERMS.filter((t) => t.week === w.n).map((t) => (
              <Button key={t.wiki} size="sm" variant="outline-primary" onClick={() => open(t.wiki)}>{t.label}</Button>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

function SavedTab({ open }) {
  const { saved, dispatch } = useTerms()
  if (!saved.length) return <p className="text-body-secondary">Nothing saved yet. Use “Save to my terms” on an article or on a Learn card’s term.</p>
  return (
    <ListGroup>
      {saved.map((t) => (
        <ListGroup.Item key={t.key}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Button variant="link" className="p-0 fw-semibold" onClick={() => open(t.key)}>{t.title}</Button>
            <Button size="sm" variant="outline-danger" onClick={() => dispatch({ type: 'remove', key: t.key })} aria-label={`Remove ${t.title}`}>Remove</Button>
          </div>
          <Form.Control
            as="textarea"
            rows={2}
            aria-label={`Your note about ${t.title}`}
            placeholder="Your own words: what is it, and why does it matter?"
            value={t.note}
            onChange={(e) => dispatch({ type: 'note', key: t.key, note: e.target.value })}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

function Glossary() {
  const [params, setParams] = useSearchParams()
  const termKey = params.get('term')
  const [tab, setTab] = useState('search')
  const open = (key) => {
    setParams({ term: key })
    setTab('search')
  }

  return (
    <>
      <h1 className="h3">Glossary</h1>
      <p className="text-body-secondary">Look up any term from the course. Summaries come live from the Wikipedia REST API; save the ones you want to remember and add your own notes.</p>
      <Tabs activeKey={tab} onSelect={(k) => setTab(k)} className="mb-3" mountOnEnter>
        <Tab eventKey="search" title="Search"><SearchTab termKey={termKey} open={open} /></Tab>
        <Tab eventKey="weeks" title="By week"><ByWeekTab open={open} /></Tab>
        <Tab eventKey="saved" title="My terms"><SavedTab open={open} /></Tab>
      </Tabs>
    </>
  )
}

export default Glossary
