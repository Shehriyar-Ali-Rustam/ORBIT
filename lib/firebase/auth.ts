import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { requireAuth, requireDb } from './config'
import type { UserRole } from '@/types/marketplace'

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  const auth = requireAuth()
  const db = requireDb()
  const result = await signInWithPopup(auth, googleProvider)
  await ensureUserDoc(db, result.user.uid, {
    email: result.user.email!,
    displayName: result.user.displayName || 'User',
    photoURL: result.user.photoURL,
  })
  return result.user
}

export async function signInWithEmail(email: string, password: string) {
  const auth = requireAuth()
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) {
  const auth = requireAuth()
  const db = requireDb()
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName })
  await createUserDoc(db, result.user.uid, {
    email,
    displayName,
    photoURL: null,
    role,
  })
  return result.user
}

export async function signOut() {
  const auth = requireAuth()
  document.cookie = 'firebase-auth-token=; path=/; max-age=0'
  await firebaseSignOut(auth)
}

async function ensureUserDoc(
  db: ReturnType<typeof requireDb>,
  uid: string,
  data: { email: string; displayName: string; photoURL: string | null }
) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      ...data,
      role: 'buyer' as UserRole,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

async function createUserDoc(
  db: ReturnType<typeof requireDb>,
  uid: string,
  data: { email: string; displayName: string; photoURL: string | null; role: UserRole }
) {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, {
    uid,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}
