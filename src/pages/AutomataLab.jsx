import { useMemo, useState } from 'react'
import { Alert, Button, Col, Form, Row, Table } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { download, downloadPng, toJffFile, toSvgFile } from '../automata/export.jsx'
import { AutomatonError, check, parseAutomaton, run } from '../automata/model'
import Automaton from '../components/Automaton.jsx'
import AutomatonPlayer from '../components/AutomatonPlayer.jsx'
import { PRESETS } from '../data/bmc/presets'

const SYNTAX = `# comment
start: q0                 the start state
accept: q1 q2             the accepting states (double circles)
q0 a b -> q1              from q0, on a or b, go to q1
q1 [0-9] -> q1            a class of symbols: [0-9], [a-f], [abc]
q1 , -> q0                a comma is a symbol too (symbols are split by spaces)
layout: circle            optional: layers (default), circle, grid 3
at q0 0 0                 optional: put a state at x y`

function Results({ a, text }) {
  const rows = text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => (l === 'ε' ? '' : l))
  if (!rows.length) return null
  return (
    <Table size="sm" bordered className="w-auto" aria-label="Test results">
      <thead><tr><th scope="col">Input</th><th scope="col">Result</th></tr></thead>
      <tbody>
        {rows.map((input, i) => {
          const r = run(a, input)
          return (
            <tr key={i}>
              <td className="font-monospace">{input === '' ? 'ε (empty)' : input}</td>
              <td className={r.accepted ? 'text-success fw-semibold' : 'text-danger'}>
                {r.accepted ? 'Accept' : r.stuckAt !== null ? 'Reject (stuck)' : 'Reject'}
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

function AutomataLab() {
  const [params] = useSearchParams()
  const first = PRESETS.find((p) => p.id === params.get('preset')) ?? PRESETS[0] // ?preset=t4 opens an example directly
  const [presetId, setPresetId] = useState(first.id)
  const [text, setText] = useState(first.text)
  const [tests, setTests] = useState(first.tests.join('\n'))

  const parsed = useMemo(() => {
    try {
      return { a: parseAutomaton(text) }
    } catch (e) {
      if (e instanceof AutomatonError) return { error: e.message }
      throw e
    }
  }, [text])
  const a = parsed.a
  const problems = useMemo(() => (a ? check(a) : []), [a])

  const choose = (id) => {
    const p = PRESETS.find((x) => x.id === id)
    setPresetId(id)
    setText(p.text)
    setTests(p.tests.join('\n'))
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied the automaton text')
    } catch {
      toast.error('Could not copy. Select the text and copy it by hand.')
    }
  }

  return (
    <>
      <h1 className="h3">Automata lab</h1>
      <p className="text-body-secondary">
        Describe a finite automaton as text and get a JFLAP-style diagram. Step through inputs, test many strings at once, and download the picture as SVG or PNG, or as a <code>.jff</code> file that opens in JFLAP.
      </p>

      <Row className="g-4">
        <Col lg={5}>
          <Form.Group className="mb-3" controlId="preset">
            <Form.Label>Start from an example</Form.Label>
            <Form.Select value={presetId} onChange={(e) => choose(e.target.value)}>
              {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2" controlId="automaton-text">
            <Form.Label>Automaton</Form.Label>
            <Form.Control as="textarea" rows={14} className="font-monospace" style={{ fontSize: 14 }} value={text} spellCheck={false} onChange={(e) => setText(e.target.value)} isInvalid={!!parsed.error} aria-describedby="automaton-error" />
            <Form.Control.Feedback type="invalid" id="automaton-error">{parsed.error}</Form.Control.Feedback>
          </Form.Group>
          <details className="mb-3">
            <summary>Syntax</summary>
            <pre className="code mb-0"><code>{SYNTAX}</code></pre>
          </details>
          <Form.Group controlId="tests">
            <Form.Label>Test strings, one per line (ε for the empty string)</Form.Label>
            <Form.Control as="textarea" rows={5} className="font-monospace" value={tests} spellCheck={false} onChange={(e) => setTests(e.target.value)} />
          </Form.Group>
        </Col>

        <Col lg={7}>
          {a && (
            <>
              <Automaton automaton={a} />
              <div className="d-flex flex-wrap gap-2 my-3">
                <Button variant="outline-primary" onClick={() => download('automaton.svg', toSvgFile(a), 'image/svg+xml')}>Download SVG</Button>
                <Button variant="outline-primary" onClick={() => downloadPng(a, 'automaton.png')}>Download PNG</Button>
                <Button variant="outline-primary" onClick={() => download('automaton.jff', toJffFile(a), 'application/xml')}>Download for JFLAP (.jff)</Button>
                <Button variant="outline-secondary" onClick={copy}>Copy text</Button>
              </div>
              {problems.length > 0 && (
                <Alert variant="warning" role="status">
                  <strong>Check:</strong>
                  <ul className="mb-0">{problems.map((p) => <li key={p}>{p}</li>)}</ul>
                </Alert>
              )}
              <h2 className="h6 mt-3">Test results</h2>
              <Results a={a} text={tests} />
              <h2 className="h6 mt-3">Step through one input</h2>
              <AutomatonPlayer key={text} automaton={a} />
            </>
          )}
          {!a && <Alert variant="danger" role="alert">{parsed.error}</Alert>}
        </Col>
      </Row>
    </>
  )
}

export default AutomataLab
