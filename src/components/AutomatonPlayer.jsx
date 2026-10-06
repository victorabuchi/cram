import { useState } from 'react'
import { Alert, Button, Form, InputGroup, Table } from 'react-bootstrap'
import { alphabetOf, formalDefinition, run, toAutomaton } from '../automata/model'
import Automaton from './Automaton.jsx'

// The transition table you would draw on paper (only for small alphabets).
function TransitionTable({ a }) {
  const sigma = alphabetOf(a)
  if (sigma.length > 6) return null
  const next = (s, ch) => run({ ...a, start: s }, ch).path[1] ?? '–'
  return (
    <Table size="sm" bordered className="w-auto mb-2" aria-label="Transition table">
      <thead>
        <tr><th scope="col">State</th>{sigma.map((ch) => <th scope="col" key={ch}>{ch}</th>)}</tr>
      </thead>
      <tbody>
        {a.states.map((s) => (
          <tr key={s}>
            <th scope="row">{a.start === s ? '→ ' : ''}{a.accept.includes(s) ? '(' + s + ')' : s}</th>
            {sigma.map((ch) => <td key={ch}>{next(s, ch)}</td>)}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

// A diagram you can step through: type a string, press Step, and watch the automaton move.
function AutomatonPlayer({ automaton, tryThese = [], showDefinition = true }) {
  const a = toAutomaton(automaton)
  const [input, setInput] = useState(tryThese[0] ?? '')
  const [step, setStep] = useState(0) // how many characters have been read
  const [started, setStarted] = useState(false) // no verdict until Step or Run is pressed
  const result = run(a, input)
  const chars = result.chars
  const reachable = result.stuckAt === null ? chars.length : result.stuckAt // characters we can actually read
  const stepped = Math.min(step, reachable)
  const stuck = result.stuckAt !== null && step > result.stuckAt
  const state = result.path[stepped]
  const finished = started && (step >= chars.length || stuck)

  const setText = (text) => {
    setInput(text)
    setStep(0)
    setStarted(false)
  }

  return (
    <div className="my-3">
      <Automaton automaton={a} current={stuck ? [] : [state]} activeEdge={stepped > 0 ? result.edges[stepped - 1] : null} />

      <Form onSubmit={(e) => { e.preventDefault(); setStarted(true); setStep(chars.length) }} className="mt-2">
        <InputGroup className="mb-2" style={{ maxWidth: 520 }}>
          <Form.Control aria-label="Input string" placeholder="Type a string to run" value={input} spellCheck={false} onChange={(e) => setText(e.target.value)} />
          <Button type="button" variant="outline-secondary" onClick={() => (step === 0 ? setStarted(false) : setStep(step - 1))} disabled={!started}>Back</Button>
          <Button type="button" onClick={() => { setStarted(true); setStep(Math.min(chars.length, step + 1)) }} disabled={finished}>Step</Button>
          <Button type="submit" variant="outline-primary">Run</Button>
        </InputGroup>
      </Form>
      {tryThese.length > 0 && (
        <div className="mb-2 small">
          Try:{' '}
          {tryThese.map((t) => (
            <Button key={t} size="sm" variant="outline-secondary" className="me-1" onClick={() => setText(t)}>{t === '' ? 'empty string' : t}</Button>
          ))}
        </div>
      )}

      <div className="font-monospace mb-2" aria-live="polite">
        {chars.map((c, i) => (
          <span key={i} className={i < stepped ? 'text-body-tertiary' : i === stepped && !finished ? 'fw-bold border-bottom border-2' : ''}>{c}</span>
        ))}
        {chars.length === 0 && <span className="text-body-secondary">(empty string)</span>}
        <span className="ms-3 text-body-secondary">in state <strong>{stuck ? '—' : state}</strong></span>
      </div>
      {finished && (
        <Alert variant={result.accepted ? 'success' : 'danger'} className="py-2">
          {stuck
            ? `Stuck in ${result.path.at(-1)}: no transition on "${chars[result.stuckAt]}". Rejected.`
            : result.accepted
              ? `Ends in ${result.state}, an accepting state. Accepted.`
              : `Ends in ${result.state}, which is not accepting. Rejected.`}
        </Alert>
      )}

      {showDefinition && (
        <details className="mt-2">
          <summary>Formal definition and table</summary>
          <TransitionTable a={a} />
          <pre className="code mb-0"><code>{formalDefinition(a)}</code></pre>
        </details>
      )}
    </div>
  )
}

export default AutomatonPlayer
