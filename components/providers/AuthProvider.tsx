'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase/config'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { MarketplaceUser } from '@/types/marketplace'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setFirebaseUid, setLoading } = useAuthStore()

  useEffect(() => {
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()

    // If Firebase isn't configured, skip auth listener
    if (!auth || !db) {
      setLoading(false)
      return
    }

    let unsubFirestore: (() => void) | null = null

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubFirestore) {
        unsubFirestore()
        unsubFirestore = null
      }

      if (firebaseUser) {
        setFirebaseUid(firebaseUser.uid)

        // Set cookie for middleware
        firebaseUser.getIdToken().then((token) => {
          document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Lax`
        })

        // Listen to user doc in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid)
        unsubFirestore = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setUser(snap.data() as MarketplaceUser)
          } else {
            // User doc doesn't exist yet (might be creating)
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL,
              role: 'buyer',
            } as MarketplaceUser)
          }
          setLoading(false)
        })
      } else {
        setUser(null)
        setFirebaseUid(null)
        setLoading(false)
      }
    })

    return () => {
      unsubAuth()
      if (unsubFirestore) unsubFirestore()
    }
  }, [setUser, setFirebaseUid, setLoading])

  return <>{children}</>
}
