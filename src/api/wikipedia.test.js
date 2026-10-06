import { ApiError, clearSummaryCache, getSummary, searchTitles } from './wikipedia'

const respond = (body, status = 200) => ({ ok: status < 400, status, json: async () => body })

beforeEach(() => clearSummaryCache())

describe('searchTitles', () => {
  it('maps the pages to key, title and description', async () => {
    const f = vi.fn().mockResolvedValue(respond({ pages: [{ key: 'Git', title: 'Git', description: 'Version control', extra: 1 }] }))
    vi.stubGlobal('fetch', f)
    expect(await searchTitles('git c++')).toEqual([{ key: 'Git', title: 'Git', description: 'Version control' }])
    expect(f.mock.calls[0][0]).toContain('q=git%20c%2B%2B')
  })

  it('returns an empty list on 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({}, 404)))
    expect(await searchTitles('zzzz')).toEqual([])
  })
})

describe('getSummary', () => {
  const page = { title: 'Git', description: 'd', extract: 'e', titles: { canonical: 'Git' }, content_urls: { desktop: { page: 'u' } }, thumbnail: { source: 't' } }

  it('returns a trimmed summary and caches it', async () => {
    const f = vi.fn().mockResolvedValue(respond(page))
    vi.stubGlobal('fetch', f)
    const first = await getSummary('Git')
    await getSummary('Git')
    expect(first).toMatchObject({ title: 'Git', extract: 'e', url: 'u', thumbnail: 't', disambiguation: false })
    expect(f).toHaveBeenCalledTimes(1)
  })

  it('returns null when the article does not exist', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({}, 404)))
    expect(await getSummary('Nope')).toBeNull()
  })

  it('explains rate limiting with a 429 error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({}, 429)))
    await expect(getSummary('Git')).rejects.toMatchObject({ status: 429, message: expect.stringMatching(/rate-limiting/) })
    await expect(getSummary('Git')).rejects.toBeInstanceOf(ApiError)
  })

  it('throws on other server errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({}, 500)))
    await expect(getSummary('Git')).rejects.toThrow('status 500')
  })
})
