'use client'

import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase/config'
import type { Conversation } from '@/types/marketplace'

interface UseUnreadMessagesReturn {
  unreadCount: number
}

export function useUnreadMessages(userId: string | null): UseUnreadMessagesReturn {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!userId) {
      setUnreadCount(0)
      return
    }

    const db = getFirebaseDb()
    if (!db) return

    const conversationsRef = collection(db, 'conversations')
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let total = 0
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as Conversation
          const count = data.unreadCount?.[userId] ?? 0
          total += count
        })
        setUnreadCount(total)
      },
      (error) => {
        console.error('Error listening to unread messages:', error)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userId])

  return { unreadCount }
}
