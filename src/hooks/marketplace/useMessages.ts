'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase/client'
import { getConversationMessages } from '@/lib/marketplace/queries'
import { markMessagesRead } from '@/lib/marketplace/mutations'
import type { Message } from '@/types/marketplace'

export function useMessages(conversationId: string | undefined, userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId || !userId) return

    // Initial fetch
    getConversationMessages(conversationId).then((data) => {
      setMessages(data)
      setLoading(false)
      // Mark as read
      markMessagesRead(conversationId, userId)
    })

    // Real-time subscription
    const supabase = getSupabase()
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => [...prev, newMsg])
          // Mark as read if from another user
          if (newMsg.sender_id !== userId) {
            markMessagesRead(conversationId, userId)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, userId])

  return { messages, loading }
}
