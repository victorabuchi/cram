// Runs a student's JavaScript function against test cases.
//
// `evaluate` must stay self-contained (no imports, no outer variables): in the browser it is turned into
// a string and run inside a Web Worker, so an endless loop in the student's code can be stopped after a timeout
// instead of freezing the page.

export function evaluate(code, fn, tests) {
  const same = (a, b) => {
    if (Object.is(a, b)) return true
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
    if (Array.isArray(a) !== Array.isArray(b)) return false
    const ka = Object.keys(a)
    const kb = Object.keys(b)
    return ka.length === kb.length && ka.every((k) => same(a[k], b[k]))
  }
  // An argument written { __fn: 'x => x * 2' } becomes a real function (tests are plain data so they can cross into the worker).
  const revive = (v) => {
    if (Array.isArray(v)) return v.map(revive)
    if (v && typeof v === 'object') {
      if (typeof v.__fn === 'string') return new Function(`return (${v.__fn})`)()
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, revive(x)]))
    }
    return v
  }
  let f
  try {
    f = new Function(`${code}\n;return typeof ${fn} === 'function' ? ${fn} : undefined`)()
  } catch (e) {
    return { error: `${e.name}: ${e.message}`, results: [] }
  }
  if (!f) return { error: `Define a function named ${fn}.`, results: [] }
  const results = tests.map((t) => {
    try {
      const input = revive(JSON.parse(JSON.stringify(t.args))) // a fresh copy for every call
      const before = JSON.stringify(input)
      const actual = f(...input)
      const mutated = JSON.stringify(input) !== before
      return { actual, pass: same(actual, t.expected) && !(t.noMutation && mutated), ...(t.noMutation && mutated ? { mutated: true } : {}) }
    } catch (e) {
      return { actual: `${e.name}: ${e.message}`, pass: false, threw: true }
    }
  })
  return { error: null, results }
}

export const TIME_LIMIT_MS = 2000

export function runCode(code, fn, tests, timeoutMs = TIME_LIMIT_MS) {
  if (typeof Worker === 'undefined' || typeof URL.createObjectURL !== 'function') {
    return Promise.resolve(evaluate(code, fn, tests)) // tests in jsdom, or very old browsers
  }
  return new Promise((resolve) => {
    const source = `const evaluate = ${evaluate.toString()}
      onmessage = (e) => postMessage(evaluate(e.data.code, e.data.fn, e.data.tests))`
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))
    const worker = new Worker(url)
    const done = (value) => {
      clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve(value)
    }
    const timer = setTimeout(() => done({ error: 'Time limit exceeded: does your code have an endless loop?', results: [] }), timeoutMs)
    worker.onmessage = (e) => done(e.data)
    worker.onerror = (e) => done({ error: e.message || 'The code could not be run.', results: [] })
    worker.postMessage({ code, fn, tests })
  })
}

// Style requirements that tests cannot see, such as "use a for...of loop".
export const REQUIREMENTS = {
  split: { test: (code) => /\.split\s*\(/.test(code), message: 'Use the split method in your solution.' },
  map: { test: (code) => /\.map\s*\(/.test(code), message: 'Use the map method in your solution.' },
  filter: { test: (code) => /\.filter\s*\(/.test(code), message: 'Use the filter method in your solution.' },
  template: { test: (code) => /`[^`]*\$\{[^`]*`/.test(code), message: 'Use a template literal (backticks with ${...}) in your solution.' },
  forOf: { test: (code) => /\bfor\s*\(\s*(?:const|let|var)\s+[\w$]+\s+of\b/.test(code), message: 'Use a for...of loop in your solution.' },
}

// An argument the way the exercise sheet writes it: strings and keys in quotes only where JavaScript has them.
export const argText = (a) => {
  if (a && typeof a === 'object' && typeof a.__fn === 'string') return a.__fn
  if (Array.isArray(a)) return `[${a.map(argText).join(', ')}]`
  if (a && typeof a === 'object') return `{${Object.entries(a).map(([k, v]) => `${k}: ${argText(v)}`).join(', ')}}`
  return JSON.stringify(a)
}
export const callText = (fn, args) => `${fn}(${args.map(argText).join(', ')})`
export const show = (v) => {
  if (typeof v === 'string' && !/^[A-Za-z]*Error: /.test(v)) return JSON.stringify(v) // strings in quotes, but error messages as they are
  return typeof v === 'object' ? JSON.stringify(v) : String(v)
}
