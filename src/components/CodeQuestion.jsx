import { useRef, useState } from 'react'
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { REQUIREMENTS, callText, runCode, show } from '../code/runner'
import { read, write } from '../storage'

const key = (id) => `scribletics_code_${id}`

// One "write the function" exercise: prompt, editor, Check, and a table of test results.
// onPassed() fires the first time every test passes; onPeek() when the solution is revealed.
// The parent gives it key={item.id} so state resets per question. The code is kept in localStorage.
function CodeQuestion({ item, onPassed, onPeek, passed }) {
  const [code, setCode] = useState(() => read(key(item.id), item.starter))
  const [outcome, setOutcome] = useState(null) // { error, results, missing[] }
  const [running, setRunning] = useState(false)
  const [solution, setSolution] = useState(false)
  const leaveWithTab = useRef(false)
  const peeked = useRef(false)

  const change = (value) => {
    setCode(value)
    write(key(item.id), value)
  }

  // Tab inserts spaces while you code. Press Escape first to let Tab move focus away instead (no keyboard trap).
  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      leaveWithTab.current = true
      return
    }
    if (e.key === 'Tab' && !leaveWithTab.current && !e.shiftKey) {
      e.preventDefault()
      const { selectionStart: a, selectionEnd: b } = e.target
      change(code.slice(0, a) + '    ' + code.slice(b))
      requestAnimationFrame(() => e.target.setSelectionRange(a + 4, a + 4))
    } else if (e.key !== 'Tab' && e.key !== 'Shift') {
      leaveWithTab.current = false
    }
  }

  const check = async () => {
    setRunning(true)
    const result = await runCode(code, item.fn, item.tests)
    const missing = (item.requires ?? []).filter((r) => !REQUIREMENTS[r].test(code)).map((r) => REQUIREMENTS[r].message)
    setOutcome({ ...result, missing })
    setRunning(false)
    if (!result.error && result.results.every((r) => r.pass) && !missing.length) {
      if (!peeked.current && !passed) toast.success('All tests pass!')
      onPassed?.()
    }
  }

  const reset = () => {
    if (code !== item.starter && !window.confirm('Clear your code and start from the starter code?')) return
    change(item.starter)
    setOutcome(null)
  }

  const reveal = () => {
    if (!solution && !window.confirm('Have you tried for a while? Peeking is fine, but you learn more if you struggle first. Showing the solution counts this question as missed in your progress.')) return
    if (!solution) {
      peeked.current = true
      onPeek?.()
    }
    setSolution(!solution)
  }

  const results = outcome?.results ?? []
  const passedCount = results.filter((r) => r.pass).length
  const allPass = outcome && !outcome.error && results.length > 0 && passedCount === results.length && !outcome.missing.length

  return (
    <Form onSubmit={(e) => { e.preventDefault(); check() }}>
      <h2 className="h5">{item.title}</h2>
      {item.prompt.map((p, i) => <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>)}

      <Form.Group controlId={`code-${item.id}`} className="mb-2">
        <Form.Label className="fw-semibold">Your code</Form.Label>
        <Form.Control
          as="textarea"
          rows={12}
          className="font-monospace"
          style={{ fontSize: 14, tabSize: 4 }}
          value={code}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-describedby={`code-help-${item.id}`}
          onChange={(e) => change(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Form.Text id={`code-help-${item.id}`}>Tab indents. Press Esc, then Tab, to move to the next control.</Form.Text>
      </Form.Group>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button type="submit" disabled={running}>{running ? 'Running…' : 'Check'}</Button>
        <Button type="button" variant="outline-secondary" onClick={reset}>Reset code</Button>
        <Button type="button" variant="outline-secondary" onClick={reveal}>{solution ? 'Hide solution' : 'Show solution'}</Button>
        {running && <Spinner size="sm" animation="border" role="status"><span className="visually-hidden">Running tests</span></Spinner>}
      </div>

      <div aria-live="polite">
        {outcome?.error && <Alert variant="danger" role="alert"><strong>Your code could not run.</strong> {outcome.error}</Alert>}
        {outcome && !outcome.error && (
          <>
            <Alert variant={allPass ? 'success' : 'warning'} role="status">
              <strong>{allPass ? 'All tests pass!' : `${passedCount} of ${results.length} tests pass.`}</strong>
              {outcome.missing.map((m) => <div key={m}>{m}</div>)}
            </Alert>
            <Table size="sm" bordered responsive aria-label="Test results">
              <thead>
                <tr><th scope="col">Test</th><th scope="col">Expected</th><th scope="col">Got</th><th scope="col"><span className="visually-hidden">Result</span></th></tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className={r.pass ? 'table-success' : 'table-danger'}>
                    <td className="font-monospace">{callText(item.fn, item.tests[i].args)}</td>
                    <td className="font-monospace">{show(item.tests[i].expected)}</td>
                    <td className="font-monospace">{show(r.actual)}{r.mutated && <div className="small">The function changed its input. Return a new value instead.</div>}</td>
                    <td>{r.pass ? '✓' : '✗'}<span className="visually-hidden">{r.pass ? ' passed' : ' failed'}</span></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>

      {solution && (
        <>
          <h3 className="h6">One possible solution</h3>
          <pre className="code"><code>{item.solution}</code></pre>
          <p className="text-body-secondary small">Read it, then press Reset code and write it again from memory.</p>
        </>
      )}
    </Form>
  )
}

export default CodeQuestion
