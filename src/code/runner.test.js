import { REQUIREMENTS, callText, evaluate, runCode, show } from './runner'

const double = [{ args: [2], expected: 4 }, { args: [0], expected: 0 }]

describe('evaluate', () => {
  it('passes a correct function', () => {
    const r = evaluate('const f = (n) => n * 2;', 'f', double)
    expect(r.error).toBeNull()
    expect(r.results.map((x) => x.pass)).toEqual([true, true])
  })

  it('reports the value a wrong function returned', () => {
    const r = evaluate('const f = (n) => n + 2;', 'f', double)
    expect(r.results).toEqual([{ actual: 4, pass: true }, { actual: 2, pass: false }])
  })

  it('works with function declarations as well as arrow functions', () => {
    expect(evaluate('function f(n) { return n * 2 }', 'f', double).results.every((x) => x.pass)).toBe(true)
  })

  it('compares arrays and objects by content', () => {
    const r = evaluate('const f = (a) => a.map(x => x + 1);', 'f', [{ args: [[1, 2]], expected: [2, 3] }, { args: [[1]], expected: [3] }])
    expect(r.results.map((x) => x.pass)).toEqual([true, false])
  })

  it('does not let one call change the next call\'s input', () => {
    const r = evaluate('const f = (a) => { a.push(9); return a.length; };', 'f', [{ args: [[1]], expected: 2 }, { args: [[1]], expected: 2 }])
    expect(r.results.every((x) => x.pass)).toBe(true)
  })

  it('says when the function is missing or the code has a syntax error', () => {
    expect(evaluate('const g = () => 1;', 'f', double).error).toBe('Define a function named f.')
    expect(evaluate('const f = (n) => {', 'f', double).error).toMatch(/SyntaxError/)
  })

  it('catches an error thrown inside the function and keeps testing', () => {
    const r = evaluate('const f = (n) => { if (n === 2) throw new Error("boom"); return 0; };', 'f', double)
    expect(r.results[0]).toMatchObject({ pass: false, threw: true, actual: 'Error: boom' })
    expect(r.results[1].pass).toBe(true)
  })

  it('treats a function that returns nothing as undefined, not as a pass', () => {
    const r = evaluate('const f = (n) => { n * 2; };', 'f', double)
    expect(r.results[0]).toEqual({ actual: undefined, pass: false })
  })
})

describe('evaluate: functions as arguments and changed input', () => {
  it('passes a function argument written as source text', () => {
    const r = evaluate('const f = (items, cb) => items.map(cb);', 'f', [{ args: [[1, 2], { __fn: 'x => x * 2' }], expected: [2, 4] }])
    expect(r.results[0].pass).toBe(true)
  })

  it('fails a function that changes its input when the test says not to', () => {
    const tests = [{ args: [{ on: true }], expected: { on: false }, noMutation: true }]
    expect(evaluate('const f = (o) => { o.on = !o.on; return o; };', 'f', tests).results[0]).toMatchObject({ pass: false, mutated: true })
    expect(evaluate('const f = (o) => ({ ...o, on: !o.on });', 'f', tests).results[0].pass).toBe(true)
  })
})

describe('runCode', () => {
  it('runs the tests (without a worker in the test environment)', async () => {
    const r = await runCode('const f = (n) => n * 2;', 'f', double)
    expect(r.results.every((x) => x.pass)).toBe(true)
  })
})

describe('requirements', () => {
  it('recognises split, map, filter and template literals', () => {
    expect(REQUIREMENTS.split.test('name.split(" ")')).toBe(true)
    expect(REQUIREMENTS.split.test('name.slice(0, 3)')).toBe(false)
    expect(REQUIREMENTS.map.test('a.map(x => x)')).toBe(true)
    expect(REQUIREMENTS.map.test('a.forEach(x => x)')).toBe(false)
    expect(REQUIREMENTS.filter.test('a.filter(x => x)')).toBe(true)
    expect(REQUIREMENTS.template.test('return `Good ${greeting}`')).toBe(true)
    expect(REQUIREMENTS.template.test('return "Good " + greeting')).toBe(false)
    expect(REQUIREMENTS.template.test('return `no variables here`')).toBe(false)
  })
})

describe('helpers', () => {
  it('writes a call the way the exercise sheet does', () => {
    expect(callText('countNamesOfType', [['Toast', 'Tessa'], 'T'])).toBe('countNamesOfType(["Toast", "Tessa"], "T")')
    expect(callText('f', [{ name: 'Toast', age: 6 }])).toBe('f({name: "Toast", age: 6})')
    expect(callText('f', [[1, 2], { __fn: 'x => x * 2' }])).toBe('f([1, 2], x => x * 2)')
  })

  it('shows strings in quotes and errors as they are', () => {
    expect(show('Tie')).toBe('"Tie"')
    expect(show(5)).toBe('5')
    expect(show([1, 2])).toBe('[1,2]')
    expect(show(undefined)).toBe('undefined')
    expect(show(null)).toBe('null')
    expect(show('TypeError: x is not a function')).toBe('TypeError: x is not a function')
  })

  it('recognises for...of loops', () => {
    const { test } = REQUIREMENTS.forOf
    expect(test('for (const n of names) {}')).toBe(true)
    expect(test('for (let i = 0; i < 3; i++) {}')).toBe(false)
    expect(test('names.forEach(n => n)')).toBe(false)
    expect(test('for (const key in obj) {}')).toBe(false)
  })
})
