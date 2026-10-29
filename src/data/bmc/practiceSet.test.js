import { describe, expect, it } from 'vitest'
import { dfa, language, partitionSteps, words } from '../../test/formal'
import { taskMatches } from './taskMatches'
import { PRACTICE_AUTOMATA, PRACTICE_GRAMMARS, PRACTICE_REGEX, practiceSet } from './practiceSet'

const re = (r) => new RegExp(`^(?:${r})$`)
const count = (w, c) => [...w].filter((x) => x === c).length
const lengthsWithAcceptedWord = (accepts, maxLen) => {
  const out = []
  for (let n = 0; n <= maxLen; n++) if ([...words(['a', 'b'], n)].some((w) => w.length === n && accepts(w))) out.push(n)
  return out
}
const answerText = (id) => practiceSet.find((p) => p.id === id).answer.map((a) => a.code ?? a).join('\n')
const sameLanguage = (f, g, maxLen = 8) => [...words(['a', 'b'], maxLen)].every((w) => f(w) === g(w))

describe('Practice 1.1: the hexagon with b worth 3', () => {
  const f = dfa(PRACTICE_AUTOMATA.b3)
  const g = dfa(PRACTICE_AUTOMATA.b3With3)
  it('accepts |w|a + 3|w|b ≡ 0 (mod 6): ε and every even length, no odd length', () => {
    for (const w of words(['a', 'b'], 8)) expect(f(w), w).toBe((count(w, 'a') + 3 * count(w, 'b')) % 6 === 0)
    expect(lengthsWithAcceptedWord(f, 10)).toEqual([0, 2, 4, 6, 8, 10])
    expect(['bb', 'aaab', 'aaaaaa'].every(f)).toBe(true)
  })
  it('is minimal, in the partition steps of the answer', () => {
    expect(partitionSteps(PRACTICE_AUTOMATA.b3)).toEqual([
      [['0'], ['1', '2', '3', '4', '5']],
      [['0'], ['1', '2', '4'], ['3'], ['5']],
      [['0'], ['1'], ['2'], ['3'], ['4'], ['5']],
    ])
    expect(answerText('bmc-more-1-1')).toContain('P1 = {0}, {1,2,4}, {3}, {5}')
  })
  it('with state 3 accepting: the number of a\'s is a multiple of 3, every length, 3 states', () => {
    for (const w of words(['a', 'b'], 8)) expect(g(w), w).toBe(count(w, 'a') % 3 === 0)
    expect(lengthsWithAcceptedWord(g, 9)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(partitionSteps(PRACTICE_AUTOMATA.b3With3)).toEqual([[['0', '3'], ['1', '2', '4', '5']], [['0', '3'], ['1', '4'], ['2', '5']]])
    expect(sameLanguage(g, dfa(PRACTICE_AUTOMATA.b3Min))).toBe(true)
  })
})

describe('Practice 1.2: the octagon (mod 8)', () => {
  const f = dfa(PRACTICE_AUTOMATA.mod8)
  const g = dfa(PRACTICE_AUTOMATA.mod8With4)
  it('accepts |w|a + 2|w|b ≡ 0 (mod 8): ε and every length from 4', () => {
    for (const w of words(['a', 'b'], 9)) expect(f(w), w).toBe((count(w, 'a') + 2 * count(w, 'b')) % 8 === 0)
    expect(lengthsWithAcceptedWord(f, 11)).toEqual([0, 4, 5, 6, 7, 8, 9, 10, 11])
    expect(['bbbb', 'aabbb', 'aaaabb', 'aaaaaab'].every(f)).toBe(true)
  })
  it('is minimal after four partition steps, as in the answer', () => {
    expect(partitionSteps(PRACTICE_AUTOMATA.mod8)).toEqual([
      [['0'], ['1', '2', '3', '4', '5', '6', '7']],
      [['0'], ['1', '2', '3', '4', '5'], ['6'], ['7']],
      [['0'], ['1', '2', '3'], ['4'], ['5'], ['6'], ['7']],
      [['0'], ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7']],
    ])
  })
  it('with state 4 accepting: mod 4, every length except 1, 4 states', () => {
    for (const w of words(['a', 'b'], 8)) expect(g(w), w).toBe((count(w, 'a') + 2 * count(w, 'b')) % 4 === 0)
    expect(lengthsWithAcceptedWord(g, 9)).toEqual([0, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(['bb', 'aab'].every(g)).toBe(true)
    expect(partitionSteps(PRACTICE_AUTOMATA.mod8With4).at(-1)).toEqual([['0', '4'], ['1', '5'], ['2', '6'], ['3', '7']])
    expect(sameLanguage(g, dfa(PRACTICE_AUTOMATA.mod8Min))).toBe(true)
  })
})

describe('Practice 2: which grammar is not regular', () => {
  const N = 7
  const upTo = (pred) => new Set([...words(['a', 'b'], N)].filter(pred))
  for (const set of ['swapped', 'mixed']) {
    it(`${set}: the regular expressions generate exactly the grammars' languages (up to length ${N}), and are in the answer`, () => {
      const text = answerText(set === 'swapped' ? 'bmc-more-2-1' : 'bmc-more-2-2')
      for (const [k, r] of Object.entries(PRACTICE_REGEX[set])) {
        expect(language(PRACTICE_GRAMMARS[set][k], N), `${set} ${k}`).toEqual(upTo((w) => re(r).test(w)))
        expect(text).toContain(`(${k}) ${r.startsWith('|') ? `ε | ${r.slice(1)}` : r}`)
      }
    })
  }
  it('the non-regular ones: bⁿaᵐ (m ≥ n, m − n even) and aⁿbⁿ', () => {
    const bnam = /^(b*)(a*)$/
    expect(language(PRACTICE_GRAMMARS.swapped.e, N)).toEqual(upTo((w) => {
      const m = w.match(bnam)
      return !!m && (w === '' || (m[1].length >= 1 && m[2].length >= m[1].length && (m[2].length - m[1].length) % 2 === 0))
    }))
    expect(language(PRACTICE_GRAMMARS.mixed.b, N)).toEqual(upTo((w) => /^a*b*$/.test(w) && count(w, 'a') === count(w, 'b')))
  })
})

describe('Practice quiz data', () => {
  it('belongs to the four 2026 set groups, with unique ids and an answer', () => {
    const topics = taskMatches.filter((m) => m.tasks.length).map((m) => m.topic)
    expect([...new Set(practiceSet.map((p) => p.group))]).toEqual(topics)
    expect(new Set(practiceSet.map((p) => p.id)).size).toBe(practiceSet.length)
    for (const p of practiceSet) expect(p.answer.length, p.id).toBeGreaterThan(0)
  })
})
