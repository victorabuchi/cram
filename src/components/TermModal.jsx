import { Alert, Button, Modal, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { w3Url } from '../data/terms'
import { useMdnArticle } from '../hooks/useMdnArticle'
import { useTerms } from '../hooks/useTerms'
import { useWikiArticle } from '../hooks/useWikiArticle'

// Popup for one glossary term. A term with an MDN page shows its MDN summary (with a link to the full page and to W3Schools);
// any other term shows its Wikipedia summary. `term` is { label, wiki, mdn?, w3? } or null.
function TermModal({ term, onHide }) {
  const mdn = useMdnArticle(term?.mdn ?? null)
  const wiki = useWikiArticle(term && !term.mdn ? term.wiki : null)
  const { saved, dispatch } = useTerms()
  const { status, article, error } = term?.mdn ? mdn : wiki
  const isSaved = !term?.mdn && article && saved.some((t) => t.key === article.key)

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
        {status === 'missing' && <Alert variant="warning" className="mb-0">No article found for this term.</Alert>}
        {status === 'ready' && term.mdn && (
          <>
            {article.paragraphs.length ? article.paragraphs.map((p) => <p key={p}>{p}</p>) : <p>MDN has no short summary for this page. Open it for the full explanation.</p>}
            <p className="small text-body-secondary mb-2">
              From <a href={article.url} target="_blank" rel="noreferrer">MDN Web Docs <span className="visually-hidden">(opens in a new tab)</span></a> by Mozilla contributors, licensed CC BY-SA 2.5. Open the page for the full explanation and examples.
            </p>
          </>
        )}
        {status === 'ready' && !term.mdn && (
          <>
            {article.description && <p className="text-body-secondary fst-italic">{article.description}</p>}
            {article.thumbnail && <img className="thumb float-end ms-3 mb-2" src={article.thumbnail} alt={`Illustration for ${article.title}`} />}
            <p>{article.extract}</p>
            <a href={article.url} target="_blank" rel="noreferrer">Read more on Wikipedia <span className="visually-hidden">(opens in a new tab)</span></a>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {term?.w3 && <a className="btn btn-outline-primary" href={w3Url(term)} target="_blank" rel="noreferrer">W3Schools page <span className="visually-hidden">(opens in a new tab)</span></a>}
        {term?.mdn && <a className="btn btn-outline-primary" href={`https://developer.mozilla.org/en-US/docs/${article?.slug ?? ''}`} target="_blank" rel="noreferrer" hidden={!article}>Full MDN page <span className="visually-hidden">(opens in a new tab)</span></a>}
        {status === 'ready' && !term.mdn && <Button variant={isSaved ? 'outline-secondary' : 'outline-primary'} onClick={toggleSave}>{isSaved ? 'Remove from my terms' : 'Save to my terms'}</Button>}
        {term && <Button as={Link} to={`/s/webprog/glossary?term=${encodeURIComponent(term.wiki)}`} onClick={onHide}>Open in Glossary</Button>}
      </Modal.Footer>
    </Modal>
  )
}

export default TermModal
