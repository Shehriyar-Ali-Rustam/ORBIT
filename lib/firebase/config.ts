import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey) return null
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
}

let _auth: Auth | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null

export function getFirebaseAuth(): Auth | null {
  if (_auth) return _auth
  const app = getApp()
  if (!app) return null
  _auth = getAuth(app)
  return _auth
}

export function getFirebaseDb(): Firestore | null {
  if (_db) return _db
  const app = getApp()
  if (!app) return null
  _db = getFirestore(app)
  return _db
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (_storage) return _storage
  const app = getApp()
  if (!app) return null
  _storage = getStorage(app)
  return _storage
}

// Convenience getters that throw if Firebase isn't configured (for client-side use)
export function requireAuth(): Auth {
  const auth = getFirebaseAuth()
  if (!auth) throw new Error('Firebase Auth not initialized. Check your environment variables.')
  return auth
}

export function requireDb(): Firestore {
  const db = getFirebaseDb()
  if (!db) throw new Error('Firebase Firestore not initialized. Check your environment variables.')
  return db
}

export function requireStorage(): FirebaseStorage {
  const storage = getFirebaseStorage()
  if (!storage) throw new Error('Firebase Storage not initialized. Check your environment variables.')
  return storage
}
