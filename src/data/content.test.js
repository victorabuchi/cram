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
  it('is small: the 26 Moodle questions, the 25 question set questions, the code exercises and a few related questions', () => {
    expect(web.filter((i) => i.setNo)).toHaveLength(26)
    expect(web.filter((i) => i.listNo)).toHaveLength(25)
    expect(web.length).toBeLessThan(130)
    expect(web.filter((i) => !i.setNo && !i.listNo && i.kind !== 'code').every((i) => i.kind === 'mcq')).toBe(true)
  })
  it('has practice questions in every week', () => {
    for (const week of [1, 2, 3, 4, 5, 6]) expect(web.filter((i) => i.week === week && i.kind !== 'code').length).toBeGreaterThan(5)
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
