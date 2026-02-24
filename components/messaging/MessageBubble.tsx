'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ConversationMessage } from '@/types/marketplace'
import type { Timestamp } from 'firebase/firestore'

interface MessageBubbleProps {
  message: ConversationMessage
  isOwn: boolean
}

function formatTime(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return ''
  const date = timestamp.toDate()
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  // System message
  if (message.type === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
        className="flex justify-center py-2"
      >
        <p className="rounded-full bg-surface px-4 py-1.5 text-xs text-text-tertiary">
          {message.content}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
      className={cn('flex flex-col gap-0.5', isOwn ? 'items-end' : 'items-start')}
    >
      {/* Sender name for other messages */}
      {!isOwn && (
        <span className="mb-0.5 px-1 text-[11px] font-medium text-text-tertiary">
          {message.senderName}
        </span>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5',
          isOwn
            ? 'rounded-br-md bg-orange text-white'
            : 'rounded-bl-md border border-border bg-surface text-text-primary'
        )}
      >
        {message.type === 'file' ? (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2 text-sm underline underline-offset-2',
              isOwn ? 'text-white' : 'text-orange'
            )}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">{message.fileName || 'File'}</span>
          </a>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        )}
      </div>

      {/* Timestamp */}
      <span
        className={cn(
          'px-1 text-[10px] text-text-tertiary',
          isOwn ? 'text-right' : 'text-left'
        )}
      >
        {formatTime(message.createdAt)}
      </span>
    </motion.div>
  )
}
