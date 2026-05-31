import { signInWithEmailAndPassword, type User } from 'firebase/auth'
import { getDevAuthCredentials } from '@/config/dev-auth'
import { getFirebaseAuth } from '@/lib/firebase/client'

export async function signInDevUser(): Promise<User> {
  const credentials = getDevAuthCredentials()
  if (!credentials) {
    throw new Error('missing-dev-auth-credentials')
  }

  const auth = getFirebaseAuth()
  if (auth.currentUser?.email?.toLowerCase() === credentials.email.toLowerCase()) {
    return auth.currentUser
  }

  const result = await signInWithEmailAndPassword(
    auth,
    credentials.email,
    credentials.password,
  )
  return result.user
}
