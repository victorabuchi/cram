import { questions } from './jsSyntax'
import { REQUIREMENTS, evaluate } from '../../code/runner'

describe('JavaScript syntax exercises', () => {
  it.each(questions.map((q) => [q.id, q]))('%s: the reference solution passes every test', (_, q) => {
    const r = evaluate(q.solution, q.fn, q.tests)
    expect(r.error).toBeNull()
    expect(r.results.filter((x) => !x.pass).map((x, n) => n)).toEqual([])
    for (const req of q.requires ?? []) expect(REQUIREMENTS[req].test(q.solution)).toBe(true)
  })

  it.each(questions.map((q) => [q.id, q]))('%s: the starter code does not pass by accident', (_, q) => {
    const r = evaluate(q.starter, q.fn, q.tests)
    expect(r.results.every((x) => x.pass)).toBe(false)
  })

  it.each(questions.map((q) => [q.id, q]))('%s: its first tests are the examples from the task', (_, q) => {
    expect(q.examples).toBeGreaterThan(0)
    const text = q.prompt.join('\n')
    for (const t of q.tests.slice(0, q.examples)) {
      const call = `${q.fn}(${t.args.map((a) => JSON.stringify(a).replace(/,/g, ', ').replace(/"/g, '"')).join(', ')})`
      expect(text.replace(/\s+/g, ' ')).toContain(call.replace(/\s+/g, ' ').replace(/\[ /g, '['))
    }
  })
})
