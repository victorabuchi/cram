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

// The app used to be called Scribletics. The storage keys keep that prefix so saved progress carries over.
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

export const isMastered = (progress, id) => (progress[id]?.box || 0) >= 3 // right 3 times in a row
export const isDone = (progress, id) => (progress[id]?.box || 0) >= 1 // the last answer was right
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

// ---------- Backup: progress lives in this browser only, so it can be moved to another browser or phone ----------
export const BACKUP_PREFIX = 'cram1:'
const OWN_KEY = /^scribletics_/

const byMoreAnswers = (a, b) => ((b?.seen ?? 0) > (a?.seen ?? 0) || ((b?.seen ?? 0) === (a?.seen ?? 0) && (b?.box ?? 0) > (a?.box ?? 0)) ? b : a)

// Combines saved data from two browsers without losing either: per question the one with more answers, per day the higher count, saved terms from both.
export function mergeBackup(current, incoming) {
  const out = { ...current }
  for (const [key, value] of Object.entries(incoming)) {
    if (!(key in current)) out[key] = value
    else if (key === KEY_PROGRESS) {
      const merged = { ...current[key] }
      for (const [id, entry] of Object.entries(value)) merged[id] = id in merged ? byMoreAnswers(merged[id], entry) : entry
      out[key] = merged
    } else if (key === KEY_DAYS) {
      const merged = {}
      for (const course of new Set([...Object.keys(current[key] ?? {}), ...Object.keys(value ?? {})])) {
        const a = current[key]?.[course]
        const b = value?.[course]
        merged[course] = typeof a === 'number' || typeof b === 'number' ? (a ?? b) : { ...a }
        for (const [date, n] of Object.entries(b ?? {})) if (typeof merged[course] === 'object') merged[course][date] = Math.max(merged[course][date] ?? 0, n)
      }
      out[key] = merged
    } else if (key === 'scribletics_saved_terms') {
      const have = new Set(current[key].map((t) => t.key))
      out[key] = [...current[key], ...value.filter((t) => !have.has(t.key))]
    } // anything else (code you typed, recent searches): keep what this browser has
  }
  return out
}

// Everything Cram saved in this browser, as plain data.
export function collectData(store = localStorage) {
  const data = {}
  for (let i = 0; i < store.length; i++) {
    const key = store.key(i)
    if (OWN_KEY.test(key)) {
      try {
        data[key] = JSON.parse(store.getItem(key))
      } catch {
        /* skip a value that is not JSON */
      }
    }
  }
  return data
}

const utf8ToBase64 = (text) => btoa(String.fromCharCode(...new TextEncoder().encode(text)))
const base64ToUtf8 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)))

export const backupJson = (data) => JSON.stringify({ app: 'cram', version: 1, savedAt: new Date().toISOString(), data }, null, 2)
export const backupCode = (data) => BACKUP_PREFIX + utf8ToBase64(JSON.stringify({ app: 'cram', version: 1, data }))

// A backup file's text or a pasted code -> the data inside. Throws a readable message when it is not a Cram backup.
export function parseBackup(text) {
  const raw = text.trim()
  if (!raw) throw new Error('Paste a backup code or choose a backup file first.')
  let parsed
  try {
    parsed = JSON.parse(raw.startsWith(BACKUP_PREFIX) ? base64ToUtf8(raw.slice(BACKUP_PREFIX.length).replace(/\s+/g, '')) : raw)
  } catch {
    throw new Error('This is not a Cram backup (the code or file is damaged).')
  }
  if (parsed?.app !== 'cram' || typeof parsed.data !== 'object' || !parsed.data) throw new Error('This is not a Cram backup.')
  const data = Object.fromEntries(Object.entries(parsed.data).filter(([key]) => OWN_KEY.test(key)))
  return data
}

// Merges a backup into this browser's saved data. Returns how many answered questions the backup brought.
export function restoreData(text, store = localStorage) {
  const incoming = parseBackup(text)
  const merged = mergeBackup(collectData(store), incoming)
  for (const [key, value] of Object.entries(merged)) store.setItem(key, JSON.stringify(value))
  return Object.keys(incoming[KEY_PROGRESS] ?? {}).length
}
