import { useContext } from 'react'
import { TermsContext } from '../context/contexts'

export function useTerms() {
  const ctx = useContext(TermsContext)
  if (!ctx) throw new Error('useTerms must be used inside <TermsProvider>')
  return ctx
}
