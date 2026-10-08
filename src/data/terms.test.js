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

import { parseMdn } from '../api/mdn'
describe('MDN pages', () => {
  it('turns an MDN Markdown file into a short plain-text summary', () => {
    const md = `---
title: "Fetch: demo"
slug: Web/API/Fetch_API
---

{{DefaultAPISidebar("Fetch API")}}

The **Fetch API** gives {{domxref("Request")}} and {{glossary("HTTP", "web")}} access, see [the guide](/en-US/docs/x) and \`fetch()\`.

Intro:

## Concepts

Not part of the summary.
`
    const page = parseMdn(md)
    expect(page.title).toBe('Fetch: demo')
    expect(page.slug).toBe('Web/API/Fetch_API')
    expect(page.paragraphs).toEqual(['The Fetch API gives Request and web access, see the guide and fetch().'])
  })
})
