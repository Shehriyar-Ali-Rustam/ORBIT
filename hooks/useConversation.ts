'use client'

import { useState, useEffect } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase/config'
import type { ConversationMessage } from '@/types/marketplace'

interface UseConversationReturn {
  messages: ConversationMessage[]
  loading: boolean
}

export function useConversation(conversationId: string | null): UseConversationReturn {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      setLoading(false)
      return
    }

    const db = getFirebaseDb()
    if (!db) {
      setLoading(false)
      return
    }

    setLoading(true)

    const messagesRef = collection(db, 'conversations', conversationId, 'messages')
    const q = query(messagesRef, orderBy('createdAt', 'asc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ConversationMessage[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ConversationMessage[]

        setMessages(msgs)
        setLoading(false)
      },
      (error) => {
        console.error('Error listening to messages:', error)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [conversationId])

  return { messages, loading }
}
