import { computeLayout } from '../automata/layout'
import { alphabetOf, describe, toAutomaton } from '../automata/model'

const R = 24 // state radius
const YELLOW = '#ffff99' // JFLAP's state colour
const CURRENT = '#7ec8c8' // JFLAP highlights the current state in teal
const FONT = 'Helvetica, Arial, sans-serif'

const unit = (dx, dy) => {
  const len = Math.hypot(dx, dy) || 1
  return { x: dx / len, y: dy / len }
}
const sub = (n) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[d])
// q12 -> q₁₂ for the picture; ids with other shapes (a0b1, new, q0-) are shown as they are.
const stateLabel = (id) => id.replace(/^(q)(\d+)(-?)$/, (_, q, d, m) => q + sub(d) + m)

// Distance from point p to the segment a-b.
function distanceToSegment(p, a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)))
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy))
}

function edgeShapes(a, pos) {
  const groups = new Map()
  for (const t of a.transitions) {
    const key = `${t.from}\u0000${t.to}`
    const g = groups.get(key) ?? { from: t.from, to: t.to, labels: [] }
    t.on.forEach((tok) => !g.labels.includes(tok) && g.labels.push(tok))
    groups.set(key, g)
  }
  const cx = Object.values(pos).reduce((s, p) => s + p.x, 0) / a.states.length
  const cy = Object.values(pos).reduce((s, p) => s + p.y, 0) / a.states.length

  return [...groups.values()].map((g) => {
    const label = g.labels.join(' ')
    const p = pos[g.from]
    const q = pos[g.to]
    if (g.from === g.to) {
      // loop on the outside of the picture, away from the middle of the automaton
      const away = unit(p.x - cx, p.y - cy)
      // nodes at the left or right edge of a row would put the loop on the start marker or off the picture,
      // so loops on (nearly) horizontal outward directions are drawn above (or below) the state instead
      const sideways = Math.abs(away.y) < 0.5
      const theta = away.x === 0 && away.y === 0 ? -Math.PI / 2 : sideways ? (away.y > 0.15 ? Math.PI / 2 : -Math.PI / 2) : Math.atan2(away.y, away.x)
      const at = (ang, r) => ({ x: p.x + r * Math.cos(ang), y: p.y + r * Math.sin(ang) })
      const p0 = at(theta - 0.55, R)
      const p3 = at(theta + 0.55, R)
      const c1 = at(theta - 0.5, R * 3.2)
      const c2 = at(theta + 0.5, R * 3.2)
      const top = { x: (p0.x + 3 * c1.x + 3 * c2.x + p3.x) / 8, y: (p0.y + 3 * c1.y + 3 * c2.y + p3.y) / 8 }
      const lab = { x: top.x + Math.cos(theta) * 12, y: top.y + Math.sin(theta) * 12 }
      return { key: `${g.from}-${g.to}`, d: `M${p0.x},${p0.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p3.x},${p3.y}`, label, lab, from: g.from, to: g.to }
    }
    const reverse = a.transitions.some((t) => t.from === g.to && t.to === g.from)
    const blocked = a.states.some((s) => s !== g.from && s !== g.to && distanceToSegment(pos[s], p, q) < R + 8)
    const n = unit(q.x - p.x, q.y - p.y)
    const perp = { x: -n.y, y: n.x }
    const bow = reverse ? 34 : blocked ? 60 : 0
    const ctrl = { x: (p.x + q.x) / 2 + perp.x * bow, y: (p.y + q.y) / 2 + perp.y * bow }
    const s0 = unit(ctrl.x - p.x, ctrl.y - p.y)
    const s1 = unit(ctrl.x - q.x, ctrl.y - q.y)
    const start = { x: p.x + s0.x * R, y: p.y + s0.y * R }
    const end = { x: q.x + s1.x * (R + 2), y: q.y + s1.y * (R + 2) }
    const mid = { x: 0.25 * start.x + 0.5 * ctrl.x + 0.25 * end.x, y: 0.25 * start.y + 0.5 * ctrl.y + 0.25 * end.y }
    const side = bow === 0 ? -1 : Math.sign(bow)
    const lab = { x: mid.x + perp.x * 12 * side, y: mid.y + perp.y * 12 * side }
    return { key: `${g.from}-${g.to}`, d: `M${start.x},${start.y} Q${ctrl.x},${ctrl.y} ${end.x},${end.y}`, label, lab, from: g.from, to: g.to }
  })
}

// A JFLAP-style picture of an automaton (text or parsed object).
// `current`: state ids drawn teal, `activeEdge`: { from, to } drawn thick.
function Automaton({ automaton, current = [], activeEdge = null, width = '100%', height, maxWidth = 760, title, scroll = true }) {
  const a = toAutomaton(automaton)
  const { pos, viewBox: vb } = computeLayout(a)
  const edges = edgeShapes(a, pos)
  const now = Array.isArray(current) ? current : [current]
  const id = `arrow-${a.states.length}-${a.transitions.length}`
  alphabetOf(a) // validates symbol classes early

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title ?? describe(a)}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      width={width}
      height={height}
      style={{ maxWidth: Math.min(maxWidth, vb.w * 1.4), minWidth: height ? undefined : vb.w * 0.7, height: height ? undefined : 'auto', background: '#fff' }}
      fontFamily={FONT}
    >
      <defs>
        <marker id={id} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto">
          <path d="M1,1 L11,6 L1,11" fill="none" stroke="#000" strokeWidth="1.3" />
        </marker>
        <marker id={`${id}-on`} viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto">
          <path d="M1,1 L11,6 L1,11" fill="none" stroke="#0b7285" strokeWidth="1.6" />
        </marker>
      </defs>

      {edges.map((e) => {
        const on = activeEdge && activeEdge.from === e.from && activeEdge.to === e.to
        return (
          <g key={e.key}>
            <path d={e.d} fill="none" stroke={on ? '#0b7285' : '#000'} strokeWidth={on ? 3 : 1.4} markerEnd={`url(#${id}${on ? '-on' : ''})`} />
            <text x={e.lab.x} y={e.lab.y} textAnchor="middle" dominantBaseline="middle" fontSize="15" fill="#000" stroke="#fff" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">
              {e.label}
            </text>
          </g>
        )
      })}

      {/* start marker: JFLAP's triangle pointing at the start state */}
      <path
        d={`M${pos[a.start].x - R - 28},${pos[a.start].y - 16} L${pos[a.start].x - R},${pos[a.start].y} L${pos[a.start].x - R - 28},${pos[a.start].y + 16} Z`}
        fill="#fff"
        stroke="#000"
        strokeWidth="1.4"
      />

      {a.states.map((s) => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={R} fill={now.includes(s) ? CURRENT : YELLOW} stroke="#000" strokeWidth="1.5" />
          {a.accept.includes(s) && <circle cx={pos[s].x} cy={pos[s].y} r={R - 5} fill="none" stroke="#000" strokeWidth="1.5" />}
          <text x={pos[s].x} y={pos[s].y} textAnchor="middle" dominantBaseline="central" fontSize={stateLabel(s).length > 3 ? 13 : 16} fill="#000">
            {stateLabel(s)}
          </text>
        </g>
      ))}
    </svg>
  )
  return scroll ? <div style={{ overflowX: 'auto' }}>{svg}</div> : svg
}

export default Automaton
