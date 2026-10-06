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
