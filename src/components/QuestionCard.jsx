import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { shuffle } from '../storage'
import Automaton from './Automaton.jsx'
import LearnMore from './LearnMore.jsx'
import AutomatonPlayer from './AutomatonPlayer.jsx'

const norm = (x) => x.trim().replace(/\s+/g, ' ')

// One question of any kind (fill, predict, mcq, explain).
//   instant   true: feedback after checking (practice). false: none (practice test).
//   onScore   (score 0..1, detail) fires once the answer is final; onNext() moves on; onBack() (optional) goes back.
//   draft     what the student had entered before: { order, chosen, fills, text, ticks, stage }. The card starts from it,
//             so going back to a question shows it as it was left. onDraft(draft) reports every change.
//   readOnly  the question as it was answered, with the correct answer shown below (review after an test).
// The parent gives it key={item.id} so its state resets for each question.
function QuestionCard({ item, instant, lastLabel = 'Next', onScore, onNext, onBack, draft, onDraft, readOnly = false }) {
  const [order] = useState(() => draft?.order ?? (item.kind === 'mcq' ? shuffle(item.options) : []))
  const options = order.map((t) => ({ t, ok: t === item.options[0] }))
  const [chosenText, setChosenText] = useState(draft?.chosen ?? null)
  const [fills, setFills] = useState(draft?.fills ?? {})
  const [text, setText] = useState(draft?.text ?? '')
  const [stage, setStage] = useState(draft?.stage ?? 0) // 0 answering, 1 model answer shown (explain), 2 finished
  const [ticks, setTicks] = useState(draft?.ticks ?? [])
  const submitRef = useRef(null)
  const chosen = options.find((o) => o.t === chosenText) ?? null

  useEffect(() => {
    onDraft?.({ order, chosen: chosenText, fills, text, ticks, stage })
  }, [order, chosenText, fills, text, ticks, stage]) // eslint-disable-line -- onDraft only stores the value

  // Once the answer is checked, focus the button so Enter continues to the next question.
  useEffect(() => {
    if (stage === 2 && !readOnly) submitRef.current?.focus()
  }, [stage, readOnly])

  const title = item.kind === 'mcq' || item.kind === 'explain' ? item.q : item.title
  const fillOk = (i) => item.answers[i].includes((fills[i] || '').trim())

  // Score and feedback lines for the current answer. Everything comes from state, so a review shows the same as the first time.
  const evaluate = () => {
    const lines = []
    let score = 0
    if (item.kind === 'explain') {
      const got = ticks.filter(Boolean).length
      score = ticks.length ? got / ticks.length : 0
      lines.push(`You covered ${got} of ${ticks.length} key points.`)
    } else if (item.kind === 'fill') {
      score = item.answers.every((_, i) => fillOk(i)) ? 1 : 0
      if (!score) lines.push('Answer: ' + item.answers.map((a) => a[0]).join('  ·  '))
    } else if (item.kind === 'predict') {
      score = item.answers.map(norm).includes(norm(text)) ? 1 : 0
      if (!score) lines.push('Answer: ' + item.answers[0])
    } else if (item.kind === 'mcq') {
      score = chosen?.ok ? 1 : 0
      if (item.why) lines.push(item.why)
    }
    if (item.kind !== 'explain' && item.note) lines.push(item.note)
    return { score, lines }
  }

  const done = stage === 2 || readOnly
  const showFeedback = done && (instant || readOnly) && (item.kind !== 'explain' || ticks.length > 0)
  const locked = readOnly || (instant && stage > 0)
  const verdict = showFeedback ? evaluate() : null
  const feedback = verdict && { ok: verdict.score >= 0.7, lines: verdict.lines, unanswered: item.kind === 'mcq' && !chosen }

  const submit = (e) => {
    e.preventDefault()
    if (readOnly) return
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
      onScore(evaluate().score, { text })
      return setStage(2)
    }

    if (item.kind === 'mcq' && !chosen) return
    onScore(evaluate().score, { chosen: chosen?.t })
    if (!instant) return onNext()
    setStage(2)
  }

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
              autoFocus={n === 0 && !readOnly}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className={done ? (fillOk(i) ? 'ok' : 'bad') : ''}
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
      {item.automaton && <Automaton automaton={item.automaton} />}

      {item.kind === 'predict' && (
        <Form.Control
          className="mb-3"
          style={{ maxWidth: 420 }}
          placeholder="Type exactly what is printed"
          aria-label="Your answer"
          value={text}
          disabled={locked}
          autoFocus={!readOnly}
          spellCheck={false}
          isValid={done && feedback?.ok}
          isInvalid={done && feedback && !feedback.ok}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {item.kind === 'mcq' && (
        <div className="d-grid gap-2 my-3" role="group" aria-label="Answer options">
          {options.map((o) => {
            const mine = chosen === o
            let variant = mine ? 'primary' : 'outline-secondary'
            if (done && showFeedback) variant = o.ok ? 'success' : mine ? 'danger' : 'outline-secondary'
            return (
              <Button key={o.t} type="button" aria-pressed={mine} variant={variant} className="opt-btn" disabled={locked} onClick={() => setChosenText(o.t)}>
                {o.t}
                {done && showFeedback && mine && <span className="ms-2 fw-semibold">{o.ok ? '(your answer, correct)' : '(your answer)'}</span>}
                {done && showFeedback && o.ok && !mine && <span className="ms-2 fw-semibold">(correct answer)</span>}
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
          aria-label="Your answer"
          value={text}
          disabled={locked}
          spellCheck={false}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {item.kind === 'explain' && (instant || readOnly) && (stage >= 1 || readOnly) && (
        <Alert variant="light" className="border" role="region" aria-label="Model answer">
          <strong>Model answer</strong>
          <p>{item.model}</p>
          {item.modelAutomaton && <AutomatonPlayer automaton={item.modelAutomaton} />}
          <strong>{readOnly ? 'Key points:' : 'Tick the points your answer covered:'}</strong>
          {item.keyPoints.map((k, i) => (
            <Form.Check
              key={k}
              id={`kp-${item.id}-${i}`}
              label={k}
              checked={!!ticks[i]}
              disabled={readOnly || stage === 2}
              onChange={(e) => setTicks(ticks.map((t, j) => (j === i ? e.target.checked : t)))}
            />
          ))}
        </Alert>
      )}

      {!readOnly && (
        <div className="d-flex gap-2">
          {onBack && <Button type="button" variant="outline-secondary" onClick={onBack}>Back</Button>}
          <Button type="submit" ref={submitRef}>{buttonLabel}</Button>
        </div>
      )}

      {feedback && (
        <Alert variant={feedback.unanswered ? 'warning' : feedback.ok ? 'success' : 'danger'} className="mt-3" role={readOnly ? 'region' : 'alert'} aria-label={readOnly ? 'Result' : undefined}>
          <strong>{feedback.unanswered ? 'Not answered.' : feedback.ok ? 'Correct!' : 'Not quite.'}</strong>
          {feedback.lines.map((l) => <div key={l}>{l}</div>)}
          {!feedback.unanswered && <LearnMore item={item} />}
        </Alert>
      )}
    </Form>
  )
}

export default QuestionCard
