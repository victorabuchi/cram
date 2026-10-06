import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProgressContext } from './contexts'
import { KEY_DAYS, KEY_PROGRESS, applyResult, bumpDay, read, write } from '../storage'

// Shared study progress, so the dashboard, practice, practice test and progress pages stay in sync.
export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => read(KEY_PROGRESS, {}))
  const [days, setDays] = useState(() => read(KEY_DAYS, {}))

  useEffect(() => write(KEY_PROGRESS, progress), [progress])
  useEffect(() => write(KEY_DAYS, days), [days])

  const record = useCallback((id, correct) => {
    setProgress((p) => applyResult(p, id, correct))
    setDays((d) => bumpDay(d))
  }, [])
  const reset = useCallback(() => {
    setProgress({})
    setDays({})
  }, [])

  const value = useMemo(() => ({ progress, days, record, reset }), [progress, days, record, reset])
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
