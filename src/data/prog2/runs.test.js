import { describe, expect, it } from 'vitest'
import { javaAvailable, runJava } from '../../../server/runner-core.mjs'
import { buildFiles, runs } from './runs'
import { questions } from './index'

const normalize = (t) => t.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').trim()
const java = questions.filter((q) => q.lang === 'java')
const real = javaAvailable() ? describe : describe.skip

describe('Java run specs', () => {
  it('every Java exercise has one', () => {
    expect(java.filter((q) => !q.run).map((q) => q.id)).toEqual([])
    expect(Object.keys(runs).sort()).toEqual(java.map((q) => q.id).sort())
  })
})

// These compile and run real Java, so they need a JDK on the machine running the tests.
real('Java exercises with the JDK', () => {
  it.each(java.map((q) => [q.id, q]))('%s: the reference solution prints exactly the expected output', async (_, q) => {
    const r = await runJava({ files: buildFiles(q.run, q.solution), main: q.run.main, timeoutMs: 8000 })
    expect(r.stderr).toBe('')
    expect(normalize(r.stdout)).toBe(normalize(q.run.expect))
  }, 30000)

  it.each(java.map((q) => [q.id, q]))('%s: the starter code does not pass by accident', async (_, q) => {
    const r = await runJava({ files: buildFiles(q.run, q.starter), main: q.run.main, timeoutMs: 8000 })
    expect(r.ok && normalize(r.stdout) === normalize(q.run.expect)).toBe(false)
  }, 30000)
})
