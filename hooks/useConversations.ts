'use client'

import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase/config'
import type { Conversation } from '@/types/marketplace'

interface UseConversationsReturn {
  conversations: Conversation[]
  loading: boolean
}

export function useConversations(userId: string | null): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setConversations([])
      setLoading(false)
      return
    }

    const db = getFirebaseDb()
    if (!db) {
      setLoading(false)
      return
    }

    setLoading(true)

    const conversationsRef = collection(db, 'conversations')
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const convos: Conversation[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Conversation[]

        setConversations(convos)
        setLoading(false)
      },
      (error) => {
        console.error('Error listening to conversations:', error)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userId])

  return { conversations, loading }
}
