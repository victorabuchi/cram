import { useEffect, useState } from 'react'
import { getSummary } from '../api/wikipedia'

// Loads the Wikipedia summary for `key` (null = nothing to load).
// status: idle | loading | ready | missing | error. The request is cancelled when the key changes or the component unmounts.
export function useWikiArticle(key) {
  const [result, setResult] = useState({ key: null, status: 'idle', article: null, error: '' })

  useEffect(() => {
    if (!key) return
    const controller = new AbortController()
    getSummary(key, { signal: controller.signal })
      .then((article) => setResult({ key, status: article ? 'ready' : 'missing', article, error: '' }))
      .catch((e) => {
        if (e.name !== 'AbortError') setResult({ key, status: 'error', article: null, error: e.message })
      })
    return () => controller.abort()
  }, [key])

  // A result for an older key means the new request is still running.
  if (!key) return { status: 'idle', article: null, error: '' }
  if (result.key !== key) return { status: 'loading', article: null, error: '' }
  return result
}
