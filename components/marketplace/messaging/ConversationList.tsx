'use client'

import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/marketplace'

interface ConversationListProps {
  conversations: Conversation[]
  activeId?: string
  userId: string
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, activeId, userId, onSelect }: ConversationListProps) {
  return (
    <div className="space-y-0.5">
      {conversations.map((conv) => {
        const otherUserId = conv.participants.find((p) => p !== userId) || ''
        const otherName = conv.participant_names[otherUserId] || 'User'
        const otherPhoto = conv.participant_photos[otherUserId]
        const unread = (conv.unread_count?.[userId] || 0) > 0

        return (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
              activeId === conv.id
                ? 'bg-orange-dim'
                : 'hover:bg-background'
            )}
          >
            {otherPhoto ? (
              <img src={otherPhoto} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-dim text-sm font-bold text-orange">
                {otherName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className={cn('truncate text-sm', unread ? 'font-bold text-text-primary' : 'font-medium text-text-primary')}>
                  {otherName}
                </span>
                <span className="ml-2 shrink-0 text-[10px] text-text-tertiary">
                  {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false })}
                </span>
              </div>
              <p className={cn('mt-0.5 truncate text-xs', unread ? 'font-medium text-text-secondary' : 'text-text-tertiary')}>
                {conv.last_message || 'No messages yet'}
              </p>
            </div>
            {unread && <div className="h-2 w-2 shrink-0 rounded-full bg-orange" />}
          </button>
        )
      })}
    </div>
  )
}
