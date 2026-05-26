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
import { getFirebaseAuth } from '@/lib/firebase/client'

interface AuthContextValue {
  user: User | null
  loading: boolean
  accessDenied: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function enforceAllowedEmail(user: User | null): Promise<{
  user: User | null
  accessDenied: boolean
}> {
  if (!user) return { user: null, accessDenied: false }

  if (isEmailAllowed(user.email)) {
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

    async function bootstrap() {
      try {
        const redirectUser = await completeGoogleRedirectSignIn()
        if (redirectUser && active) {
          const result = await enforceAllowedEmail(redirectUser)
          setUser(result.user)
          setAccessDenied(result.accessDenied)
        }
      } catch {
        toast.error('Не удалось завершить вход через Google')
      }
    }

    void bootstrap()

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (nextUser) => {
      const result = await enforceAllowedEmail(nextUser)
      if (!active) return
      setUser(result.user)
      setAccessDenied(result.accessDenied)
      setLoading(false)
    })

    return () => {
      active = false
      unsubscribe()
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
