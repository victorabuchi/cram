import { useCallback, useEffect, useMemo, useState } from 'react'
import { ITEMS, VARIANTS } from '../data/content'
import { KEY_DAYS, KEY_PROGRESS, applyResult, bumpDay, migrateDays, read, write } from '../storage'
import { ProgressContext } from './contexts'

const subjectOfItem = new Map([...ITEMS, ...VARIANTS].map((i) => [i.id, i.subject]))

// Shared study progress, so the dashboard, practice, practice test and progress pages stay in sync.
// `progress` is keyed by question id; `days` by course id, then by date.
export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => read(KEY_PROGRESS, {}))
  const [days, setDays] = useState(() => migrateDays(read(KEY_DAYS, {})))

  useEffect(() => write(KEY_PROGRESS, progress), [progress])
  useEffect(() => write(KEY_DAYS, days), [days])

  const record = useCallback((id, correct) => {
    const subject = subjectOfItem.get(id)
    setProgress((p) => applyResult(p, id, correct))
    if (subject) setDays((d) => ({ ...d, [subject]: bumpDay(d[subject] || {}) }))
  }, [])

  // Forgets the progress of one course only.
  const reset = useCallback((subjectId) => {
    setProgress((p) => Object.fromEntries(Object.entries(p).filter(([id]) => subjectOfItem.get(id) !== subjectId)))
    setDays((d) => ({ ...d, [subjectId]: {} }))
  }, [])

  const value = useMemo(() => ({ progress, days, record, reset }), [progress, days, record, reset])
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
