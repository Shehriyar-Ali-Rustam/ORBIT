'use client'

import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'
import type { Message } from '@/hooks/useChat'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          isUser ? 'bg-orange-dim' : 'bg-orange'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-orange" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-sm bg-orange text-white'
            : 'rounded-tl-sm border border-border bg-surface text-text-primary'
        )}
      >
        {message.content || (
          <span className="inline-flex gap-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange [animation-delay:0.2s]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange [animation-delay:0.4s]" />
          </span>
        )}
      </div>
    </div>
  )
}
