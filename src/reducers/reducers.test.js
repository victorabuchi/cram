import { isFinished, sessionReducer } from './session'
import { termsReducer } from './terms'

const items = [{ id: 'a' }, { id: 'b' }]

describe('sessionReducer', () => {
  it('starts, scores answers, advances and finishes', () => {
    let s = sessionReducer(null, { type: 'start', items })
    expect(s).toMatchObject({ index: 0, right: 0, wrong: [] })

    s = sessionReducer(s, { type: 'answer', item: items[0], score: 1 })
    s = sessionReducer(s, { type: 'next' })
    s = sessionReducer(s, { type: 'answer', item: items[1], score: 0 })
    s = sessionReducer(s, { type: 'next' })

    expect(s.right).toBe(1)
    expect(s.wrong).toEqual([items[1]])
    expect(isFinished(s)).toBe(true)
  })

  it('treats 0.7 as passing for open questions', () => {
    let s = sessionReducer(null, { type: 'start', items })
    s = sessionReducer(s, { type: 'answer', item: items[0], score: 0.7 })
    expect(s.right).toBe(1)
  })

  it('keeps ungraded (mock) answers out of right and wrong but stores the detail', () => {
    let s = sessionReducer(null, { type: 'start', items })
    s = sessionReducer(s, { type: 'answer', item: items[0], score: null, detail: { text: 'my answer' } })
    expect(s.right).toBe(0)
    expect(s.wrong).toEqual([])
    expect(s.results.a.text).toBe('my answer')
  })

  it('goes back one question, but never before the first', () => {
    let s = sessionReducer(null, { type: 'start', items })
    s = sessionReducer(s, { type: 'back' })
    expect(s.index).toBe(0)
    s = sessionReducer(sessionReducer(s, { type: 'next' }), { type: 'back' })
    expect(s.index).toBe(0)
  })

  it('remembers what was entered for each question', () => {
    let s = sessionReducer(null, { type: 'start', items })
    s = sessionReducer(s, { type: 'draft', id: 'a', draft: { chosen: 'x' } })
    s = sessionReducer(s, { type: 'draft', id: 'a', draft: { chosen: 'y' } })
    s = sessionReducer(s, { type: 'draft', id: 'b', draft: { text: 'hi' } })
    expect(s.drafts).toEqual({ a: { chosen: 'y' }, b: { text: 'hi' } })
  })

  it('ends by returning null', () => {
    expect(sessionReducer({ items }, { type: 'end' })).toBeNull()
  })
})

describe('termsReducer', () => {
  const git = { key: 'Git', title: 'Git' }

  it('saves a term once, with an empty note', () => {
    let s = termsReducer([], { type: 'save', term: git })
    s = termsReducer(s, { type: 'save', term: git })
    expect(s).toEqual([{ key: 'Git', title: 'Git', note: '' }])
  })

  it('edits a note and removes a term', () => {
    let s = termsReducer([], { type: 'save', term: git })
    s = termsReducer(s, { type: 'note', key: 'Git', note: 'version control' })
    expect(s[0].note).toBe('version control')
    expect(termsReducer(s, { type: 'remove', key: 'Git' })).toEqual([])
  })
})
