import { Alert, Button, Modal, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTerms } from '../hooks/useTerms'
import { useWikiArticle } from '../hooks/useWikiArticle'

// Popup with the Wikipedia summary for one glossary term. `term` is { label, wiki } or null.
function TermModal({ term, onHide }) {
  const { status, article, error } = useWikiArticle(term?.wiki ?? null)
  const { saved, dispatch } = useTerms()
  const isSaved = article && saved.some((t) => t.key === article.key)

  const toggleSave = () => {
    if (isSaved) {
      dispatch({ type: 'remove', key: article.key })
      toast.info(`Removed ${article.title}`)
    } else {
      dispatch({ type: 'save', term: { key: article.key, title: article.title } })
      toast.success(`Saved ${article.title}`)
    }
  }

  return (
    <Modal show={!!term} onHide={onHide} centered aria-labelledby="term-title">
      <Modal.Header closeButton>
        <Modal.Title id="term-title" as="h2" className="h5">{article?.title ?? term?.label}</Modal.Title>
      </Modal.Header>
      <Modal.Body aria-live="polite" aria-busy={status === 'loading'}>
        {status === 'loading' && <div className="text-center"><Spinner animation="border" role="status"><span className="visually-hidden">Loading…</span></Spinner></div>}
        {status === 'error' && <Alert variant="danger" className="mb-0">{error}</Alert>}
        {status === 'missing' && <Alert variant="warning" className="mb-0">No Wikipedia article found for this term.</Alert>}
        {status === 'ready' && (
          <>
            {article.description && <p className="text-body-secondary fst-italic">{article.description}</p>}
            {article.thumbnail && <img className="thumb float-end ms-3 mb-2" src={article.thumbnail} alt={`Illustration for ${article.title}`} />}
            <p>{article.extract}</p>
            <a href={article.url} target="_blank" rel="noreferrer">Read more on Wikipedia<span className="visually-hidden"> (opens in a new tab)</span></a>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {status === 'ready' && <Button variant={isSaved ? 'outline-secondary' : 'outline-primary'} onClick={toggleSave}>{isSaved ? 'Remove from my terms' : 'Save to my terms'}</Button>}
        {term && <Button as={Link} to={`/glossary?term=${encodeURIComponent(term.wiki)}`} onClick={onHide}>Open in Glossary</Button>}
      </Modal.Footer>
    </Modal>
  )
}

export default TermModal
