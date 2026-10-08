// Runs Java exercises on the Java runner (`npm run java`), a small server on this computer that uses the JDK.
// Without it the exercises fall back to the pattern checks in java.js.
import { buildFiles } from '../data/prog2/runs'

export const RUNNER_URL = 'http://127.0.0.1:8787'

const timeout = (ms) => (typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(ms) : undefined)

// true when the runner answers and has a JDK
export async function runnerAvailable() {
  try {
    const r = await fetch(`${RUNNER_URL}/health`, { signal: timeout(1500) })
    const data = await r.json()
    return !!(data.ok && data.java)
  } catch {
    return false
  }
}

const normalize = (text) => text.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').trim()

// Compiles and runs the student's code with the exercise's harness and compares the printed output with the expected output.
// Resolves { stage: 'compile' | 'run' | 'done', pass, expected, got, error, timedOut }.
export async function runStudentJava(run, code) {
  const response = await fetch(`${RUNNER_URL}/run`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ files: buildFiles(run, code), main: run.main, timeoutMs: 6000 }),
    signal: timeout(30000),
  })
  const r = await response.json()
  const expected = normalize(run.expect)
  if (r.error) return { stage: 'run', pass: false, expected, got: '', error: r.error }
  if (r.stage === 'compile' && !r.ok) return { stage: 'compile', pass: false, expected, got: '', error: r.stderr }
  if (r.timedOut) return { stage: 'run', pass: false, expected, got: normalize(r.stdout), error: 'Time limit exceeded: does your code have an endless loop?', timedOut: true }
  const got = normalize(r.stdout)
  return { stage: 'done', pass: r.ok && got === expected, expected, got, error: r.ok ? '' : r.stderr }
}
