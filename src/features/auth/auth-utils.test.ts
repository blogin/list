import { describe, expect, it } from 'vitest'
import { shouldFallbackToRedirect } from '@/features/auth/auth-utils'

describe('shouldFallbackToRedirect', () => {
  it('falls back only when popup is blocked or unsupported', () => {
    expect(shouldFallbackToRedirect('auth/popup-blocked')).toBe(true)
    expect(shouldFallbackToRedirect('auth/operation-not-supported-in-this-environment')).toBe(true)
  })

  it('does not fall back for internal or user-cancelled popup errors', () => {
    expect(shouldFallbackToRedirect('auth/internal-error')).toBe(false)
    expect(shouldFallbackToRedirect('auth/cancelled-popup-request')).toBe(false)
    expect(shouldFallbackToRedirect('auth/popup-closed-by-user')).toBe(false)
    expect(shouldFallbackToRedirect('auth/user-disabled')).toBe(false)
    expect(shouldFallbackToRedirect(undefined)).toBe(false)
  })
})
