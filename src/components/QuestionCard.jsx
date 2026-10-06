import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { shuffle } from '../storage'

// One question of any kind (fill, predict, mcq, explain).
// instant=true: feedback after checking (practice). instant=false: none (practice test).
// onScore(score 0..1, detail) fires once the answer is final; onNext() moves on.
// The parent gives it key={item.id} so its state resets for each question.
function QuestionCard({ item, instant, lastLabel = 'Next', onScore, onNext }) {
  const [options] = useState(() => (item.kind === 'mcq' ? shuffle(item.options.map((t, i) => ({ t, ok: i === 0 }))) : []))
  const [chosen, setChosen] = useState(null)
  const [fills, setFills] = useState({})
  const [text, setText] = useState('')
  const [stage, setStage] = useState(0) // 0 answering, 1 model answer shown (explain), 2 finished
  const [ticks, setTicks] = useState([])
  const [feedback, setFeedback] = useState(null)

  const title = item.kind === 'mcq' || item.kind === 'explain' ? item.q : item.title
  const norm = (x) => x.trim().replace(/\s+/g, ' ')
  const fillOk = (i) => item.answers[i].includes((fills[i] || '').trim())

  const finish = (score, lines) => {
    setStage(2)
    if (instant) setFeedback({ ok: score >= 0.7, lines })
  }

  const submit = (e) => {
    e.preventDefault()
    if (stage === 2) return onNext()

    if (item.kind === 'explain') {
      if (!instant) {
        onScore(null, { text })
        return onNext()
      }
      if (stage === 0) {
        if (!text.trim() && !window.confirm('Your answer is empty. Reveal the model answer anyway?')) return
        setTicks(item.keyPoints.map(() => false))
        setStage(1)
        return
      }
      const got = ticks.filter(Boolean).length
      const score = got / ticks.length
      onScore(score, { text })
      return finish(score, [`You covered ${got} of ${ticks.length} key points.`])
    }

    let score = 0
    const lines = []
    if (item.kind === 'fill') {
      score = item.answers.every((_, i) => fillOk(i)) ? 1 : 0
      if (!score) lines.push('Answer: ' + item.answers.map((a) => a[0]).join('  ·  '))
    } else if (item.kind === 'predict') {
      score = item.answers.map(norm).includes(norm(text)) ? 1 : 0
      if (!score) lines.push('Answer: ' + item.answers[0])
    } else if (item.kind === 'mcq') {
      if (!chosen) return
      score = chosen.ok ? 1 : 0
      if (item.why) lines.push(item.why)
    }
    if (item.note) lines.push(item.note)
    onScore(score, { chosen: chosen?.t })
    if (!instant) return onNext()
    finish(score, lines)
  }

  const locked = instant && stage > 0
  let n = -1
  const codeBody =
    item.kind === 'fill'
      ? item.code.split(/(\{\{\d+\}\})/).map((part, k) => {
          const m = part.match(/^\{\{(\d+)\}\}$/)
          if (!m) return part
          const i = Number(m[1]) - 1
          n++
          return (
            <input
              key={k}
              aria-label={`Blank ${i + 1}`}
              size={Math.max(6, (fills[i] || '').length + 1)}
              value={fills[i] || ''}
              disabled={locked}
              autoFocus={n === 0}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className={locked ? (fillOk(i) ? 'ok' : 'bad') : ''}
              onChange={(e) => setFills({ ...fills, [i]: e.target.value })}
            />
          )
        })
      : item.code

  const buttonLabel =
    stage === 2 ? lastLabel : item.kind === 'explain' ? (instant ? (stage === 0 ? 'Reveal model answer' : 'Done grading') : lastLabel) : instant ? 'Check' : lastLabel

  return (
    <Form onSubmit={submit}>
      <h2 className="h5">{title}</h2>
      {item.code && <pre className="code"><code>{codeBody}</code></pre>}

      {item.kind === 'predict' && (
        <Form.Control
          className="mb-3"
          style={{ maxWidth: 420 }}
          placeholder="Type exactly what is printed"
          value={text}
          disabled={locked}
          autoFocus
          spellCheck={false}
          isValid={locked && feedback?.ok}
          isInvalid={locked && feedback && !feedback.ok}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {item.kind === 'mcq' && (
        <div className="d-grid gap-2 my-3">
          {options.map((o) => {
            let variant = chosen === o ? 'primary' : 'outline-secondary'
            if (locked) variant = o.ok ? 'success' : chosen === o ? 'danger' : 'outline-secondary'
            return (
              <Button key={o.t} type="button" variant={variant} className="opt-btn" disabled={locked} onClick={() => setChosen(o)}>
                {o.t}
              </Button>
            )
          })}
        </div>
      )}

      {item.kind === 'explain' && (
        <Form.Control
          as="textarea"
          rows={6}
          className="mb-3"
          placeholder="Explain in your own words, as you would in the test…"
          value={text}
          disabled={stage > 0 && instant}
          spellCheck={false}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {item.kind === 'explain' && instant && stage >= 1 && (
        <Alert variant="light" className="border">
          <strong>Model answer</strong>
          <p>{item.model}</p>
          <strong>Tick the points your answer covered:</strong>
          {item.keyPoints.map((k, i) => (
            <Form.Check
              key={k}
              id={`kp-${i}`}
              label={k}
              checked={!!ticks[i]}
              disabled={stage === 2}
              onChange={(e) => setTicks(ticks.map((t, j) => (j === i ? e.target.checked : t)))}
            />
          ))}
        </Alert>
      )}

      <Button type="submit">{buttonLabel}</Button>

      {feedback && (
        <Alert variant={feedback.ok ? 'success' : 'danger'} className="mt-3">
          <strong>{feedback.ok ? 'Correct!' : 'Not quite.'}</strong>
          {feedback.lines.map((l) => <div key={l}>{l}</div>)}
        </Alert>
      )}
    </Form>
  )
}

export default QuestionCard
