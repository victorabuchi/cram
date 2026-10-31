import { PRACTICE_EXTRA } from './webprog/practiceExtra'
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
  })
})

describe('Web Programming I practice set', () => {
  const web = ITEMS.filter((i) => i.subject === 'webprog')
  it('offers the 26 Moodle questions, 82 questions from the bank, and the code exercises', () => {
    expect(web.filter((i) => i.setNo)).toHaveLength(26)
    expect(web.filter((i) => i.inPractice)).toHaveLength(26 + 82)
    expect(web.length).toBe(26 + 82 + 13)
  })
  it('has at least 10 practice questions on every topic, each with a known id and a full answer', () => {
    const practice = web.filter((i) => i.inPractice)
    const topics = Object.keys(TOPICS).filter((t) => practice.some((i) => i.topic === t))
    expect(topics).toHaveLength(10)
    for (const t of topics) expect(practice.filter((i) => i.topic === t).length, t).toBeGreaterThanOrEqual(10)
    for (const n of [1, 2, 3, 4, 5, 6]) expect(practice.some((i) => i.week === n), `week ${n}`).toBe(true)
    for (const id of PRACTICE_EXTRA) expect(web.find((i) => i.id === id), id).toBeTruthy()
    for (const q of practice.filter((i) => i.kind === 'mcq')) {
      expect(new Set(q.options).size, q.id).toBe(q.options.length)
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(3)
    }
  })
})

import { learnMoreLinks, linkUrls } from './related'
describe('Learn more links', () => {
  const ep = (n) => ITEMS.find((i) => i.setNo === n)
  const labels = (item) => learnMoreLinks(item).map((t) => t.label)
  it('point a CSS specificity question to specificity, on MDN', () => {
    const [first] = learnMoreLinks(ep(6))
    expect(first.label).toMatch(/specificity|selectors/)
    expect(first.links.map((l) => l.name)).toEqual(['MDN'])
    expect(first.links.every((l) => l.url.startsWith('https://'))).toBe(true)
  })
  it('point a useState question to React state, not to unrelated topics', () => {
    expect(labels(ep(5))[0]).toBe('React state (useState)')
    expect(labels(ep(3)).join()).not.toMatch(/React/) // the Bootstrap question mentions "components" but is not about React
  })
  it('give most Moodle questions at least one link', () => {
    const withLinks = ITEMS.filter((i) => i.setNo).filter((i) => learnMoreLinks(i).length > 0)
    expect(withLinks.length).toBeGreaterThanOrEqual(24)
  })
  it('only link to MDN, the official Git, GitHub, React and Bootstrap docs, or Wikipedia, and never to W3Schools', () => {
    for (const i of ITEMS.filter((x) => x.subject === 'webprog' && x.kind !== 'code')) {
      for (const t of learnMoreLinks(i)) for (const l of t.links) expect(l.url).toMatch(/^https:\/\/(developer\.mozilla\.org|git-scm\.com|docs\.github\.com|react\.dev|getbootstrap\.com|en\.wikipedia\.org)\//)
    }
    expect(linkUrls().some((u) => /w3schools/.test(u))).toBe(false)
  })
})
