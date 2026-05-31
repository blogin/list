import { describe, expect, it, vi } from 'vitest'
import { getDevAuthCredentials, isDevAutoLoginEnabled } from '@/config/dev-auth'

describe('dev-auth', () => {
  it('is disabled in non-dev builds', () => {
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_DEV_AUTO_LOGIN', 'true')
    expect(isDevAutoLoginEnabled()).toBe(false)
  })

  it('requires DEV and flag', () => {
    vi.stubEnv('DEV', true)
    vi.stubEnv('VITE_DEV_AUTO_LOGIN', 'false')
    expect(isDevAutoLoginEnabled()).toBe(false)

    vi.stubEnv('VITE_DEV_AUTO_LOGIN', 'true')
    expect(isDevAutoLoginEnabled()).toBe(true)
  })

  it('reads dev credentials', () => {
    vi.stubEnv('VITE_DEV_AUTH_EMAIL', ' dev@test.com ')
    vi.stubEnv('VITE_DEV_AUTH_PASSWORD', 'secret')
    expect(getDevAuthCredentials()).toEqual({ email: 'dev@test.com', password: 'secret' })
  })
})
