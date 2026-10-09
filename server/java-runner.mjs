// A tiny local server that compiles and runs Java for the exercises: `npm run java`.
// It listens on this computer only (127.0.0.1) and answers only the Cram site (GitHub Pages) and localhost pages.
// It runs the code with your JDK without a sandbox, so use it for your own code only.
import { createServer } from 'node:http'
import { javaAvailable, runJava } from './runner-core.mjs'

const PORT = Number(process.env.PORT ?? 8787)
const ALLOWED = [/^https:\/\/victorabuchi\.github\.io$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/]

const server = createServer(async (req, res) => {
  const origin = req.headers.origin ?? ''
  const allowed = ALLOWED.some((re) => re.test(origin))
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Private-Network', 'true') // lets an https page talk to localhost
    res.setHeader('Vary', 'Origin')
  }
  const send = (status, body) => {
    res.writeHead(status, { 'content-type': 'application/json' })
    res.end(JSON.stringify(body))
  }
  if (req.method === 'OPTIONS') return send(allowed ? 204 : 403, {})
  if (!allowed && origin) return send(403, { error: 'Origin not allowed' })

  if (req.method === 'GET' && req.url === '/health') return send(200, { ok: true, java: javaAvailable() })
  if (req.method === 'POST' && req.url === '/run') {
    let body = ''
    for await (const chunk of req) {
      body += chunk
      if (body.length > 200_000) return send(413, { error: 'Too much code' })
    }
    try {
      const { files, main, timeoutMs } = JSON.parse(body)
      if (!files || typeof files !== 'object') return send(400, { error: 'files is required' })
      return send(200, await runJava({ files, main, timeoutMs: Math.min(Number(timeoutMs) || 5000, 15000) }))
    } catch (e) {
      return send(400, { error: String(e) })
    }
  }
  return send(404, { error: 'Not found' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Java runner on http://127.0.0.1:${PORT} (${javaAvailable() ? 'JDK found' : 'NO JDK FOUND: install one, e.g. brew install openjdk'})`)
  console.log('Keep this window open while you practise. Ctrl+C stops it.')
})
