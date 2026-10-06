import { AT_LEAST_ONE_B, EXACTLY_ONE_B_COMPLETE, A_ODD_OR_B_EVEN, A_ODD_XOR_B_EVEN, CONTAINS_00, CONTAINS_BB, EXACTLY_ONE_B, HAS_112, NO_ABC, ODD_A, PARITY_01, SUM_MOD_6, SUM_MOD_6_NEGATIVE, SUM_MOD_6_NEGATIVE_EXCERPT } from './automata'
import { check, parseAutomaton, run } from '../../automata/model'

// Every string over `alphabet` up to `maxLen` characters.
function* strings(alphabet, maxLen) {
  let level = ['']
  yield ''
  for (let n = 1; n <= maxLen; n++) {
    level = level.flatMap((s) => alphabet.map((c) => s + c))
    yield* level
  }
}
const count = (s, c) => s.split(c).length - 1

// The automaton must agree with the plain-language rule on every short string.
function agrees(text, alphabet, maxLen, rule) {
  const a = parseAutomaton(text)
  for (const s of strings(alphabet, maxLen)) {
    expect({ s, accepted: run(a, s).accepted }).toEqual({ s, accepted: rule(s) })
  }
}

describe('lecture automata', () => {
  it('exactly one b', () => agrees(EXACTLY_ONE_B, ['a', 'b'], 8, (s) => count(s, 'b') === 1))
  it('exactly one b, complete version', () => {
    agrees(EXACTLY_ONE_B_COMPLETE, ['a', 'b'], 8, (s) => count(s, 'b') === 1)
    expect(check(parseAutomaton(EXACTLY_ONE_B_COMPLETE))).toEqual([])
  })
  it('at least one b', () => agrees(AT_LEAST_ONE_B, ['a', 'b'], 8, (s) => count(s, 'b') >= 1))
  it('contains bb', () => agrees(CONTAINS_BB, ['a', 'b'], 9, (s) => s.includes('bb')))
  it('ones odd or zeros odd', () => agrees(PARITY_01, ['0', '1'], 9, (s) => count(s, '1') % 2 === 1 || count(s, '0') % 2 === 1))

  it('matches the lecture results table', () => {
    const a = parseAutomaton(PARITY_01)
    const table = { '01': true, '00': false, '11': false, '10': true, '101': true, '110': true, '000': true, '1100': false, '1000': true }
    for (const [input, accepted] of Object.entries(table)) expect([input, run(a, input).accepted]).toEqual([input, accepted])
  })

  it('traces aba from A to B as in the lecture', () => {
    expect(run(parseAutomaton(EXACTLY_ONE_B), 'aba').path).toEqual(['A', 'A', 'B', 'B'])
  })
})

describe('exercise 1 solutions', () => {
  it('T1: sum modulo 6', () => agrees(SUM_MOD_6, ['1', '2', '3'], 7, (s) => [...s].reduce((n, c) => n + Number(c), 0) % 6 === 0))

  it('T2: negative values (the number after a minus is subtracted)', () => {
    // read "-d" as -d and a plain "d" as +d; the string never ends right after a minus when accepted
    const rule = (s) => {
      let sum = 0
      for (let i = 0; i < s.length; i++) {
        if (s[i] === '-') {
          if (i + 1 >= s.length) return false // a trailing minus leaves us in qi-, which is not accepting
          sum -= Number(s[++i])
        } else sum += Number(s[i])
      }
      return ((sum % 6) + 6) % 6 === 0
    }
    const bad = (s) => /--/.test(s) // two minus signs in a row are not defined (no transition)
    const a = parseAutomaton(SUM_MOD_6_NEGATIVE)
    for (const s of strings(['1', '2', '3', '-'], 6)) {
      if (bad(s)) expect(run(a, s).accepted).toBe(false)
      else expect({ s, accepted: run(a, s).accepted }).toEqual({ s, accepted: rule(s) })
    }
  })

  it('T2 excerpt parses and has the minus step', () => {
    const a = parseAutomaton(SUM_MOD_6_NEGATIVE_EXCERPT)
    expect(run(a, '-1').path).toEqual(['q0', 'q0-', 'q5'])
  })

  it('T3: no abc anywhere', () => agrees(NO_ABC, ['a', 'b', 'c'], 8, (s) => !s.includes('abc')))
  it('T4: contains 00', () => agrees(CONTAINS_00, ['0', '1'], 10, (s) => s.includes('00')))

  it('T4: the two chains from the exercise', () => {
    const a = parseAutomaton(CONTAINS_00)
    expect(run(a, '1101').path).toEqual(['q0', 'q0', 'q0', 'q1', 'q0'])
    expect(run(a, '01001').path).toEqual(['q0', 'q1', 'q0', 'q1', 'q2', 'q2'])
  })

  it('T5: a comma separated list that contains the number 112', () => {
    const a = parseAutomaton(HAS_112)
    const rule = (s) => s.split(',').includes('112')
    const cases = ['2575,45777,9803,112,3567', '295,430,1121,23,0', '112', '1121', '0112', '112,', ',112', '11,112', '1,12', '12,112,5', '111,2', '']
    for (const s of cases) expect({ s, accepted: run(a, s).accepted }).toEqual({ s, accepted: rule(s) })
  })

  it('T6 a): odd number of a', () => agrees(ODD_A, ['a', 'b', 'c'], 7, (s) => count(s, 'a') % 2 === 1))
  it('T6 b): a odd OR b even', () => agrees(A_ODD_OR_B_EVEN, ['a', 'b', 'c'], 7, (s) => count(s, 'a') % 2 === 1 || count(s, 'b') % 2 === 0))
  it('T6 c): either a odd or b even (exclusive)', () => agrees(A_ODD_XOR_B_EVEN, ['a', 'b', 'c'], 7, (s) => (count(s, 'a') % 2 === 1) !== (count(s, 'b') % 2 === 0)))
})

describe('completeness', () => {
  it('complete DFAs have no problems', () => {
    for (const text of [AT_LEAST_ONE_B, PARITY_01, SUM_MOD_6, NO_ABC, CONTAINS_00, ODD_A, A_ODD_OR_B_EVEN, CONTAINS_BB]) expect(check(parseAutomaton(text))).toEqual([])
  })

  it('the lecture one-b automaton is incomplete: B has no transition on b', () => {
    expect(check(parseAutomaton(EXACTLY_ONE_B))).toEqual([expect.stringContaining('B has no transition on b')])
  })
})
