// A PDF shown exactly as it was written, in the browser's own PDF viewer.
// `page` opens a given page (used for the exercise answers). The link is for browsers that do not show PDFs inline.
const base = import.meta.env.BASE_URL ?? './'

function PdfViewer({ file, title, page, height = '80vh' }) {
  const url = `${base}docs/${file}`
  return (
    <div>
      <iframe
        title={title}
        src={`${url}#${page ? `page=${page}&` : ''}view=FitH`}
        className="pdf-frame"
        style={{ height }}
      />
      <p className="small text-body-secondary mt-2 mb-0">
        Cannot see the PDF? <a href={url} target="_blank" rel="noreferrer">Open {title} in a new tab</a>.
      </p>
    </div>
  )
}

export default PdfViewer
