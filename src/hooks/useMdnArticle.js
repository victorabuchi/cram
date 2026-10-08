import { useEffect, useState } from 'react'
import { getMdnSummary } from '../api/mdn'

// Loads the MDN summary for `path` (null = nothing to load). status: idle | loading | ready | missing | error.
export function useMdnArticle(path) {
  const [result, setResult] = useState({ path: null, status: 'idle', article: null, error: '' })

  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    getMdnSummary(path, { signal: controller.signal })
      .then((article) => setResult({ path, status: article ? 'ready' : 'missing', article, error: '' }))
      .catch((e) => {
        if (e.name !== 'AbortError') setResult({ path, status: 'error', article: null, error: e.message })
      })
    return () => controller.abort()
  }, [path])

  if (!path) return { status: 'idle', article: null, error: '' }
  if (result.path !== path) return { status: 'loading', article: null, error: '' }
  return result
}
