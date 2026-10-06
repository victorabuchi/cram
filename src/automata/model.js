// Text format for finite automata, used for the lab page and for course content.
//
//   # a comment
//   start: A
//   accept: B C
//   A a -> A          from-state, one or more symbols, "->", to-state
//   A b -> B
//   B a b -> B        several symbols on one line = one transition per symbol
//   new [2-9] 0 -> nope    symbols can be classes: [2-9], [abc]
//   layout: circle         optional: layers (default), circle, grid 3
//   at A 120 80            optional: place a state at x y
//   alphabet: a b          optional: otherwise taken from the transitions
//
// Symbols are separated by spaces, so "," is simply a symbol: "new , -> new".

export class AutomatonError extends Error {}

const isClass = (tok) => tok.length >= 3 && tok[0] === '[' && tok.at(-1) === ']'

// Does the symbol token (a character or a class like [2-9]) match this input character?
export function matches(tok, ch) {
  if (!isClass(tok)) return tok === ch
  const body = Array.from(tok.slice(1, -1))
  for (let i = 0; i < body.length; i++) {
    if (body[i + 1] === '-' && i + 2 < body.length) {
      if (ch >= body[i] && ch <= body[i + 2]) return true
      i += 2
    } else if (body[i] === ch) return true
  }
  return false
}

// Every single character a token stands for ("[2-4]" -> 2 3 4).
export function expandToken(tok) {
  if (!isClass(tok)) return [tok]
  const out = []
  const body = Array.from(tok.slice(1, -1))
  for (let i = 0; i < body.length; i++) {
    if (body[i + 1] === '-' && i + 2 < body.length) {
      for (let c = body[i].codePointAt(0); c <= body[i + 2].codePointAt(0); c++) out.push(String.fromCodePoint(c))
      i += 2
    } else out.push(body[i])
  }
  return out
}

export function parseAutomaton(text) {
  const a = { states: [], start: null, accept: [], transitions: [], at: {}, layout: 'layers', gridCols: 3, alphabet: null }
  const addState = (id) => {
    if (!a.states.includes(id)) a.states.push(id)
  }
  let explicitOrder = false
  const lines = text.split('\n')
  lines.forEach((raw, n) => {
    const line = raw.replace(/#.*$/, '').trim()
    if (!line) return
    const fail = (msg) => {
      throw new AutomatonError(`Line ${n + 1}: ${msg}`)
    }
    let m
    if ((m = line.match(/^start:\s*(\S+)$/))) {
      a.start = m[1]
      addState(m[1])
    } else if ((m = line.match(/^accept:\s*(.*)$/))) {
      a.accept = m[1].split(/\s+/).filter(Boolean)
      a.accept.forEach(addState)
    } else if ((m = line.match(/^states:\s*(.*)$/))) {
      m[1].split(/\s+/).filter(Boolean).forEach(addState)
      explicitOrder = true
    } else if ((m = line.match(/^alphabet:\s*(.*)$/))) {
      a.alphabet = m[1].split(/\s+/).filter(Boolean).flatMap(expandToken)
    } else if ((m = line.match(/^layout:\s*(layers|circle|grid)(?:\s+(\d+))?$/))) {
      a.layout = m[1]
      if (m[2]) a.gridCols = Number(m[2])
    } else if ((m = line.match(/^at\s+(\S+)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)$/))) {
      a.at[m[1]] = { x: Number(m[2]), y: Number(m[3]) }
      addState(m[1])
    } else if ((m = line.match(/^(\S+)\s+(.+?)\s*->\s*(\S+)$/))) {
      const on = m[2].split(/\s+/)
      a.transitions.push({ from: m[1], to: m[3], on })
      addState(m[1])
      addState(m[3])
    } else {
      fail(`cannot understand "${line}". Write transitions like "q0 a b -> q1".`)
    }
  })
  if (!a.start) throw new AutomatonError('Missing "start: <state>".')
  if (!a.states.length) throw new AutomatonError('The automaton has no states.')
  if (!explicitOrder) {
    // start state first, then the order the states appear in the transitions, then states mentioned only elsewhere
    const seen = [a.start, ...a.transitions.flatMap((t) => [t.from, t.to])]
    a.states = [...new Set([...seen, ...a.states])]
  }
  return a
}

export const toAutomaton = (def) => (typeof def === 'string' ? parseAutomaton(def) : def)

export function alphabetOf(a) {
  if (a.alphabet) return a.alphabet
  const set = []
  a.transitions.forEach((t) => t.on.flatMap(expandToken).forEach((c) => !set.includes(c) && set.push(c)))
  return set
}

const outgoing = (a, state, ch) => a.transitions.filter((t) => t.from === state && t.on.some((tok) => matches(tok, ch)))

// Runs the automaton on a string. A missing transition means the input is rejected ("stuck").
export function run(a, input) {
  const chars = Array.from(input)
  let state = a.start
  const path = [state]
  const edges = []
  for (let i = 0; i < chars.length; i++) {
    const t = outgoing(a, state, chars[i])[0]
    if (!t) return { accepted: false, stuckAt: i, path, edges, state, chars }
    edges.push({ from: state, to: t.to })
    state = t.to
    path.push(state)
  }
  return { accepted: a.accept.includes(state), stuckAt: null, path, edges, state, chars }
}

// Things a pen-and-paper marker would also look for.
export function check(a) {
  const problems = []
  const sigma = alphabetOf(a)
  for (const s of a.states) {
    const missing = sigma.filter((ch) => outgoing(a, s, ch).length === 0)
    if (missing.length) problems.push(`${s} has no transition on ${missing.join(', ')} (input gets stuck and is rejected)`)
    const twice = sigma.filter((ch) => outgoing(a, s, ch).length > 1)
    if (twice.length) problems.push(`${s} has more than one transition on ${twice.join(', ')}, so this is not deterministic`)
  }
  return problems
}

const sub = (n) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[d])
const pretty = (id) => id.replace(/^([a-zA-Z]+)(\d+)(.*)$/, (_, p, d, rest) => p + sub(d) + rest)

// Q, Σ, s, F and δ written the way the exercises write them.
export function formalDefinition(a) {
  const sigma = alphabetOf(a)
  const lines = [
    `Q = {${a.states.map(pretty).join(', ')}}`,
    `Σ = {${sigma.join(', ')}}`,
    `s = ${pretty(a.start)}`,
    `F = {${a.accept.map(pretty).join(', ')}}`,
  ]
  const delta = a.transitions.flatMap((t) => t.on.map((tok) => ({ from: t.from, tok, to: t.to })))
  lines.push('δ = {', ...delta.map((d) => `  δ(${pretty(d.from)}, ${d.tok}) = ${pretty(d.to)}`), '}')
  return lines.join('\n')
}

// JFLAP file (.jff) so the diagram can be opened and edited in JFLAP.
export function toJff(a, pos) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const id = (s) => a.states.indexOf(s)
  const states = a.states.map((s) => `    <state id="${id(s)}" name="${esc(s)}">\n      <x>${Math.round(pos[s].x)}</x>\n      <y>${Math.round(pos[s].y)}</y>${s === a.start ? '\n      <initial/>' : ''}${a.accept.includes(s) ? '\n      <final/>' : ''}\n    </state>`)
  const trans = a.transitions.flatMap((t) => t.on.flatMap(expandToken).map((ch) => `    <transition>\n      <from>${id(t.from)}</from>\n      <to>${id(t.to)}</to>\n      <read>${esc(ch)}</read>\n    </transition>`))
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<structure>\n  <type>fa</type>\n  <automaton>\n${states.join('\n')}\n${trans.join('\n')}\n  </automaton>\n</structure>\n`
}

// Sentence for screen readers: the same information as the picture.
export function describe(a) {
  const edges = a.transitions.map((t) => `${t.from} on ${t.on.join(' or ')} goes to ${t.to}`)
  return `Finite automaton with states ${a.states.join(', ')}. Start state ${a.start}. Accepting states ${a.accept.join(', ') || 'none'}. Transitions: ${edges.join('; ')}.`
}

