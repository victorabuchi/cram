// Checks that every "Learn more" link still opens: `npm run check-links` (needs internet).
import { linkUrls } from '../src/data/related.js'

const urls = linkUrls()
let bad = 0
for (const url of urls) {
  try {
    const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
  } catch (e) {
    bad++
    console.log(`BROKEN  ${url}  (${e.message})`)
  }
}
console.log(`${urls.length - bad} of ${urls.length} links open.`)
process.exit(bad ? 1 : 0)
