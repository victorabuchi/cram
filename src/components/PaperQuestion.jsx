import { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import Automaton from './Automaton.jsx'
import TermModal from './TermModal.jsx'

const base = import.meta.env.BASE_URL ?? './'

// A pen-and-paper exercise: read it, solve it on paper, show the teacher's answer. Only then do the extras appear: the plain-words
// explanation (on request) and the topics to look up. Then say whether you got it.
// onScore(correct) fires when you choose. The parent gives it key={item.id} so it starts fresh for each question.
function PaperQuestion({ item, onScore, onNext, onUnsure, unsureLabel = 'I need to practise this', lastLabel = 'Next' }) {
  const [shown, setShown] = useState(false)
  const [simple, setSimple] = useState(false)
  const [verdict, setVerdict] = useState(null)
  const [term, setTerm] = useState(null)
  const pages = item.pages ?? [item.page]

  const choose = (correct) => {
    setVerdict(correct)
    onScore(correct)
    if (!correct) onUnsure?.(item)
  }

  return (
    <div>
      <h2 className="h5">{item.title}</h2>
      {item.prompt.map((p, i) => <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>)}
      {item.diagram && <Automaton automaton={item.diagram} />}

      <p className="text-body-secondary">Solve it on paper first, like in the test. Then check your answer.</p>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button variant={shown ? 'secondary' : 'primary'} onClick={() => setShown(!shown)} aria-expanded={shown}>{shown ? 'Hide answer' : 'Show answer'}</Button>
        {shown && item.simple && <Button variant={simple ? 'secondary' : 'success'} onClick={() => setSimple(!simple)} aria-expanded={simple}>{simple ? 'Hide the simple explanation' : 'Explain it simply'}</Button>}
      </div>
      {shown && simple && (
        <Alert variant="light" className="border" role="region" aria-label="Simple explanation">
          <strong>The idea, step by step</strong>
          <ol className="mb-0 mt-2">{item.simple.map((s) => <li key={s} className="mb-2">{s}</li>)}</ol>
        </Alert>
      )}
      {shown && (
        <>
          <Alert variant="light" className="border" role="region" aria-label="Answer">
            <strong>Answer</strong>
            {item.answer.map((a, i) => (typeof a === 'string'
              ? <p key={i} className="mb-2 mt-2" style={{ whiteSpace: 'pre-line' }}>{a}</p>
              : <pre key={i} className="code"><code>{a.code}</code></pre>))}
          </Alert>
          {item.terms && (
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="small text-body-secondary">Look up:</span>
              {item.terms.map((t) => <Button key={t.wiki} size="sm" variant="primary" onClick={() => setTerm(t)}>{t.label}</Button>)}
            </div>
          )}
          {item.answerDiagram && (
            <>
              <h3 className="h6">The answer as a diagram</h3>
              <Automaton automaton={item.answerDiagram} />
            </>
          )}
          {item.pdf && (
            <>
            <h3 className="h6">The teacher's {pages.length > 1 ? 'pages' : 'page'}</h3>
            {pages.map((n) => (
              <img
                key={n}
                src={`${base}docs/pages/${item.pdf.replace('.pdf', '')}-${n}.jpg`}
                alt={`${item.title}: the teacher's answer, page ${n}`}
                className="answer-page"
                loading="lazy"
              />
            ))}
            <p className="small text-body-secondary mb-0"><a href={`${base}docs/${item.pdf}#page=${pages[0]}`} target="_blank" rel="noreferrer">Open the whole PDF in a new tab</a></p>
            </>
          )}
          <div className="d-flex flex-wrap gap-2 my-3" role="group" aria-label="How did it go?">
            <Button variant={verdict === true ? 'success' : 'outline-success'} aria-pressed={verdict === true} onClick={() => choose(true)}>I solved it</Button>
            <Button variant={verdict === false ? 'danger' : 'outline-danger'} aria-pressed={verdict === false} onClick={() => choose(false)}>{unsureLabel}</Button>
            <Button variant="outline-secondary" onClick={onNext}>{lastLabel}</Button>
          </div>
        </>
      )}
      <TermModal term={term} onHide={() => setTerm(null)} />
    </div>
  )
}

export default PaperQuestion
