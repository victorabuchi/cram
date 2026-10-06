import { renderToStaticMarkup } from 'react-dom/server'
import Automaton from '../components/Automaton.jsx'
import { computeLayout } from './layout'
import { toAutomaton, toJff } from './model'

// A standalone SVG file with fixed size, so it opens correctly outside the page.
export function toSvgFile(def) {
  const a = toAutomaton(def)
  const { viewBox: vb } = computeLayout(a)
  const scale = 1.2
  return renderToStaticMarkup(<Automaton automaton={a} width={Math.round(vb.w * scale)} height={Math.round(vb.h * scale)} maxWidth={99999} scroll={false} />)
}

export const toJffFile = (def) => {
  const a = toAutomaton(def)
  return toJff(a, computeLayout(a).pos)
}

export function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = Object.assign(document.createElement('a'), { href: url, download: filename })
  link.click()
  URL.revokeObjectURL(url)
}

// Draws the SVG on a canvas (2x for sharpness) and saves it as a PNG.
export function downloadPng(def, filename) {
  const svg = toSvgFile(def)
  const image = new Image()
  image.onload = () => {
    const canvas = Object.assign(document.createElement('canvas'), { width: image.width * 2, height: image.height * 2 })
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      Object.assign(document.createElement('a'), { href: url, download: filename }).click()
      URL.revokeObjectURL(url)
    })
  }
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
