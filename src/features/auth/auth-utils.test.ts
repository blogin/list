import { describe, expect, it } from 'vitest'
import { shouldFallbackToRedirect } from '@/features/auth/auth-utils'

describe('shouldFallbackToRedirect', () => {
  it('falls back for popup and internal errors', () => {
    expect(shouldFallbackToRedirect('auth/popup-blocked')).toBe(true)
    expect(shouldFallbackToRedirect('auth/internal-error')).toBe(true)
    expect(shouldFallbackToRedirect('auth/cancelled-popup-request')).toBe(true)
  })

  it('does not fall back for unrelated errors', () => {
    expect(shouldFallbackToRedirect('auth/user-disabled')).toBe(false)
    expect(shouldFallbackToRedirect(undefined)).toBe(false)
  })
})
