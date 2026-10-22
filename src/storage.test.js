import { applyResult, bumpDay, isDue, isMastered, streak, todayKey } from './storage'

describe('applyResult (Leitner boxes)', () => {
  it('moves a correct answer up one box and schedules it later', () => {
    const p = applyResult({}, 'q1', true, 0)
    expect(p.q1).toMatchObject({ box: 1, seen: 1, right: 1 })
    expect(p.q1.due).toBe(86400000)
  })

  it('sends a wrong answer back to box 0, due immediately', () => {
    let p = applyResult({}, 'q1', true, 0)
    p = applyResult(p, 'q1', true, 0)
    p = applyResult(p, 'q1', false, 0)
    expect(p.q1).toMatchObject({ box: 0, seen: 3, right: 2, due: 0 })
  })

  it('never goes above the last box and does not mutate its input', () => {
    const start = { q1: { box: 5, seen: 9, right: 9, due: 0 } }
    const next = applyResult(start, 'q1', true, 0)
    expect(next.q1.box).toBe(5)
    expect(start.q1.seen).toBe(9)
  })

  it('counts mastered from box 3 upwards', () => {
    expect(isMastered({ a: { box: 3 } }, 'a')).toBe(true)
    expect(isMastered({ a: { box: 2 } }, 'a')).toBe(false)
    expect(isMastered({}, 'a')).toBe(false)
  })

  it('treats unseen items and items past their due time as due', () => {
    expect(isDue({}, 'a')).toBe(true)
    expect(isDue({ a: { due: 100 } }, 'a', 50)).toBe(false)
    expect(isDue({ a: { due: 100 } }, 'a', 100)).toBe(true)
  })
})

describe('streak', () => {
  const now = new Date('2026-10-06T12:00:00Z')
  const day = (offset) => todayKey(new Date(now - offset * 86400000))

  it('counts consecutive days ending today', () => {
    expect(streak({ [day(0)]: 3, [day(1)]: 1, [day(2)]: 4 }, now)).toBe(3)
  })

  it('is not broken when today has no answers yet', () => {
    expect(streak({ [day(1)]: 1, [day(2)]: 1 }, now)).toBe(2)
  })

  it('stops at the first gap', () => {
    expect(streak({ [day(0)]: 1, [day(2)]: 1 }, now)).toBe(1)
  })

  it('bumpDay adds one answer to the day', () => {
    expect(bumpDay({ x: 1 }, 'x')).toEqual({ x: 2 })
    expect(bumpDay({}, 'y')).toEqual({ y: 1 })
  })
})

import { BACKUP_PREFIX, backupCode, collectData, mergeBackup, parseBackup, restoreData } from './storage'

describe('backup and restore', () => {
  const fakeStore = (initial = {}) => {
    const m = new Map(Object.entries(initial).map(([k, v]) => [k, JSON.stringify(v)]))
    return { get length() { return m.size }, key: (i) => [...m.keys()][i], getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }
  }

  it('merges progress per question by the number of answers, and days by the higher count', () => {
    const a = { scribletics_progress: { q1: { box: 3, seen: 5, right: 4, due: 1 }, q2: { box: 1, seen: 1, right: 1, due: 1 } }, scribletics_days: { webprog: { '2026-10-20': 4 } } }
    const b = { scribletics_progress: { q1: { box: 1, seen: 2, right: 1, due: 2 }, q3: { box: 2, seen: 3, right: 3, due: 1 } }, scribletics_days: { webprog: { '2026-10-20': 9, '2026-10-21': 2 }, bmc: { '2026-10-21': 1 } } }
    const m = mergeBackup(a, b)
    expect(m.scribletics_progress.q1.seen).toBe(5) // the browser with more answers wins
    expect(Object.keys(m.scribletics_progress).sort()).toEqual(['q1', 'q2', 'q3'])
    expect(m.scribletics_days.webprog).toEqual({ '2026-10-20': 9, '2026-10-21': 2 })
    expect(m.scribletics_days.bmc).toEqual({ '2026-10-21': 1 })
  })

  it('keeps the saved terms of both browsers and does not overwrite typed code', () => {
    const a = { scribletics_saved_terms: [{ key: 'A', title: 'A', note: 'mine' }], scribletics_code_x: 'mine' }
    const b = { scribletics_saved_terms: [{ key: 'A', title: 'A', note: 'theirs' }, { key: 'B', title: 'B', note: '' }], scribletics_code_x: 'theirs', scribletics_code_y: 'new' }
    const m = mergeBackup(a, b)
    expect(m.scribletics_saved_terms.map((t) => `${t.key}:${t.note}`)).toEqual(['A:mine', 'B:'])
    expect(m.scribletics_code_x).toBe('mine')
    expect(m.scribletics_code_y).toBe('new')
  })

  it('round-trips through a code, including non-English letters, and ignores keys that are not Cram\'s', () => {
    const data = { scribletics_progress: { 'bmc-x2-1': { box: 1, seen: 1, right: 1, due: 5 } }, scribletics_saved_terms: [{ key: 'Ä', title: 'Käsite', note: 'ö' }] }
    const code = backupCode(data)
    expect(code.startsWith(BACKUP_PREFIX)).toBe(true)
    expect(parseBackup(code)).toEqual(data)
    const withForeign = BACKUP_PREFIX + btoa(JSON.stringify({ app: 'cram', version: 1, data: { ...data, evil_key: 1 } }))
    expect(Object.keys(parseBackup(withForeign))).not.toContain('evil_key')
  })

  it('says clearly when the text is not a backup', () => {
    expect(() => parseBackup('')).toThrow(/Paste a backup/)
    expect(() => parseBackup('hello')).toThrow(/not a Cram backup/)
    expect(() => parseBackup('{"app":"other","data":{}}')).toThrow(/not a Cram backup/)
  })

  it('restores into a browser with saved data without deleting it', () => {
    const store = fakeStore({ scribletics_progress: { mine: { box: 2, seen: 2, right: 2, due: 1 } } })
    const code = backupCode({ scribletics_progress: { theirs: { box: 1, seen: 1, right: 1, due: 1 } } })
    expect(restoreData(code, store)).toBe(1)
    expect(Object.keys(JSON.parse(store.getItem('scribletics_progress'))).sort()).toEqual(['mine', 'theirs'])
    expect(Object.keys(collectData(store))).toEqual(['scribletics_progress'])
  })
})
