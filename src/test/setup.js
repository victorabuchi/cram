import '@testing-library/jest-dom/vitest'
import * as axeMatchers from 'vitest-axe/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect, vi } from 'vitest'
import { clearSummaryCache } from '../api/wikipedia'

expect.extend(axeMatchers)
window.scrollTo = vi.fn()

afterEach(() => {
  cleanup()
  clearSummaryCache()
  localStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
