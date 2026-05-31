import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { toast } from 'sonner'
import { isEmailAllowed } from '@/config/allowed-emails'
import { isDevAutoLoginEnabled } from '@/config/dev-auth'
import { signInDevUser } from '@/features/auth/dev-auto-login'
import { completeGoogleRedirectSignIn, signOutUser } from '@/features/auth/google-sign-in'
import { getAuthErrorCode, isMissingRedirectStateError, getAuthErrorMessage } from '@/features/auth/auth-utils'
import { getFirebaseAuth } from '@/lib/firebase/client'

interface AuthContextValue {
  user: User | null
  loading: boolean
  accessDenied: boolean
  devAutoLogin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function resolveUserEmail(user: User): Promise<string | null> {
  if (user.email) return user.email

  try {
    await user.reload()
  } catch {
    return user.email
  }

  return user.email
}

async function enforceAllowedEmail(user: User | null): Promise<{
  user: User | null
  accessDenied: boolean
}> {
  if (!user) return { user: null, accessDenied: false }

  const email = await resolveUserEmail(user)
  if (isEmailAllowed(email)) {
    return { user, accessDenied: false }
  }

  await signOutUser()
  return { user: null, accessDenied: true }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const devAutoLogin = isDevAutoLoginEnabled()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    let active = true
    const auth = getFirebaseAuth()

    async function initAuth() {
      if (devAutoLogin) {
        try {
          const devUser = await signInDevUser()
          const result = await enforceAllowedEmail(devUser)
          if (!active) return
          setUser(result.user)
          setAccessDenied(result.accessDenied)
          setLoading(false)
          return
        } catch {
          if (!active) return
          toast.error(
            'Dev-вход не удался. Проверь VITE_DEV_AUTH_EMAIL/PASSWORD и Email/Password в Firebase.',
          )
          setLoading(false)
          return
        }
      }

      try {
        await completeGoogleRedirectSignIn()
      } catch (error) {
        if (!isMissingRedirectStateError(error) && !auth.currentUser) {
          const code = getAuthErrorCode(error)
          const detail = getAuthErrorMessage(error)
          toast.error(
            code
              ? detail && detail !== code
                ? `Не удалось завершить вход (${code}): ${detail}`
                : `Не удалось завершить вход (${code})`
              : 'Не удалось завершить вход через Google',
          )
        }
      }

      if (!active) return

      const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
        const result = await enforceAllowedEmail(nextUser)
        if (!active) return
        setUser(result.user)
        setAccessDenied(result.accessDenied)
        setLoading(false)
      })

      return unsubscribe
    }

    let unsubscribe: (() => void) | undefined

    void initAuth().then((unsub) => {
      unsubscribe = unsub
    })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [devAutoLogin])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      accessDenied,
      devAutoLogin,
      signOut: signOutUser,
    }),
    [user, loading, accessDenied, devAutoLogin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
