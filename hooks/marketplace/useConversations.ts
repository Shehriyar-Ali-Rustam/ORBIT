'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase/client'
import { getUserConversations } from '@/lib/marketplace/queries'
import type { Conversation } from '@/types/marketplace'

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    // Initial fetch
    getUserConversations(userId).then((data) => {
      setConversations(data)
      setLoading(false)
    })

    // Real-time subscription
    const supabase = getSupabase()
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          const conv = payload.new as Conversation
          if (!conv.participants?.includes(userId)) return

          setConversations((prev) => {
            const existing = prev.findIndex((c) => c.id === conv.id)
            if (existing >= 0) {
              const updated = [...prev]
              updated[existing] = conv
              return updated.sort((a, b) =>
                new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
              )
            }
            return [conv, ...prev]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { conversations, loading }
}
