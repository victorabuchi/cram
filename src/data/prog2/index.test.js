import { checkJava } from '../../code/java'
import { questions } from './index'

const java = questions.filter((q) => q.lang === 'java')

describe('Programming II (Java) exercises', () => {
  it.each(java.map((q) => [q.id, q]))('%s: the reference solution passes every check', (_, q) => {
    const r = checkJava(q.solution, q.checks)
    expect(r.results.filter((x) => !x.pass).map((x) => x.label)).toEqual([])
  })

  it.each(java.map((q) => [q.id, q]))('%s: the starter code does not pass by accident', (_, q) => {
    expect(checkJava(q.starter, q.checks).pass).toBe(false)
  })

  it('rejects unbalanced braces', () => {
    expect(checkJava('public void f() {', []).pass).toBe(false)
  })
})
