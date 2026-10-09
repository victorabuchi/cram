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
    expect(week(ITEMS).length).toBeGreaterThan(5) // only the related practice questions are offered
  })
})

describe('Web Programming I practice set', () => {
  const web = ITEMS.filter((i) => i.subject === 'webprog')
  it('is small: the 26 Moodle questions, the code exercises and a few related questions', () => {
    expect(web.filter((i) => i.setNo)).toHaveLength(26)
    expect(web.length).toBeLessThan(110)
    expect(web.filter((i) => !i.setNo && i.kind !== 'code').every((i) => i.kind === 'mcq')).toBe(true)
  })
  it('has practice questions in every week', () => {
    for (const week of [1, 2, 3, 4, 5, 6]) expect(web.filter((i) => i.week === week && i.kind !== 'code').length).toBeGreaterThan(5)
  })
})
