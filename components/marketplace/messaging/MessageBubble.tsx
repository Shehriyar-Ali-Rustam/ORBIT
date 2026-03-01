'use client'

import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Message } from '@/types/marketplace'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center py-2">
        <span className="rounded-full bg-surface px-3 py-1 text-xs text-text-tertiary">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2.5',
          isOwn
            ? 'rounded-br-md bg-orange text-white'
            : 'rounded-bl-md bg-surface text-text-primary'
        )}
      >
        {!isOwn && (
          <p className="mb-0.5 text-[10px] font-medium text-text-tertiary">{message.sender_name}</p>
        )}

        {message.type === 'file' && message.file_url && (
          <a
            href={message.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'mb-1 flex items-center gap-2 rounded-lg border p-2 text-xs',
              isOwn ? 'border-white/20 hover:bg-white/10' : 'border-border hover:bg-background'
            )}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">{message.file_name || 'File'}</span>
          </a>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

        <p className={cn(
          'mt-1 text-right text-[10px]',
          isOwn ? 'text-white/60' : 'text-text-tertiary'
        )}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
