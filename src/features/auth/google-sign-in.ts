import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth'
import {
  canUseSessionStorage,
  getAuthErrorCode,
  isMissingRedirectStateError,
  shouldFallbackToRedirect,
} from '@/features/auth/auth-utils'
import { getFirebaseAuth } from '@/lib/firebase/client'

const provider = new GoogleAuthProvider()

/** React StrictMode в dev вызывает effect дважды — getRedirectResult только один раз. */
let pendingRedirectResult: Promise<UserCredential | null> | undefined

async function resolveRedirectResult(): Promise<UserCredential | null> {
  if (!canUseSessionStorage()) {
    return null
  }

  const auth = getFirebaseAuth()

  try {
    return await getRedirectResult(auth)
  } catch (error) {
    if (isMissingRedirectStateError(error)) {
      return null
    }

    if (auth.currentUser) {
      return null
    }

    throw error
  }
}

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
  if (!pendingRedirectResult) {
    pendingRedirectResult = resolveRedirectResult()
  }

  const result = await pendingRedirectResult
  if (result?.user) {
    return result.user
  }

  return getFirebaseAuth().currentUser
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth())
}

/** @internal */
export function resetRedirectResultCacheForTests(): void {
  pendingRedirectResult = undefined
}
