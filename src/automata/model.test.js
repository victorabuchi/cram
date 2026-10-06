import { computeLayout } from './layout'
import { AutomatonError, alphabetOf, check, describe as describeAutomaton, expandToken, formalDefinition, matches, parseAutomaton, run, toJff } from './model'
import { toJffFile, toSvgFile } from './export.jsx'

const TEXT = `# demo
start: q0
accept: q1
q0 a -> q1
q1 a b -> q1
q1 [0-9] -> q0
q0 , -> q0`

describe('parseAutomaton', () => {
  it('reads states, start, accepting states and transitions', () => {
    const a = parseAutomaton(TEXT)
    expect(a.states).toEqual(['q0', 'q1'])
    expect(a.start).toBe('q0')
    expect(a.accept).toEqual(['q1'])
    expect(a.transitions).toContainEqual({ from: 'q1', to: 'q1', on: ['a', 'b'] })
  })

  it('treats a comma as an ordinary symbol', () => {
    expect(parseAutomaton(TEXT).transitions.at(-1).on).toEqual([','])
  })

  it('reads layout and pinned positions', () => {
    const a = parseAutomaton('start: x\nlayout: grid 2\nat x 10 20.5\nx a -> x')
    expect(a.layout).toBe('grid')
    expect(a.gridCols).toBe(2)
    expect(a.at.x).toEqual({ x: 10, y: 20.5 })
  })

  it('reports the line of a mistake', () => {
    expect(() => parseAutomaton('start: q0\nq0 a q1')).toThrow(/Line 2/)
    expect(() => parseAutomaton('start: q0\nq0 a q1')).toThrow(AutomatonError)
  })

  it('needs a start state', () => {
    expect(() => parseAutomaton('q0 a -> q1')).toThrow(/start/)
  })
})

describe('symbols', () => {
  it('matches single characters and classes', () => {
    expect(matches('a', 'a')).toBe(true)
    expect(matches('a', 'b')).toBe(false)
    expect(matches('[2-9]', '5')).toBe(true)
    expect(matches('[2-9]', '1')).toBe(false)
    expect(matches('[abc]', 'b')).toBe(true)
    expect(matches('[a-c0]', '0')).toBe(true)
    expect(matches('[', '[')).toBe(true)
  })

  it('expands classes into characters', () => {
    expect(expandToken('[2-4]')).toEqual(['2', '3', '4'])
    expect(expandToken('[xz]')).toEqual(['x', 'z'])
    expect(expandToken('q')).toEqual(['q'])
  })

  it('collects the alphabet from the transitions, or from an alphabet line', () => {
    expect(alphabetOf(parseAutomaton(TEXT))).toEqual(['a', 'b', ...'0123456789', ','])
    expect(alphabetOf(parseAutomaton('start: s\nalphabet: x y\ns x -> s'))).toEqual(['x', 'y'])
  })
})

describe('run', () => {
  const a = parseAutomaton('start: A\naccept: B\nA a -> A\nA b -> B\nB a -> B')

  it('follows the transitions and records the path', () => {
    const r = run(a, 'aba')
    expect(r).toMatchObject({ accepted: true, state: 'B', path: ['A', 'A', 'B', 'B'], stuckAt: null })
    expect(r.edges).toEqual([{ from: 'A', to: 'A' }, { from: 'A', to: 'B' }, { from: 'B', to: 'B' }])
  })

  it('rejects when stuck and says where', () => {
    expect(run(a, 'abb')).toMatchObject({ accepted: false, stuckAt: 2, state: 'B' })
  })

  it('accepts the empty string only if the start state accepts', () => {
    expect(run(a, '').accepted).toBe(false)
    expect(run(parseAutomaton('start: s\naccept: s\ns a -> s'), '').accepted).toBe(true)
  })
})

describe('check', () => {
  it('reports missing transitions and non-determinism', () => {
    const problems = check(parseAutomaton('start: A\nA a -> A\nA a -> B\nA b -> A\nB a -> B'))
    expect(problems).toContainEqual(expect.stringContaining('A has more than one transition on a'))
    expect(problems).toContainEqual(expect.stringContaining('B has no transition on b'))
  })
})

describe('formalDefinition', () => {
  it('writes Q, Σ, s, F and δ like the exercise sheets', () => {
    const text = formalDefinition(parseAutomaton('start: q0\naccept: q2\nq0 1 -> q0\nq0 0 -> q1\nq1 0 -> q2\nq1 1 -> q0\nq2 0 1 -> q2'))
    expect(text).toContain('Q = {q₀, q₁, q₂}')
    expect(text).toContain('Σ = {1, 0}')
    expect(text).toContain('s = q₀')
    expect(text).toContain('F = {q₂}')
    expect(text).toContain('δ(q₀, 1) = q₀')
  })
})

describe('layout', () => {
  const a = parseAutomaton('start: A\naccept: C\nA a -> B\nB a -> C\nC a -> C')

  it('puts states in columns by distance from the start', () => {
    const { pos } = computeLayout(a)
    expect(pos.A.x).toBeLessThan(pos.B.x)
    expect(pos.B.x).toBeLessThan(pos.C.x)
  })

  it('honours pinned positions and circle layout', () => {
    expect(computeLayout(parseAutomaton('start: A\nat A 5 6\nA a -> A')).pos.A).toEqual({ x: 5, y: 6 })
    const { pos } = computeLayout(parseAutomaton('start: A\nlayout: circle\nA a -> B\nB a -> C\nC a -> A'))
    expect(pos.A.x).toBeLessThan(pos.B.x) // the start state is on the left
  })

  it('places unreachable states too', () => {
    expect(Object.keys(computeLayout(parseAutomaton('start: A\nA a -> A\nZ a -> Z')).pos).sort()).toEqual(['A', 'Z'])
  })
})

describe('export', () => {
  const a = parseAutomaton(TEXT)

  it('makes a standalone SVG with the states and labels', () => {
    const svg = toSvgFile(a)
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/)
    expect(svg).toContain('q₀')
    expect(svg).toContain('width=')
    expect(svg).toContain('height=')
  })

  it('makes a JFLAP file with one transition per symbol', () => {
    const jff = toJffFile(a)
    expect(jff).toContain('<type>fa</type>')
    expect(jff.match(/<initial\/>/g)).toHaveLength(1)
    expect(jff.match(/<final\/>/g)).toHaveLength(1)
    expect(jff.match(/<transition>/g)).toHaveLength(2 + 1 + 10 + 1) // q0 a, q1 a b, q1 digits, q0 comma... = 14
    expect(toJff(a, { q0: { x: 1, y: 2 }, q1: { x: 3, y: 4 } })).toContain('<x>3</x>')
  })

  it('describes the automaton in words for screen readers', () => {
    expect(describeAutomaton(a)).toContain('Start state q0')
  })
})
