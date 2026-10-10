import { describe, expect, it } from 'vitest'
import { matches, parseAutomaton, run } from '../../automata/model'
import { AUTOMATA, GRAMMARS, variants } from './variants'

// ----- helpers: words, DFA/NFA runs, a grammar's language, minimization -----
function* words(alphabet, maxLen) {
  let level = ['']
  yield ''
  for (let n = 1; n <= maxLen; n++) {
    level = level.flatMap((w) => alphabet.map((c) => w + c))
    yield* level
  }
}
const dfa = (text) => {
  const a = parseAutomaton(text)
  return (w) => run(a, w).accepted
}
const nfa = (text) => {
  const a = parseAutomaton(text)
  return (w) => {
    let now = new Set([a.start])
    for (const ch of w) {
      const next = new Set()
      for (const s of now) for (const t of a.transitions) if (t.from === s && t.on.some((tok) => matches(tok, ch))) next.add(t.to)
      now = next
    }
    return [...now].some((s) => a.accept.includes(s))
  }
}
// All terminal strings of a grammar up to maxLen. One character = one symbol; capital letters are nonterminals; ε / λ is empty.
function language(text, maxLen) {
  const rules = {}
  for (const line of text.split('\n')) {
    const [lhs, rhs] = line.split('→').map((x) => x.trim())
    rules[lhs] = rhs.split('|').map((alt) => alt.replace(/\s+/g, '')).map((alt) => (alt === 'ε' || alt === 'λ' ? '' : alt))
  }
  const out = new Set()
  const queue = ['S']
  const seen = new Set(queue)
  while (queue.length) {
    const form = queue.shift()
    const at = [...form].findIndex((c) => rules[c])
    if (at < 0) {
      if (form.length <= maxLen) out.add(form)
      continue
    }
    for (const alt of rules[form[at]]) {
      const next = form.slice(0, at) + alt + form.slice(at + 1)
      if ([...next].filter((c) => !rules[c]).length > maxLen || seen.has(next)) continue
      seen.add(next)
      queue.push(next)
    }
  }
  return out
}
// Moore's partition refinement on the reachable states of a DFA: returns the groups of equivalent states.
function groups(text) {
  const a = parseAutomaton(text)
  const sigma = [...new Set(a.transitions.flatMap((t) => t.on))]
  const step = (s, c) => a.transitions.find((t) => t.from === s && t.on.includes(c))?.to
  const reach = new Set([a.start])
  for (const s of reach) sigma.forEach((c) => step(s, c) && reach.add(step(s, c)))
  let part = new Map([...reach].map((s) => [s, a.accept.includes(s) ? 1 : 0]))
  for (;;) {
    const sig = (s) => `${part.get(s)}|${sigma.map((c) => part.get(step(s, c))).join(',')}`
    const names = new Map()
    const next = new Map([...reach].map((s) => [s, (names.has(sig(s)) ? names : names.set(sig(s), names.size)).get(sig(s))]))
    if (new Set(next.values()).size === new Set(part.values()).size) break
    part = next
  }
  const g = {}
  for (const [s, k] of part) (g[k] ??= []).push(s)
  return Object.values(g).map((x) => x.sort()).sort((p, q) => p[0].localeCompare(q[0]))
}
const evenCount = (w, ch) => [...w].filter((c) => c === ch).length % 2 === 0

describe('BMC practice variants: the automata do what the answers say', () => {
  it('P1 T1: sum modulo 5', () => {
    const f = dfa(AUTOMATA.sum5)
    for (const w of words(['1', '2', '4'], 5)) expect(f(w), w).toBe([...w].reduce((s, d) => s + +d, 0) % 5 === 0)
    expect(['122', '14', '4411'].map(f)).toEqual([true, true, true])
    expect(['2', '44'].map(f)).toEqual([false, false])
  })

  it('P1 T2: negative values modulo 5', () => {
    const f = dfa(AUTOMATA.sum5neg)
    const tokens = ['1', '2', '4', '-1', '-2', '-4']
    for (const w of words(tokens, 4)) expect(f(w), w).toBe(w === '' ? true : parseTokens(w) % 5 === 0)
    expect(f('-11')).toBe(true)
    function parseTokens(str) {
      return [...str.matchAll(/-?\d/g)].reduce((s, m) => s + +m[0], 0)
    }
  })

  it('P1 T3: no substring aba', () => {
    const f = dfa(AUTOMATA.noAba)
    for (const w of words(['a', 'b'], 9)) expect(f(w), w).toBe(!w.includes('aba'))
  })

  it('P1 T4: contains 11, with the chains from the answer', () => {
    const f = dfa(AUTOMATA.contains11)
    for (const w of words(['0', '1'], 8)) expect(f(w), w).toBe(w.includes('11'))
    const a = parseAutomaton(AUTOMATA.contains11)
    expect(run(a, '0110').path).toEqual(['q0', 'q0', 'q1', 'q2', 'q2'])
    expect(run(a, '10101').path).toEqual(['q0', 'q1', 'q0', 'q1', 'q0', 'q1'])
    expect([f('0110'), f('10101')]).toEqual([true, false])
  })

  it('P1 T5: a list that contains 42', () => {
    const f = dfa(AUTOMATA.has42)
    for (const w of words(['0', '1', '2', '4', '5', ','], 6)) expect(f(w), w).toBe(w.split(',').includes('42'))
    expect(['7,42,100', '42'].map(f)).toEqual([true, true])
    expect(f('142,5,24')).toBe(false)
  })

  it('P1 T6: parities of b and c', () => {
    const a = dfa(AUTOMATA.evenB)
    const or = dfa(AUTOMATA.bEvenOrCOdd)
    const xor = dfa(AUTOMATA.bEvenXorCOdd)
    for (const w of words(['a', 'b', 'c'], 6)) {
      const bEven = evenCount(w, 'b')
      const cOdd = !evenCount(w, 'c')
      expect(a(w), w).toBe(bEven)
      expect(or(w), w).toBe(bEven || cOdd)
      expect(xor(w), w).toBe(bEven !== cOdd)
    }
  })
})

describe('BMC practice variants: exercise 2', () => {
  it('P2 T1: binary numbers divisible by eight end in 000', () => {
    const f = dfa(AUTOMATA.div8)
    for (const w of words(['0', '1'], 9)) expect(f(w), w).toBe(w.endsWith('000'))
    for (const n of [8, 16, 24, 40, 64]) expect(f(n.toString(2)), String(n)).toBe(true)
    for (const n of [1, 4, 12, 20, 36]) expect(f(n.toString(2)), String(n)).toBe(false)
  })

  it('P2 T2: minimization gives {q0}, {q1,q2}, {q3,q4} and keeps the language', () => {
    expect(groups(AUTOMATA.minimizeMe)).toEqual([['q0'], ['q1', 'q2'], ['q3', 'q4']])
    const big = dfa(AUTOMATA.minimizeMe)
    const small = dfa(AUTOMATA.minimized)
    for (const w of words(['a', 'b'], 7)) {
      expect(big(w), w).toBe(small(w))
      expect(small(w), w).toBe(w.length >= 2)
    }
    expect(run(parseAutomaton(AUTOMATA.minimizeMe), 'ab').path).not.toContain('q5')
  })

  it('P2 T3: the grammar and the automaton agree: words containing ab', () => {
    const grammar = language('S → aA | bS\nA → aA | bB\nB → aB | bB | λ', 6)
    const f = dfa(AUTOMATA.hasAb)
    for (const w of words(['a', 'b'], 6)) {
      expect(f(w), w).toBe(w.includes('ab'))
      expect(grammar.has(w), w).toBe(w.includes('ab'))
    }
  })

  it('P2 T4: signed decimal numbers', () => {
    const f = dfa(AUTOMATA.signedDecimal)
    for (const w of words(['+', '-', '5', '.'], 6)) expect(f(w), w).toBe(/^[+-]?[0-9]+(\.[0-9]+)?$/.test(w))
    expect(['+5', '-12.50', '7'].map(f)).toEqual([true, true, true])
    expect(['5.', '.5'].map(f)).toEqual([false, false])
  })

  it('P2 T5: the integer literal grammar', () => {
    const lang = language(GRAMMARS.intLiteral, 4)
    for (const w of words([...'0123456789', 'l'], 4)) expect(lang.has(w), w).toBe(/^(0|[1-9][0-9]*)l?$/.test(w))
    for (const w of ['0', '7', '120', '99l']) expect(lang.has(w), w).toBe(true)
    for (const w of ['007', 'l', '12ll']) expect(lang.has(w), w).toBe(false)
  })

  it('P2 T6: the NFA accepts when the second-to-last character is a', () => {
    const f = nfa(AUTOMATA.secondLastA)
    for (const w of words(['a', 'b'], 8)) expect(f(w), w).toBe(w.length >= 2 && w[w.length - 2] === 'a')
    expect([f('bab'), f('aa'), f('abb')]).toEqual([true, true, false])
  })
})

describe('BMC practice variants: exercise 3', () => {
  it('P3 T1: grammar, regular expression and automaton agree (even number of a)', () => {
    const f = dfa(AUTOMATA.evenA)
    const lang = language('S → bS | aO | ε\nO → bO | aS', 7) // E renamed S, the start symbol
    for (const w of words(['a', 'b'], 7)) {
      expect(f(w), w).toBe(evenCount(w, 'a'))
      expect(/^(b|ab*a)*$/.test(w), w).toBe(evenCount(w, 'a'))
      expect(lang.has(w), w).toBe(evenCount(w, 'a'))
    }
  })

  it('P3 T2: the grammars are the machines', () => {
    const m1 = language('S → aA | aB\nA → bA | ε\nB → cB | ε', 5)
    const f1 = nfa(AUTOMATA.nfaPair)
    for (const w of words(['a', 'b', 'c'], 5)) expect(m1.has(w), w).toBe(f1(w))
    const m2 = language('S → 0S | 1T\nT → 0S | 1T | ε', 7) // S0 -> S, S1 -> T
    const f2 = dfa(AUTOMATA.endsIn1)
    for (const w of words(['0', '1'], 7)) {
      expect(m2.has(w), w).toBe(f2(w))
      expect(f2(w), w).toBe(w.endsWith('1'))
    }
  })

  it('P3 T3: the three grammars', () => {
    const g1 = language('S → aS | b', 6)
    const g2 = language('S → aSb | ε', 6)
    const g3 = language('S → AB\nA → aA | a\nB → bB | b', 6)
    for (const w of words(['a', 'b'], 6)) {
      expect(g1.has(w), w).toBe(/^a*b$/.test(w))
      expect(g2.has(w), w).toBe(/^(a*)(b*)$/.test(w) && w.split('a').length - 1 === w.split('b').length - 1)
      expect(g3.has(w), w).toBe(/^a+b+$/.test(w))
    }
    const regular = language('S → aA\nA → aA | bB\nB → bB | ε', 6)
    for (const w of words(['a', 'b'], 6)) expect(regular.has(w), w).toBe(g3.has(w))
  })

  it('P3 T4: the weighted sum modulo 4, and which lengths have an accepted word', () => {
    const f = dfa(AUTOMATA.weighted4)
    for (const w of words(['a', 'b'], 8)) expect(f(w), w).toBe([...w].reduce((s, c) => s + (c === 'a' ? 1 : 2), 0) % 4 === 0)
    const lengthsWithAcceptedWord = []
    for (let n = 0; n <= 8; n++) if ([...words(['a', 'b'], n)].some((w) => w.length === n && f(w))) lengthsWithAcceptedWord.push(n)
    expect(lengthsWithAcceptedWord).toEqual([0, 2, 3, 4, 5, 6, 7, 8])
    expect(f('bb') && f('aab') && !f('a') && !f('b')).toBe(true)
  })

  it('P3 T5: minimal; with q2 accepting it is "an even number of a" and needs two states', () => {
    expect(groups(AUTOMATA.weighted4)).toEqual([['q0'], ['q1'], ['q2'], ['q3']])
    expect(groups(AUTOMATA.weighted4Q2)).toEqual([['q0', 'q2'], ['q1', 'q3']])
    const f = dfa(AUTOMATA.weighted4Q2)
    for (const w of words(['a', 'b'], 8)) expect(f(w), w).toBe(evenCount(w, 'a'))
  })

  it('P3 T6: the binary literal grammar', () => {
    const lang = language(GRAMMARS.binaryLiteral, 6)
    for (const w of words(['0', '1', 'b', '_'], 6)) expect(lang.has(w), w).toBe(/^0b_?[01](_?[01])*$/.test(w))
    for (const w of ['0b101', '0b_1', '0b1_0']) expect(lang.has(w), w).toBe(true)
    for (const w of ['0b', '0b1_', '0b__1']) expect(lang.has(w), w).toBe(false)
  })
})

describe('BMC practice variants: the data', () => {
  it('has one variant for each exercise task, each with an answer', () => {
    expect(variants).toHaveLength(26)
    expect(new Set(variants.map((q) => q.of)).size).toBe(26)
    for (const q of variants) {
      expect(q.answer.length, q.id).toBeGreaterThan(0)
      for (const text of [q.diagram, q.answerDiagram].filter(Boolean)) expect(() => parseAutomaton(text), q.id).not.toThrow()
    }
  })
})

// ----- exercise 4: pushdown automata, grammars and parse trees -----
import { expressionTree, leaves } from './trees'
import { PDAS } from './variants'

// Runs a pushdown automaton (nondeterministic: all choices are explored). Accepts when the input is used up in an accepting state.
function pdaAccepts(pda, input, limit = 20000) {
  const seen = new Set()
  const stack = [[pda.start, 0, 'Z']]
  let steps = 0
  while (stack.length && steps++ < limit) {
    const [state, pos, st] = stack.pop()
    const key = `${state}|${pos}|${st}`
    if (seen.has(key) || st.length > 30) continue
    seen.add(key)
    if (pos === input.length && pda.accept.includes(state)) return true
    for (const [from, read, top, to, push] of pda.rules) {
      if (from !== state || st[0] !== top) continue
      if (read !== '' && input[pos] !== read) continue
      stack.push([to, pos + (read === '' ? 0 : 1), push + st.slice(1)])
    }
  }
  return false
}
const counts = (w) => ({ a: [...w].filter((c) => c === 'a').length, b: [...w].filter((c) => c === 'b').length, c: [...w].filter((c) => c === 'c').length })
const shape = (w) => /^a*b*c*$/.test(w)
const balanced = (w) => {
  const st = []
  for (const ch of w) {
    if (ch === '(' || ch === '[') st.push(ch)
    else if (st.pop() !== (ch === ')' ? '(' : '[')) return false
  }
  return st.length === 0
}
// Number of parse trees of `str` for the grammar `text` (one character = one symbol, S/E start symbol given).
function countTrees(text, start, str) {
  const rules = {}
  for (const line of text.split('\n')) {
    const [lhs, rhs] = line.split('→').map((x) => x.trim())
    rules[lhs] = rhs.split('|').map((alt) => alt.replace(/\s+/g, ''))
  }
  const memo = new Map()
  const seq = (symbols, i, j) => {
    if (!symbols.length) return i === j ? 1 : 0
    const [first, ...rest] = symbols
    let total = 0
    if (rules[first]) {
      for (let k = i; k <= j; k++) total += tree(first, i, k) * seq(rest, k, j)
    } else if (str[i] === first && i < j) total += seq(rest, i + 1, j)
    return total
  }
  const tree = (nt, i, j) => {
    const key = `${nt}|${i}|${j}`
    if (memo.has(key)) return memo.get(key)
    memo.set(key, 0) // guards against left recursion on an empty span
    const n = rules[nt].reduce((sum, alt) => sum + seq([...alt], i, j), 0)
    memo.set(key, n)
    return n
  }
  return tree(start, 0, str.length)
}

describe('BMC practice variants: exercise 4', () => {
  it('P4 T1: the PDA accepts a^k b^l c^(2k+l) and nothing else', () => {
    for (const w of words(['a', 'b', 'c'], 8)) {
      const { a, b, c } = counts(w)
      expect(pdaAccepts(PDAS.abc2, w), w).toBe(shape(w) && c === 2 * a + b)
    }
    expect(['abccc', 'aacccc', ''].map((w) => pdaAccepts(PDAS.abc2, w))).toEqual([true, true, true])
    expect(pdaAccepts(PDAS.abc2, 'abcc')).toBe(false)
  })

  it('P4 T2: the grammar generates the same language as the PDA', () => {
    const lang = language(GRAMMARS.abc2.replace('S →', 'S →'), 8)
    for (const w of words(['a', 'b', 'c'], 8)) {
      const { a, b, c } = counts(w)
      expect(lang.has(w), w).toBe(shape(w) && c === 2 * a + b)
    }
  })

  it('P4 T3: k + l ≤ m, by the PDA and by the grammar', () => {
    const lang = language(GRAMMARS.atMost, 8)
    for (const w of words(['a', 'b', 'c'], 8)) {
      const { a, b, c } = counts(w)
      const inLanguage = shape(w) && a + b <= c
      expect(pdaAccepts(PDAS.atMost, w), w).toBe(inLanguage)
      expect(lang.has(w), w).toBe(inLanguage)
    }
    expect([pdaAccepts(PDAS.atMost, 'abcc'), pdaAccepts(PDAS.atMost, 'abccc'), pdaAccepts(PDAS.atMost, 'abc')]).toEqual([true, true, false])
  })

  it('P4 T4: the bracket PDA accepts exactly the correctly nested words', () => {
    for (const w of words(['(', ')', '[', ']'], 8)) expect(pdaAccepts(PDAS.brackets, w), w).toBe(balanced(w))
    expect(['([])[()]', '()'].map((w) => pdaAccepts(PDAS.brackets, w))).toEqual([true, true])
    expect(['([)]', '(()', ']('].map((w) => pdaAccepts(PDAS.brackets, w))).toEqual([false, false, false])
  })

  it('P4 T5: E → E+E | E*E | n is ambiguous: n+n*n has two parse trees, and the two derivations in the answer exist', () => {
    expect(countTrees(GRAMMARS.ambiguous, 'E', 'n+n*n')).toBe(2)
    expect(countTrees(GRAMMARS.ambiguous, 'E', 'n+n')).toBe(1)
    expect(countTrees(GRAMMARS.ambiguous, 'E', 'n+n+n')).toBe(2)
    const answer = variants.find((q) => q.id === 'bmc-v-x4t5').answer.filter((a) => a.code).map((a) => a.code)
    expect(answer[0]).toBe('E → E + E → n + E → n + E * E → n + n * E → n + n * n')
    expect(answer[1]).toBe('E → E * E → E + E * E → n + E * E → n + n * E → n + n * n')
    expect(answer[2].split('\n').filter((l) => /[n+*]$/.test(l)).map((l) => l.slice(-1)).join('')).toBe('n+n*n') // the leaves, read in order
    expect(answer[3].split('\n').filter((l) => /[n+*]$/.test(l)).map((l) => l.slice(-1)).join('')).toBe('n+n*n')
  })

  it('P4 T6 and X4 T6: the parse trees are drawn by the grammar of the exercise and have the right leaves', () => {
    const grammar = 'S → E\nE → E+T | T\nT → T*F | F\nF → n | (E)'
    for (const w of ['(n+n)*n', 'n*n+n*n', 'n+n+n', 'n*(n+n)', 'n+n*n', 'n*n+n']) {
      expect(leaves(expressionTree(w)), w).toBe(w)
      expect(countTrees(grammar, 'S', w), w).toBe(1) // unambiguous: exactly one tree
    }
    // + is applied last in n+n*n (it is the top E), * last in (n+n)*n
    expect(expressionTree('n+n*n').kids[0].kids.map((k) => k.sym)).toEqual(['E', '+', 'T'])
    expect(expressionTree('(n+n)*n').kids[0].kids[0].kids.map((k) => k.sym)).toEqual(['T', '*', 'F'])
  })

  it('has one practice task for each of the 26 exercise tasks', () => {
    expect(variants).toHaveLength(26)
    expect(new Set(variants.map((q) => q.of)).size).toBe(26)
  })
})
