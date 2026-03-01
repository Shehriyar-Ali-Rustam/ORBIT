'use client'

import { X, MessageSquare } from 'lucide-react'

export interface ConversationItem {
  id: string
  title: string
  tool: string
  createdAt: string
}

interface ConversationListProps {
  conversations: ConversationItem[]
  activeId?: string
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <MessageSquare className="mx-auto h-5 w-5 text-text-disabled" />
        <p className="mt-2 text-xs text-text-disabled">No conversations yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {conversations.map((convo) => {
        const isActive = convo.id === activeId
        return (
          <div
            key={convo.id}
            className={`group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
              isActive
                ? 'border-l-2 border-[#FF751F] bg-surface-2 text-text-primary'
                : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
            }`}
            onClick={() => onSelect(convo.id)}
          >
            <span className="flex-1 truncate text-xs">
              {convo.title.length > 30
                ? convo.title.substring(0, 30) + '...'
                : convo.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(convo.id)
              }}
              className="hidden shrink-0 rounded p-0.5 text-text-tertiary transition-colors hover:text-red-400 group-hover:block"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
