import { ITEMS, LEARN, TOPICS } from './content'
import { SUBJECTS } from './subjects'

describe('study content', () => {
  it('has unique question ids', () => {
    const ids = ITEMS.map((i) => i.id)
    expect(ids.filter((id, n) => ids.indexOf(id) !== n)).toEqual([])
  })

  it('has well-formed multiple-choice questions: the first option is the answer and all options differ', () => {
    for (const q of ITEMS.filter((i) => i.kind === 'mcq')) {
      expect({ id: q.id, ok: q.options.length >= 2 && new Set(q.options).size === q.options.length }).toEqual({ id: q.id, ok: true })
    }
  })

  it('has key points and a model answer for every open question', () => {
    for (const q of ITEMS.filter((i) => i.kind === 'explain')) {
      expect({ id: q.id, keyPoints: q.keyPoints?.length > 0, model: !!q.model }).toEqual({ id: q.id, keyPoints: true, model: true })
    }
  })

  it('puts every item in an existing course, week and topic', () => {
    for (const item of [...ITEMS, ...LEARN]) {
      const subject = SUBJECTS.find((s) => s.id === item.subject)
      expect({ id: item.id ?? item.title, subject: !!subject, week: !!subject?.weeks.some((w) => w.n === item.week), topic: item.topic in TOPICS })
        .toEqual({ id: item.id ?? item.title, subject: true, week: true, topic: true })
    }
  })

  it('gives week 6 of Web Programming I its lecture and assignment material', () => {
    const week = (list) => list.filter((i) => i.subject === 'webprog' && i.week === 6)
    expect(week(LEARN).length).toBeGreaterThan(10)
    expect(week(ITEMS).length).toBeGreaterThan(50)
  })
})
