import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../App.jsx'
import { ProgressProvider } from '../context/ProgressContext.jsx'
import { TermsProvider } from '../context/TermsContext.jsx'
import { clearSummaryCache } from '../api/wikipedia'

export function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ProgressProvider>
        <TermsProvider>
          <App />
        </TermsProvider>
      </ProgressProvider>
    </MemoryRouter>,
  )
}

// Replaces fetch with a fake Wikipedia. `pages` maps article key -> summary fields.
export function fakeWikipedia(pages = {}) {
  clearSummaryCache()
  const fetchMock = vi.fn(async (url) => {
    const u = String(url)
    const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body })
    if (u.includes('/search/title')) {
      const q = decodeURIComponent(new URL(u).searchParams.get('q')).toLowerCase()
      const hits = Object.entries(pages).filter(([, p]) => p.title.toLowerCase().includes(q))
      return json({ pages: hits.map(([key, p]) => ({ key, title: p.title, description: p.description })) })
    }
    const key = decodeURIComponent(u.split('/summary/')[1])
    const p = pages[key]
    if (!p) return json({}, 404)
    return json({ titles: { canonical: key }, title: p.title, description: p.description, extract: p.extract, content_urls: { desktop: { page: `https://en.wikipedia.org/wiki/${key}` } } })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export const REACT_PAGE = {
  'React_(software)': { title: 'React (software)', description: 'JavaScript library', extract: 'React is a free and open-source front-end JavaScript library.' },
}
