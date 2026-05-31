import { type FirebaseApp, initializeApp } from 'firebase/app'
import {
  type Auth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  initializeAuth,
} from 'firebase/auth'
import { type Database, getDatabase } from 'firebase/database'

function readEnv(key: string): string {
  const value = import.meta.env[key as keyof ImportMetaEnv] as string | undefined
  if (!value) {
    throw new Error(`Missing Firebase env: ${key}. Copy .env.example to .env.local`)
  }
  return value
}

let app: FirebaseApp | undefined
let authInstance: Auth | undefined
let databaseInstance: Database | undefined

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp({
      apiKey: readEnv('VITE_FIREBASE_API_KEY'),
      authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
      databaseURL: readEnv('VITE_FIREBASE_DATABASE_URL'),
      projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
      storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
      appId: readEnv('VITE_FIREBASE_APP_ID'),
    })
  }
  return app
}

export function getFirebaseAuthDomain(): string {
  return readEnv('VITE_FIREBASE_AUTH_DOMAIN')
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    try {
      authInstance = initializeAuth(getFirebaseApp(), {
        persistence: browserLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      })
    } catch {
      authInstance = getAuth(getFirebaseApp())
    }
  }
  return authInstance
}

export function getFirebaseDatabase(): Database {
  if (!databaseInstance) {
    databaseInstance = getDatabase(getFirebaseApp())
  }
  return databaseInstance
}

export function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_DATABASE_URL)
}
