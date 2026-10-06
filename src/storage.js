// localStorage can throw (private windows), so every access is wrapped.
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

const KEY_PROGRESS = 'scribletics_progress'
const KEY_DAYS = 'scribletics_days'
const DAY = 86400000
const INTERVALS = [0, 1, 2, 4, 8, 16] // days until an item is due again, by Leitner box

export const todayKey = (d = new Date()) => d.toISOString().slice(0, 10)

export const getProgress = () => read(KEY_PROGRESS, {})
export const getDays = () => read(KEY_DAYS, {})

export function recordResult(id, correct) {
  const progress = getProgress()
  const item = progress[id] || { box: 0, seen: 0, right: 0 }
  item.seen++
  if (correct) {
    item.right++
    item.box = Math.min(item.box + 1, INTERVALS.length - 1)
  } else {
    item.box = 0
  }
  item.due = Date.now() + INTERVALS[item.box] * DAY
  progress[id] = item
  write(KEY_PROGRESS, progress)

  const days = getDays()
  days[todayKey()] = (days[todayKey()] || 0) + 1
  write(KEY_DAYS, days)
}

export function resetProgress() {
  write(KEY_PROGRESS, {})
  write(KEY_DAYS, {})
}

export const isMastered = (progress, id) => (progress[id]?.box || 0) >= 3
export const isDue = (progress, id) => !progress[id] || progress[id].due <= Date.now()

export function streak(days = getDays()) {
  let s = 0
  for (let d = new Date(); ; d = new Date(d - DAY)) {
    if (days[todayKey(d)]) s++
    else if (todayKey(d) === todayKey()) continue // today not done yet does not break the streak
    else break
  }
  return s
}

export const shuffle = (a) =>
  a
    .map((x) => [Math.random(), x])
    .sort((p, q) => p[0] - q[0])
    .map((x) => x[1])
