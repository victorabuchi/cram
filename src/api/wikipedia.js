// Wikipedia REST API (public, JSON, CORS enabled, no key needed).
// https://en.wikipedia.org/api/rest_v1/ and https://www.mediawiki.org/wiki/API:REST_API
const SEARCH = 'https://en.wikipedia.org/w/rest.php/v1/search/title'
const SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary'

async function getJson(url) {
  const response = await fetch(url)
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Wikipedia answered with status ${response.status}`)
  return response.json()
}

// Titles of articles matching the search term.
export async function searchTitles(term, limit = 5) {
  const data = await getJson(`${SEARCH}?q=${encodeURIComponent(term)}&limit=${limit}`)
  return (data?.pages ?? []).map((p) => ({ key: p.key, title: p.title, description: p.description }))
}

// Short summary of one article (key as returned by searchTitles, e.g. "React_(software)").
export async function getSummary(key) {
  const data = await getJson(`${SUMMARY}/${encodeURIComponent(key)}`)
  if (!data) return null
  return {
    title: data.title,
    description: data.description,
    extract: data.extract,
    thumbnail: data.thumbnail?.source,
    url: data.content_urls?.desktop?.page,
  }
}
