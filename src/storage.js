// Pure helpers plus guarded localStorage access (it can throw in private windows).
export const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
export const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export const KEY_PROGRESS = 'scribletics_progress'
export const KEY_DAYS = 'scribletics_days'
const DAY = 86400000
const INTERVALS = [0, 1, 2, 4, 8, 16] // days until an item is due again, by Leitner box

export const todayKey = (d = new Date()) => d.toISOString().slice(0, 10)

// Returns a new progress object with one more answer recorded for the item.
export function applyResult(progress, id, correct, now = Date.now()) {
  const prev = progress[id] || { box: 0, seen: 0, right: 0 }
  const box = correct ? Math.min(prev.box + 1, INTERVALS.length - 1) : 0
  return { ...progress, [id]: { box, seen: prev.seen + 1, right: prev.right + (correct ? 1 : 0), due: now + INTERVALS[box] * DAY } }
}

// Study days used to be one map for everything ({ date: count }); now they are kept per course
// ({ courseId: { date: count } }). Old data belongs to Web Programming I, the only course then.
export const migrateDays = (raw) =>
  Object.values(raw).some((v) => typeof v === 'number') ? { webprog: raw } : raw

export const bumpDay = (days, key = todayKey()) => ({ ...days, [key]: (days[key] || 0) + 1 })

export const isMastered = (progress, id) => (progress[id]?.box || 0) >= 3
export const isDue = (progress, id, now = Date.now()) => !progress[id] || progress[id].due <= now

export function streak(days, now = new Date()) {
  let s = 0
  for (let d = new Date(now); ; d = new Date(d - DAY)) {
    if (days[todayKey(d)]) s++
    else if (todayKey(d) === todayKey(now)) continue // today not done yet does not break the streak
    else break
  }
  return s
}

export const shuffle = (a) =>
  a
    .map((x) => [Math.random(), x])
    .sort((p, q) => p[0] - q[0])
    .map((x) => x[1])
