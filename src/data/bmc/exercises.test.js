import { describe, expect, it } from 'vitest'
import { countTrees, dfa, language, pdaAccepts, tmRun, words } from '../../test/formal'
import { FA7, PDA7, REGEX7, TM_PLUS_ONE, questions as x7 } from './exercise7'
import { questions as x5 } from './exercise5'
import { questions as x6 } from './exercise6'

const re = (r) => new RegExp(`^(?:${r})$`)

describe('Exercise 5', () => {
  const grammar = 'S → A\nA → aAc | B\nB → bBc | C\nC → cC | c'
  it('T1: the four words have parse trees, aabbccc does not', () => {
    const lang = language(grammar, 9)
    expect(['aabbccccc', 'bbccc', 'c', 'acc'].every((w) => lang.has(w))).toBe(true)
    expect(lang.has('aabbccc')).toBe(false)
    const leaves = (text) => text.split('\n').map((l) => l.trim().split(' ').pop()).filter((s) => /^[abc]$/.test(s)).join('')
    const trees = x5[0].answer.filter((a) => a.code).map((a) => leaves(a.code))
    expect(trees).toEqual(['aabbccccc', 'bbccc', 'c', 'acc'])
  })

  it('T2: a) is (b*a(bb)*)*, c) is regular: ε | (b*a)(b*a)*(bb)*', () => {
    const a = language('S → ε | ABS\nA → a | bA\nB → ε | bBb', 7)
    const c = language('S → ε | ASB\nA → a | bA\nB → ε | bBb', 7)
    for (const w of words(['a', 'b'], 7)) {
      expect(a.has(w), w).toBe(re('(b*a(bb)*)*').test(w))
      expect(c.has(w), w).toBe(re('|(b*a)(b*a)*(bb)*').test(w))
    }
  })

  it('T3: the grammars match the descriptions (2 = 111, 1 = odd length, 3 = same ends, 4 = equal counts)', () => {
    const g1 = language('S → BA\nA → BBA | ε\nB → 0 | 1', 7)
    const g2 = language('S → A111A\nA → 0A | 1A | ε', 7)
    const g3 = language('S → 0A0 | 1A1\nA → 0A | 1A | ε', 7)
    const g4 = language('S → SS | 0S1 | 1S0 | ε', 6)
    for (const w of words(['0', '1'], 7)) {
      expect(g1.has(w), w).toBe(w.length % 2 === 1)
      expect(g2.has(w), w).toBe(w.includes('111'))
      expect(g3.has(w), w).toBe(w.length >= 2 && w[0] === w.at(-1))
    }
    for (const w of words(['0', '1'], 6)) expect(g4.has(w), w).toBe([...w].filter((c) => c === '0').length * 2 === w.length)
  })

  it('T6: the new grammar has one parse tree for 1+2*3, the old one two', () => {
    const old = 'E → D | (E) | E+E | E-E | E*E | E/E\nD → 1 | 2 | 3'
    const fixed = 'E → T | E+T | E-T\nT → F | T*F | T/F\nF → D | (E)\nD → 1 | 2 | 3'
    expect(countTrees(old, 'E', '1+2*3')).toBe(2)
    expect(countTrees(fixed, 'E', '1+2*3')).toBe(1)
    expect(countTrees(fixed, 'E', '1-2-3')).toBe(1)
    expect(countTrees(fixed, 'E', '3/(1-2)')).toBe(1)
  })
})

describe('Exercise 6', () => {
  it('T2: the table values are 2ⁿ / x / 86 400 days', () => {
    const days = (n, x) => 2 ** n / x / 86400
    expect(days(30, 100)).toBeCloseTo(124.27, 1)
    expect(days(20, 100)).toBeCloseTo(0.121, 3)
    expect(days(50, 1e6)).toBeCloseTo(13031, -1) // the teacher's table says 13.0: corrected in the answer
    expect(days(100, 1e6) / 1.47e19).toBeCloseTo(1, 1)
    expect(x6.find((q) => q.id === 'bmc-x6-2').answer[1].code).toContain(' 30 | 1,073M     | 124.2')
  })

  it('T3: 16, 21 and 24 variables in an hour, a day and a week', () => {
    const maxN = (seconds) => Math.floor(Math.log2(seconds / 0.03))
    expect([maxN(3600), maxN(86400), maxN(604800)]).toEqual([16, 21, 24])
  })
})

describe('Exercise 7', () => {
  const pairs = (w) => [...w].slice(1).filter((c, i) => (c === 'a' && w[i] === 'c') || (c === 'c' && w[i] === 'a')).length
  it('t2: the regular expressions describe the languages', () => {
    for (const w of words(['a', 'b', 'c'], 7)) {
      expect(re(REGEX7.a).test(w), `a ${w}`).toBe(pairs(w) >= 1)
      expect(re(REGEX7.b).test(w), `b ${w}`).toBe(pairs(w) === 0)
      expect(re(REGEX7.c).test(w), `c ${w}`).toBe(pairs(w) === 1)
      const d = [...w].filter((c) => c === 'c').length === 1 && w.length >= 2 && !w.startsWith('aa')
      expect(re(REGEX7.d1).test(w), `d1 ${w}`).toBe(d)
      expect(re(REGEX7.d2).test(w), `d2 ${w}`).toBe(d)
    }
  })

  it('t3: the Turing machine adds 1', () => {
    for (const [inp, out] of [['1101', '1110'], ['000111', '001000'], ['0', '1'], ['1', '10'], ['100', '101'], ['111', '1000'], ['1011', '1100']]) expect(tmRun(TM_PLUS_ONE, inp), inp).toBe(out)
    for (let n = 0; n < 64; n++) expect(tmRun(TM_PLUS_ONE, n.toString(2))).toBe((n + 1).toString(2))
  })

  it('t4: the automata accept the regular expressions', () => {
    const pairsOf = { a: ['a*cb*', ['a', 'b', 'c']], b: ['(ab)*', ['a', 'b']], c: ['(abba)*', ['a', 'b']], d: ['a+b+', ['a', 'b']] }
    for (const [key, [r, sigma]] of Object.entries(pairsOf)) for (const w of words(sigma, 8)) expect(dfa(FA7[key])(w), `${key} ${w}`).toBe(re(r).test(w))
    for (const w of words(['0', '1'], 9)) expect(dfa(FA7.e)(w), w).toBe(w.length === 8)
  })

  it('t5: the pushdown automata accept aⁿb²ⁿ (n > 0) and aⁿbᵐ (m > n > 1)', () => {
    for (const w of words(['a', 'b'], 9)) {
      const m = /^(a*)(b*)$/.exec(w)
      const n = m ? m[1].length : -1
      const k = m ? m[2].length : -1
      expect(pdaAccepts(PDA7.a, w), `a ${w}`).toBe(!!m && n > 0 && k === 2 * n)
      expect(pdaAccepts(PDA7.b, w), `b ${w}`).toBe(!!m && k > n && n > 1)
    }
  })

  it('t6: aabacad and abacada are in F, aaa is ambiguous, S → CS | C fixes it and keeps the language', () => {
    const F = 'S → SS | C\nA → aB\nB → bCd | ε\nC → AD\nD → cC | ε'
    const fixed = 'S → CS | C\nA → aB\nB → bCd | ε\nC → AD\nD → cC | ε'
    const lang = language(F, 7)
    expect(lang.has('aabacad') && lang.has('abacada')).toBe(true)
    expect(countTrees(F, 'S', 'aaa')).toBeGreaterThan(1)
    expect(countTrees(fixed, 'S', 'aaa')).toBe(1)
    const lf = language(fixed, 6)
    const l6 = language(F, 6)
    for (const w of words(['a', 'b', 'c', 'd'], 6)) expect(lf.has(w), w).toBe(l6.has(w))
    expect(x7.find((q) => q.id === 'bmc-x7-6').answer[1].code).toContain('→ aabacad')
  }, 60000)
})
