import { TERMS, findTerms } from './terms'

describe('findTerms', () => {
  it('finds whole-word matches case-insensitively', () => {
    const labels = findTerms('Fetch returns a Promise; the response is JSON.').map((t) => t.label)
    expect(labels).toEqual(expect.arrayContaining(['Promise', 'JSON', 'Ajax']))
  })

  it('does not match inside other words', () => {
    const labels = findTerms('The reaction and the domain were gitignored').map((t) => t.label)
    expect(labels).not.toContain('React')
    expect(labels).not.toContain('Document Object Model')
    expect(labels).not.toContain('Git')
  })

  it('has unique wiki keys', () => {
    const keys = TERMS.map((t) => t.wiki)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
