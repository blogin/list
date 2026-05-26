import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth'
import {
  canUseSessionStorage,
  getAuthErrorCode,
  isMissingRedirectStateError,
  shouldFallbackToRedirect,
} from '@/features/auth/auth-utils'
import { getFirebaseAuth } from '@/lib/firebase/client'

const provider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth()

  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    const code = getAuthErrorCode(error)

    if (shouldFallbackToRedirect(code) && canUseSessionStorage()) {
      await signInWithRedirect(auth, provider)
      throw new Error('redirect')
    }

    throw error
  }
}

export async function completeGoogleRedirectSignIn(): Promise<User | null> {
  if (!canUseSessionStorage()) {
    return null
  }

  try {
    const result = await getRedirectResult(getFirebaseAuth())
    return result?.user ?? null
  } catch (error) {
    if (isMissingRedirectStateError(error)) {
      return null
    }
    throw error
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth())
}
