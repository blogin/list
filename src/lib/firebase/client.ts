import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function requireConfig(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`Missing Firebase env: ${key}. Copy .env.example to .env.local`)
  }
  return value
}

export const firebaseApp = initializeApp({
  apiKey: requireConfig(firebaseConfig.apiKey, 'VITE_FIREBASE_API_KEY'),
  authDomain: requireConfig(firebaseConfig.authDomain, 'VITE_FIREBASE_AUTH_DOMAIN'),
  databaseURL: requireConfig(firebaseConfig.databaseURL, 'VITE_FIREBASE_DATABASE_URL'),
  projectId: requireConfig(firebaseConfig.projectId, 'VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireConfig(firebaseConfig.storageBucket, 'VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireConfig(
    firebaseConfig.messagingSenderId,
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
  ),
  appId: requireConfig(firebaseConfig.appId, 'VITE_FIREBASE_APP_ID'),
})

export const auth = getAuth(firebaseApp)
export const database = getDatabase(firebaseApp)
