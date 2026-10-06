// Wikipedia REST API (public, JSON, CORS enabled, no key needed).
// https://en.wikipedia.org/api/rest_v1/ and https://www.mediawiki.org/wiki/API:REST_API
const SEARCH = 'https://en.wikipedia.org/w/rest.php/v1/search/title'
const SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function getJson(url, signal) {
  const response = await fetch(url, { signal })
  if (response.status === 404) return null
  if (response.status === 429) throw new ApiError('Wikipedia is rate-limiting requests. Wait a few seconds and try again.', 429)
  if (!response.ok) throw new ApiError(`Wikipedia answered with status ${response.status}`, response.status)
  return response.json()
}

// Titles of articles matching the search term.
export async function searchTitles(term, { limit = 5, signal } = {}) {
  const data = await getJson(`${SEARCH}?q=${encodeURIComponent(term)}&limit=${limit}`, signal)
  return (data?.pages ?? []).map((p) => ({ key: p.key, title: p.title, description: p.description }))
}

// Summaries are cached for the session so reopening a term costs no request.
const cache = new Map()
export const clearSummaryCache = () => cache.clear()

// Short summary of one article (key as returned by searchTitles, e.g. "React_(software)").
export async function getSummary(key, { signal } = {}) {
  const id = key.replace(/ /g, '_')
  if (cache.has(id)) return cache.get(id)
  const data = await getJson(`${SUMMARY}/${encodeURIComponent(id)}`, signal)
  const summary = data && {
    key: data.titles?.canonical ?? id,
    title: data.title,
    description: data.description,
    extract: data.extract,
    thumbnail: data.thumbnail?.source,
    url: data.content_urls?.desktop?.page,
    disambiguation: data.type === 'disambiguation',
  }
  if (summary) cache.set(id, summary)
  return summary
}
