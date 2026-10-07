// Checks a typed Java answer. Java cannot run in the browser, so each exercise lists the things a correct answer must
// contain: { label, re }. The code is first cleaned (comments removed, white space collapsed) and every `re` is tried on it.
export const clean = (code) =>
  code.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ').replace(/\s+/g, ' ').trim()

const balanced = (code) => {
  const text = code.replace(/"(?:[^"\\]|\\.)*"/g, '""')
  let depth = { '(': 0, '{': 0, '[': 0 }
  const open = { ')': '(', '}': '{', ']': '[' }
  for (const ch of text) {
    if (ch in depth) depth[ch]++
    else if (ch in open && --depth[open[ch]] < 0) return false
  }
  return Object.values(depth).every((n) => n === 0)
}

export function checkJava(code, checks) {
  const text = clean(code)
  const results = [
    { label: 'Brackets and braces match up', pass: text.length > 0 && balanced(text) },
    ...checks.map((c) => ({ label: c.label, pass: c.re.test(text) })),
  ]
  return { results, pass: results.every((r) => r.pass) }
}
