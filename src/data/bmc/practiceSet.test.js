import { describe, expect, it } from 'vitest'
import { dfa, examplesOf, language, partitionSteps, words } from '../../test/formal'
import { taskMatches } from './taskMatches'
import { PRACTICE_AUTOMATA, PRACTICE_FA, PRACTICE_FA_REGEX, PRACTICE_FA_TEXT, PRACTICE_GRAMMARS, PRACTICE_MODEL_FA, PRACTICE_REGEX, practiceSet } from './practiceSet'

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

describe('Practice 1: factorization and the square root', () => {
  it('1.1: trial division of an n-digit number takes 10^(n/2) / 10⁶ / 86 400 days, as in the table', () => {
    const days = (n) => 10 ** (n / 2) / 1e6 / 86400
    expect(days(10)).toBeCloseTo(1.16e-6, 7)
    expect(days(20)).toBeCloseTo(0.116, 3)
    expect(days(20) * 24).toBeCloseTo(2.78, 2) // about 3 hours
    expect(days(40) / 1.2e9).toBeCloseTo(1, 1)
    expect(days(40) / 365.25).toBeGreaterThan(3e6)
    expect(days(100) / 1.2e39).toBeCloseTo(1, 1)
    expect(answerText('bmc-set-1-1')).toContain('40 | 10²⁰      | 10¹⁴    | 1.2 · 10⁹')
  })
  it('1.2: binary search finds √144 in the tries of the answer, and takes about log₂ k tries', () => {
    const search = (k) => {
      const tries = []
      let lo = 1
      let hi = k
      while (lo <= hi) {
        const x = Math.floor((lo + hi) / 2)
        tries.push(x)
        if (x * x === k) return { x, tries }
        if (x * x > k) hi = x - 1
        else lo = x + 1
      }
      return { x: null, tries }
    }
    expect(search(144)).toEqual({ x: 12, tries: [72, 36, 18, 9, 13, 11, 12] })
    expect(search(150).x).toBe(null)
    for (const k of [10, 999, 123456, 98765432]) expect(search(k).tries.length).toBeLessThanOrEqual(Math.ceil(Math.log2(k)) + 1)
    expect(answerText('bmc-set-1-2')).toContain('tries 72, 36, 18, 9, 13, 11, 12')
  })
})

describe('Practice 2: draw the languages as finite automata', () => {
  for (const set of ['swapped', 'other']) {
    it(`${set}: the automata accept exactly the expressions, and the example words in the answer are right`, () => {
      for (const [k, r] of Object.entries(PRACTICE_FA_REGEX[set])) {
        const sigma = k === 'e' ? ['0', '1'] : ['a', 'b', 'c']
        const f = dfa(PRACTICE_FA[set][k])
        for (const w of words(sigma, 7)) expect(f(w), `${set} ${k} ${w}`).toBe(re(r).test(w))
      }
      const examples = examplesOf(PRACTICE_FA_TEXT[set])
      expect(Object.keys(examples)).toEqual(['a', 'b', 'c', 'd', 'e'])
      for (const [k, { yes, no }] of Object.entries(examples)) {
        for (const w of yes) expect(re(PRACTICE_FA_REGEX[set][k]).test(w), `${k} ${w}`).toBe(true)
        for (const w of no) expect(re(PRACTICE_FA_REGEX[set][k]).test(w), `${k} ${w}`).toBe(false)
      }
    })
  }
})

describe('Practice 3: regular or not, three grammars', () => {
  const N = 7
  const upTo = (pred) => new Set([...words(['a', 'b'], N)].filter(pred))
  it('the regular ones are the regular expressions of the answers', () => {
    for (const [set, id] of [['swapped2026', 'bmc-set-3-1'], ['ifEmpty', 'bmc-set-3-2']]) {
      for (const [k, r] of Object.entries(PRACTICE_REGEX[set])) {
        expect(language(PRACTICE_GRAMMARS[set][k], N), `${set} ${k}`).toEqual(upTo((w) => re(r).test(w)))
        expect(answerText(id)).toContain(`(${k}) regular: ${r.startsWith('|') ? `ε | ${r.slice(1)}` : r}`)
      }
    }
    expect(['bbb', 'ba', 'baaaa'].every((w) => re(PRACTICE_REGEX.swapped2026.b).test(w))).toBe(true)
  })
  it('3.2: B → ε | bb gives aⁿb²ᵏ (k ≤ n) and B → b | bB gives aⁿbᵐ (1 ≤ n ≤ m): not regular', () => {
    const split = (w) => /^(a*)(b*)$/.exec(w)
    expect(language(PRACTICE_GRAMMARS.ifEmpty.a, N)).toEqual(upTo((w) => {
      const m = split(w)
      return !!m && m[2].length % 2 === 0 && m[2].length <= 2 * m[1].length
    }))
    expect(language(PRACTICE_GRAMMARS.ifEmpty.c, N)).toEqual(upTo((w) => {
      const m = split(w)
      return w === '' || (!!m && m[1].length >= 1 && m[2].length >= m[1].length)
    }))
    const a = language(PRACTICE_GRAMMARS.ifEmpty.a, N)
    expect(['aa', 'aabb', 'aabbbb'].every((w) => a.has(w)) && !a.has('abbbb')).toBe(true)
  })
})

describe('Practice 4: which model recognizes each language', () => {
  const count = (w, c) => [...w].filter((x) => x === c).length
  it('the finite automata of the answers accept exactly those languages', () => {
    for (const w of words(['0', '1'], 8)) {
      expect(dfa(PRACTICE_MODEL_FA.ends01)(w), w).toBe(w.endsWith('01'))
      expect(dfa(PRACTICE_MODEL_FA.zerosOnes)(w), w).toBe(/^0*1*$/.test(w))
      expect(dfa(PRACTICE_MODEL_FA.upTo3)(w), w).toBe(['', '01', '0011', '000111'].includes(w))
    }
    for (const w of words(['1'], 12)) expect(dfa(PRACTICE_MODEL_FA.ones3)(w), w).toBe(w.length % 3 === 0)
  })
  it('the example words fit the languages', () => {
    const lines = (id) => answerText(id).split('\n').filter((l) => /^[a-d]\) /.test(l)).map((l) => l.replace(/.*: /, '').split(', ').map((w) => (w === 'ε' ? '' : w)))
    const [a, b, c, d] = lines('bmc-set-4-1')
    const dLang = (w) => Array.from({ length: w.length + 1 }, (_, p) => Array.from({ length: w.length + 1 }, (_, r) => '0'.repeat(p) + '1'.repeat(r) + '0'.repeat(p + r))).flat().includes(w)
    expect(a.every((w) => /^1+0+$/.test(w) && count(w, '1') === count(w, '0'))).toBe(true)
    expect(b.every((w) => w.endsWith('01'))).toBe(true)
    expect(c.every((w) => /^1*$/.test(w) && w.length % 3 === 0)).toBe(true)
    expect(d.every(dLang)).toBe(true)
    const [a2, b2, c2, d2] = lines('bmc-set-4-2')
    expect(a2.every((w) => { const n = w.length / 3; return w === '0'.repeat(n) + '1'.repeat(n) + '0'.repeat(n) })).toBe(true)
    expect(b2.every((w) => /^0*1*$/.test(w))).toBe(true)
    expect(c2.every((w) => count(w, '0') === count(w, '1'))).toBe(true)
    expect(d2).toEqual(['', '01', '0011', '000111'])
  })
})

describe('Practice quiz data', () => {
  it('belongs to the eight groups of the 2026 practice set page, in the same order, with unique ids and an answer', () => {
    const topics = taskMatches.filter((m) => m.tasks.length).map((m) => m.topic)
    expect([...new Set(practiceSet.map((p) => p.group))]).toEqual(topics)
    expect(new Set(practiceSet.map((p) => p.id)).size).toBe(practiceSet.length)
    for (const p of practiceSet) expect(p.answer.length, p.id).toBeGreaterThan(0)
  })
})
