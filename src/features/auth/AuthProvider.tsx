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
import { completeGoogleRedirectSignIn, signOutUser } from '@/features/auth/google-sign-in'
import { getAuthErrorCode, isMissingRedirectStateError } from '@/features/auth/auth-utils'
import { getFirebaseAuth } from '@/lib/firebase/client'

interface AuthContextValue {
  user: User | null
  loading: boolean
  accessDenied: boolean
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
  toast.error('Нет доступа. Разрешены только указанные Google-аккаунты.')
  return { user: null, accessDenied: true }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    let active = true
    const auth = getFirebaseAuth()

    async function initAuth() {
      try {
        await completeGoogleRedirectSignIn()
      } catch (error) {
        if (!isMissingRedirectStateError(error)) {
          const code = getAuthErrorCode(error)
          toast.error(
            code
              ? `Не удалось завершить вход (${code})`
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
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      accessDenied,
      signOut: signOutUser,
    }),
    [user, loading, accessDenied],
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
