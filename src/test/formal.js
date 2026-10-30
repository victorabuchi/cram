// Small simulators for checking the course answers in tests: words, DFAs/NFAs (text format of src/automata/model.js),
// grammars (one character = one symbol, capital letters are nonterminals, ε / λ is empty), DFA minimization,
// pushdown automata ([state, read, top, next, push]) and Turing machines ([state, read, write, move, next], '_' = blank).
import { matches, parseAutomaton, run } from '../automata/model'

export function* words(alphabet, maxLen) {
  let level = ['']
  yield ''
  for (let n = 1; n <= maxLen; n++) {
    level = level.flatMap((w) => alphabet.map((c) => w + c))
    yield* level
  }
}

export const dfa = (text) => {
  const a = parseAutomaton(text)
  return (w) => run(a, w).accepted
}

export const nfa = (text) => {
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

// The example words of an automaton list: the lines "accepts: ε, ab" and "rejects: a, ba" under the line of each automaton "a) ...".
export function examplesOf(text) {
  const out = {}
  let key
  const list = (part) => part.split(', ').map((w) => (w === 'ε' ? '' : w))
  for (const line of text.split('\n')) {
    key = /^([a-e])\) /.exec(line)?.[1] ?? key
    const m = /^\s*(accepts|rejects): (.*)$/.exec(line)
    if (m) (out[key] ??= { yes: [], no: [] })[m[1] === 'accepts' ? 'yes' : 'no'] = list(m[2])
  }
  return out
}

const parseRules = (text) => {
  const rules = {}
  for (const line of text.split('\n')) {
    const [lhs, rhs] = line.split('→').map((x) => x.trim())
    rules[lhs] = rhs.split('|').map((alt) => alt.replace(/\s+/g, '')).map((alt) => (alt === 'ε' || alt === 'λ' ? '' : alt))
  }
  return rules
}

// All words of the grammar up to maxLen (start symbol S).
export function language(text, maxLen, start = 'S') {
  const rules = parseRules(text)
  const out = new Set()
  const queue = [start]
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
      if ([...next].filter((c) => !rules[c]).length > maxLen || next.length > 3 * maxLen + 2 || seen.has(next)) continue
      seen.add(next)
      queue.push(next)
    }
  }
  return out
}

// Number of parse trees of `str` from `start`.
export function countTrees(text, start, str) {
  const rules = parseRules(text)
  const memo = new Map()
  const seq = (symbols, i, j) => {
    if (!symbols.length) return i === j ? 1 : 0
    const [first, ...rest] = symbols
    let total = 0
    if (rules[first]) for (let k = i; k <= j; k++) total += tree(first, i, k) * seq(rest, k, j)
    else if (str[i] === first && i < j) total += seq(rest, i + 1, j)
    return total
  }
  const tree = (nt, i, j) => {
    const key = `${nt}|${i}|${j}`
    if (memo.has(key)) return memo.get(key)
    memo.set(key, 0)
    const n = rules[nt].reduce((sum, alt) => sum + seq([...alt], i, j), 0)
    memo.set(key, n)
    return n
  }
  return tree(start, 0, str.length)
}

// The partition method step by step: P0 (accepting / not), P1, ... until nothing splits (Moore's refinement on the reachable states).
// Each step is a list of groups, e.g. [['0'], ['1', '2', '4'], ['3'], ['5']].
export function partitionSteps(text) {
  const a = parseAutomaton(text)
  const sigma = [...new Set(a.transitions.flatMap((t) => t.on))]
  const step = (s, c) => a.transitions.find((t) => t.from === s && t.on.includes(c))?.to
  const reach = new Set([a.start])
  for (const s of reach) sigma.forEach((c) => step(s, c) && reach.add(step(s, c)))
  const asGroups = (part) => {
    const g = {}
    for (const [s, k] of part) (g[k] ??= []).push(s)
    return Object.values(g).map((x) => x.sort()).sort((p, q) => p[0].localeCompare(q[0]))
  }
  let part = new Map([...reach].map((s) => [s, a.accept.includes(s) ? 1 : 0]))
  const steps = [asGroups(part)]
  for (;;) {
    const sig = (s) => `${part.get(s)}|${sigma.map((c) => part.get(step(s, c))).join(',')}`
    const names = new Map()
    const next = new Map([...reach].map((s) => [s, (names.has(sig(s)) ? names : names.set(sig(s), names.size)).get(sig(s))]))
    if (new Set(next.values()).size === new Set(part.values()).size) return steps
    part = next
    steps.push(asGroups(part))
  }
}

// Groups of equivalent states of a DFA: the last partition step.
export const groups = (text) => partitionSteps(text).at(-1)

export function pdaAccepts(pda, input, limit = 20000) {
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

// Runs a deterministic Turing machine; returns the tape without the surrounding blanks, or null if it does not accept.
export function tmRun(tm, input, limit = 10000) {
  const tape = new Map([...input].map((c, i) => [i, c]))
  let head = 0
  let state = tm.start
  for (let steps = 0; steps < limit; steps++) {
    if (tm.accept.includes(state)) {
      const cells = [...tape.entries()].filter(([, c]) => c !== '_').map(([i]) => i)
      if (!cells.length) return ''
      let out = ''
      for (let i = Math.min(...cells); i <= Math.max(...cells); i++) out += tape.get(i) ?? '_'
      return out
    }
    const rule = tm.rules.find(([s, r]) => s === state && r === (tape.get(head) ?? '_'))
    if (!rule) return null
    const [, , write, move, next] = rule
    tape.set(head, write)
    head += move === 'R' ? 1 : move === 'L' ? -1 : 0
    state = next
  }
  return null
}
