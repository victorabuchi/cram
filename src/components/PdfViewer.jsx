import { memo, useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'

const base = import.meta.env.BASE_URL ?? './'
const MIN_ZOOM = 0.5
const MAX_ZOOM = 4

// pdf.js is large, so it is loaded only when a PDF is opened.
let pdfjsPromise
const loadPdfjs = () => {
  pdfjsPromise ??= Promise.all([import('pdfjs-dist/legacy/build/pdf.min.mjs'), import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')]).then(([lib, worker]) => {
    lib.GlobalWorkerOptions.workerSrc = worker.default
    return lib
  })
  return pdfjsPromise
}

const canDrawPages = () => {
  try {
    return !!document.createElement('canvas').getContext('2d')
  } catch {
    return false
  }
}

// One page, drawn on a canvas when it scrolls into view and drawn again when the size changes.
const PageCanvas = memo(function PageCanvas({ pdf, number, width, height, title, root }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    let task = null
    let drawn = false
    const draw = async () => {
      if (drawn) return
      drawn = true
      const page = await pdf.getPage(number)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const unscaled = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({ scale: (width / unscaled.width) * dpr })
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      task = page.render({ canvasContext: canvas.getContext('2d'), viewport })
      try {
        await task.promise
      } catch {
        /* cancelled by a newer size */
      }
    }
    const observer = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && draw(), { root, rootMargin: '800px 0px' })
    observer.observe(canvas)
    return () => {
      observer.disconnect()
      task?.cancel()
    }
  }, [pdf, number, width, root])
  return <canvas ref={canvasRef} role="img" aria-label={`${title}, page ${number}`} className="pdf-page" style={{ width, height }} />
})

// A PDF shown page by page, exactly as it was written, sized to fit the screen, with zoom buttons (phones show only the first page of a normal PDF frame).
// `page` (only used by the plain-frame fallback) opens a given page.
function PdfViewer({ file, title, page, height = '80vh' }) {
  const url = `${base}docs/${file}`
  const [zoom, setZoom] = useState(1)
  const [pdf, setPdf] = useState(null)
  const [sizes, setSizes] = useState([])
  const [state, setState] = useState('loading') // loading | ready | error
  const [boxWidth, setBoxWidth] = useState(0)
  const [box, setBox] = useState(null)
  const supported = canDrawPages()

  useEffect(() => {
    if (!supported) return
    let cancelled = false
    let doc
    loadPdfjs()
      .then((lib) => lib.getDocument({ url }).promise)
      .then(async (d) => {
        doc = d
        const pages = await Promise.all(Array.from({ length: d.numPages }, (_, i) => d.getPage(i + 1).then((p) => p.getViewport({ scale: 1 }))))
        if (cancelled) return
        setSizes(pages.map((v) => ({ w: v.width, h: v.height })))
        setPdf(d)
        setState('ready')
      })
      .catch(() => !cancelled && setState('error'))
    return () => {
      cancelled = true
      doc?.destroy()
    }
  }, [url, supported])

  useEffect(() => {
    if (!box) return
    const update = () => setBoxWidth(box.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(box)
    return () => observer.disconnect()
  }, [box, state])

  const openLink = <a href={url} target="_blank" rel="noreferrer">Open {title} in a new tab</a>

  // Without canvas support (very old browsers), fall back to the browser's own PDF frame.
  if (!supported || state === 'error') {
    return (
      <div>
        <iframe title={title} src={`${url}#${page ? `page=${page}&` : ''}view=FitH`} className="pdf-frame" style={{ height }} />
        <p className="small text-body-secondary mt-2 mb-0">Cannot see the PDF? {openLink}.</p>
      </div>
    )
  }

  const fitWidth = Math.max(boxWidth - 16, 100)
  const zoomBy = (factor) => setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z * factor).toFixed(3))))

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar d-flex flex-wrap align-items-center gap-2 mb-2" role="toolbar" aria-label={`Zoom ${title}`}>
        <Button size="sm" variant="secondary" onClick={() => zoomBy(0.8)} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">−</Button>
        <Button size="sm" variant="secondary" onClick={() => zoomBy(1.25)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">+</Button>
        <Button size="sm" variant="primary" onClick={() => setZoom(1)} disabled={zoom === 1}>Fit to screen</Button>
        <span className="small text-body-secondary" aria-live="polite">{Math.round(zoom * 100)}%{sizes.length ? ` · ${sizes.length} pages` : ''}</span>
        <span className="small ms-auto">{openLink}</span>
      </div>
      <div ref={setBox} className="pdf-scroll" style={{ height }} tabIndex={0} role="region" aria-label={title}>
        {state === 'loading' && <p className="p-3 mb-0 text-body-secondary" role="status">Loading the slides…</p>}
        {state === 'ready' && boxWidth > 0 && sizes.map((s, i) => {
          const width = Math.round(fitWidth * zoom)
          return <PageCanvas key={`${url}-${i}`} pdf={pdf} number={i + 1} width={width} height={Math.round((width / s.w) * s.h)} title={title} root={box} />
        })}
      </div>
    </div>
  )
}

export default PdfViewer
