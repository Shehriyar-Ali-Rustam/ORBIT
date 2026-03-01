'use client'

import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message } from '@/types/marketplace'

interface MessageThreadProps {
  messages: Message[]
  userId: string
  loading?: boolean
}

export function MessageThread({ messages, userId, loading }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-text-tertiary">No messages yet. Start the conversation!</p>
      </div>
    )
  }

  // Group messages by date
  const grouped: { date: string; messages: Message[] }[] = []
  messages.forEach((msg) => {
    const date = new Date(msg.created_at).toLocaleDateString()
    const last = grouped[grouped.length - 1]
    if (last?.date === date) {
      last.messages.push(msg)
    } else {
      grouped.push({ date, messages: [msg] })
    }
  })

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {grouped.map((group) => (
        <div key={group.date}>
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-text-tertiary">{group.date}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-2">
            {group.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === userId} />
            ))}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
