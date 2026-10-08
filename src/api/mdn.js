// MDN Web Docs summaries. developer.mozilla.org cannot be called from another site (no CORS) and cannot be framed,
// but MDN's text is open source (https://github.com/mdn/content, CC BY-SA 2.5) and raw.githubusercontent.com allows it.
// So a summary is the first paragraph(s) of the page's Markdown file, cleaned up. Always shown with a link back to MDN.
const RAW = 'https://raw.githubusercontent.com/mdn/content/main/files/en-us'

export class MdnError extends Error {}

// {{macro("a", "b")}} -> readable text. Last argument for glossary links (the shown text), first argument for most others.
function macros(text) {
  return text
    .replace(/\{\{\s*glossary\s*\(\s*"([^"]*)"\s*(?:,\s*"([^"]*)"\s*)?[^)]*\)\s*\}\}/gi, (_, a, b) => b ?? a)
    .replace(/\{\{\s*HTMLElement\s*\(\s*"([^"]*)"\s*[^)]*\)\s*\}\}/gi, (_, a) => `<${a}>`)
    .replace(/\{\{\s*\w+\s*\(\s*"([^"]*)"\s*[^)]*\)\s*\}\}/g, (_, a) => a.split('.').pop())
    .replace(/\{\{[^}]*\}\}/g, '')
}

const plain = (text) =>
  macros(text)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>(?=[^<]*<\/)/g, '') // html tags around text
    .replace(/\*\*|__/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// { title, slug, paragraphs[] } from the Markdown source of an MDN page.
export function parseMdn(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) throw new MdnError('Unexpected MDN page format')
  const front = Object.fromEntries(match[1].split('\n').map((l) => l.split(/:\s(.+)/).slice(0, 2)))
  const blocks = match[2].split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  const paragraphs = []
  for (const block of blocks) {
    if (/^(#|[-*>|]|\d+\.|```|<|\{\{[^}]*\}\}$)/.test(block)) {
      if (/^#/.test(block) && paragraphs.length) break // the intro ends at the first heading
      continue
    }
    const text = plain(block)
    if (text.length > 20 && !text.endsWith(':')) paragraphs.push(text) // a sentence that introduces a list is not a summary
    if (paragraphs.length === 2 || paragraphs.join(' ').length > 450) break
  }
  const unquote = (v = '') => v.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
  return { title: unquote(front.title), slug: unquote(front.slug), paragraphs }
}

const cache = new Map()
export const clearMdnCache = () => cache.clear()

// `path` is the lower-case folder of the page under files/en-us, e.g. "glossary/api".
export async function getMdnSummary(path, { signal } = {}) {
  if (cache.has(path)) return cache.get(path)
  const response = await fetch(`${RAW}/${path}/index.md`, { signal })
  if (response.status === 404) return null
  if (!response.ok) throw new MdnError(`MDN answered with status ${response.status}`)
  const page = parseMdn(await response.text())
  const summary = { ...page, url: `https://developer.mozilla.org/en-US/docs/${page.slug}` }
  cache.set(path, summary)
  return summary
}
