import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth'
import {
  authLog,
  authLogError,
  canUseSessionStorage,
  getAuthErrorCode,
  isMissingRedirectStateError,
  shouldFallbackToRedirect,
} from '@/features/auth/auth-log'
import { getFirebaseAuth } from '@/lib/firebase/client'

const provider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth()
  authLog('signInWithGoogle', {
    sessionStorage: canUseSessionStorage(),
    href: typeof window !== 'undefined' ? window.location.href : undefined,
  })

  try {
    const result = await signInWithPopup(auth, provider)
    authLog('popup sign-in ok', { email: result.user.email })
    return result.user
  } catch (error) {
    const code = getAuthErrorCode(error)
    authLogError('popup sign-in failed', error, { code })

    if (shouldFallbackToRedirect(code) && canUseSessionStorage()) {
      authLog('fallback to redirect', { code })
      await signInWithRedirect(auth, provider)
      throw new Error('redirect')
    }

    throw error
  }
}

export async function completeGoogleRedirectSignIn(): Promise<User | null> {
  if (!canUseSessionStorage()) {
    authLog('skip redirect result: sessionStorage unavailable')
    return null
  }

  try {
    const result = await getRedirectResult(getFirebaseAuth())
    if (result?.user) {
      authLog('redirect sign-in ok', { email: result.user.email })
    } else {
      authLog('redirect result empty')
    }
    return result?.user ?? null
  } catch (error) {
    if (isMissingRedirectStateError(error)) {
      authLog('redirect missing initial state — sessionStorage lost, use popup sign-in')
      return null
    }
    authLogError('redirect sign-in failed', error)
    throw error
  }
}

export async function signOutUser(): Promise<void> {
  authLog('signOut')
  await signOut(getFirebaseAuth())
}
