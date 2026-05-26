import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoginPage } from '@/features/auth/LoginPage'

vi.mock('@/features/auth/google-sign-in', () => ({
  signInWithGoogle: vi.fn(),
}))

describe('LoginPage', () => {
  it('renders google sign in button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: 'Войти через Google' })).toBeInTheDocument()
  })

  it('shows access denied message', () => {
    render(<LoginPage accessDenied />)
    expect(screen.getByText(/нет доступа/i)).toBeInTheDocument()
  })
})
