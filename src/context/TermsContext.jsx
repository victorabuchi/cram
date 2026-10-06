import { useEffect, useMemo, useReducer } from 'react'
import { termsReducer } from '../reducers/terms'
import { read, write } from '../storage'
import { TermsContext } from './contexts'

const KEY = 'scribletics_saved_terms'

// Terms the student saved from the glossary or from a Learn card, with a personal note.
export function TermsProvider({ children }) {
  const [saved, dispatch] = useReducer(termsReducer, null, () => read(KEY, []))
  useEffect(() => write(KEY, saved), [saved])
  const value = useMemo(() => ({ saved, dispatch }), [saved])
  return <TermsContext.Provider value={value}>{children}</TermsContext.Provider>
}
