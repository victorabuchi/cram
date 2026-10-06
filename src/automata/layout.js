// Positions for the states, in SVG units. States can be pinned with "at" lines in the automaton text.
const STEP_X = 170
const STEP_Y = 130

function layers(a) {
  const depth = { [a.start]: 0 }
  const queue = [a.start]
  while (queue.length) {
    const s = queue.shift()
    for (const t of a.transitions) {
      if (t.from === s && depth[t.to] === undefined) {
        depth[t.to] = depth[s] + 1
        queue.push(t.to)
      }
    }
  }
  const last = Math.max(0, ...Object.values(depth)) + 1
  a.states.forEach((s) => depth[s] === undefined && (depth[s] = last)) // unreachable states go last
  const columns = {}
  a.states.forEach((s) => (columns[depth[s]] ||= []).push(s))
  const tallest = Math.max(...Object.values(columns).map((c) => c.length))
  const pos = {}
  Object.entries(columns).forEach(([d, ids]) => {
    ids.forEach((s, i) => {
      pos[s] = { x: Number(d) * STEP_X, y: ((tallest - 1) / 2 + (i - (ids.length - 1) / 2)) * STEP_Y }
    })
  })
  return pos
}

function circle(a) {
  const n = a.states.length
  const radius = Math.max(120, n * 30)
  const order = [a.start, ...a.states.filter((s) => s !== a.start)]
  const pos = {}
  order.forEach((s, i) => {
    const angle = Math.PI + (i / n) * 2 * Math.PI // the start state sits on the left
    pos[s] = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) }
  })
  return pos
}

function grid(a) {
  const pos = {}
  a.states.forEach((s, i) => (pos[s] = { x: (i % a.gridCols) * STEP_X, y: Math.floor(i / a.gridCols) * STEP_Y }))
  return pos
}

export function computeLayout(a) {
  const base = (a.layout === 'circle' ? circle : a.layout === 'grid' ? grid : layers)(a)
  const pos = { ...base, ...a.at }
  const xs = Object.values(pos).map((p) => p.x)
  const ys = Object.values(pos).map((p) => p.y)
  const pad = { left: 90, right: 70, top: 90, bottom: 70 }
  const minX = Math.min(...xs) - pad.left
  const minY = Math.min(...ys) - pad.top
  return { pos, viewBox: { x: minX, y: minY, w: Math.max(...xs) + pad.right - minX, h: Math.max(...ys) + pad.bottom - minY } }
}
