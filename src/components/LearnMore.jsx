import { learnMoreLinks } from '../data/related'

// "Learn more" links under an answer: the MDN and W3Schools pages that explain what the question is about.
// Shown for Web Programming I questions.
function LearnMore({ item }) {
  if (item.subject !== 'webprog') return null
  const topics = learnMoreLinks(item)
  if (!topics.length) return null
  return (
    <div className="learn-more mt-2 small">
      <strong>Learn more:</strong>{' '}
      {topics.map((t, i) => (
        <span key={t.label}>
          {i > 0 && ' · '}
          {t.label}{' '}
          ({t.links.map((l, j) => (
            <span key={l.name}>
              {j > 0 && ', '}
              <a href={l.url} target="_blank" rel="noreferrer">{l.name}<span className="visually-hidden"> for {t.label} (opens in a new tab)</span></a>
            </span>
          ))})
        </span>
      ))}
    </div>
  )
}

export default LearnMore
