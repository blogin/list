import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase/client'

const provider = new GoogleAuthProvider()

export function isMobileAuthContext(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 767px)').matches
}

export async function signInWithGoogle(): Promise<User> {
  if (isMobileAuthContext()) {
    await signInWithRedirect(getFirebaseAuth(), provider)
    throw new Error('redirect')
  }

  const result = await signInWithPopup(getFirebaseAuth(), provider)
  return result.user
}

export async function completeGoogleRedirectSignIn(): Promise<User | null> {
  const result = await getRedirectResult(getFirebaseAuth())
  return result?.user ?? null
}

export async function signOutUser(): Promise<void> {
  await signOut(getFirebaseAuth())
}
