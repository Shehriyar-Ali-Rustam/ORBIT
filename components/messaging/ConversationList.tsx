'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/marketplace'
import type { Timestamp } from 'firebase/firestore'

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  userId: string
}

function formatRelativeTime(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return ''

  const now = Date.now()
  const time = timestamp.toMillis()
  const diffMs = now - time
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`

  const date = new Date(time)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  userId,
}: ConversationListProps) {
  return (
    <div className="flex flex-col">
      {conversations.map((conversation) => {
        const otherParticipantId = conversation.participants.find((p) => p !== userId)
        const otherName = otherParticipantId
          ? conversation.participantNames[otherParticipantId] ?? 'Unknown'
          : 'Unknown'
        const otherPhoto = otherParticipantId
          ? conversation.participantPhotos[otherParticipantId] ?? null
          : null
        const unread = conversation.unreadCount?.[userId] ?? 0
        const isSelected = conversation.id === selectedId

        return (
          <motion.button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
              isSelected
                ? 'bg-orange-dim'
                : 'hover:bg-surface'
            )}
            whileHover={{ x: 2 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.2 }}
          >
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface">
              {otherPhoto ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={otherPhoto}
                  alt={otherName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-orange-dim text-sm font-bold text-orange">
                  {otherName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'truncate text-sm',
                    unread > 0 ? 'font-bold text-text-primary' : 'font-medium text-text-primary'
                  )}
                >
                  {otherName}
                </span>
                <span className="shrink-0 text-xs text-text-tertiary">
                  {formatRelativeTime(conversation.lastMessageAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    'truncate text-xs',
                    unread > 0 ? 'font-medium text-text-secondary' : 'text-text-tertiary'
                  )}
                >
                  {conversation.lastMessage || 'No messages yet'}
                </p>
                {unread > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
