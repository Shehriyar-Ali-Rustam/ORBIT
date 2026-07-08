'use client'

import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ChevronLeft } from 'lucide-react'
import { ConversationList } from '@/components/marketplace/messaging/ConversationList'
import { MessageThread } from '@/components/marketplace/messaging/MessageThread'
import { MessageInput } from '@/components/marketplace/messaging/MessageInput'
import { useConversations } from '@/hooks/marketplace/useConversations'
import { useMessages } from '@/hooks/marketplace/useMessages'
import { sendMessage } from '@/lib/marketplace/mutations'
import type { MessageType } from '@/types/marketplace'

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const conversationId = params.id as string

  const { conversations, loading: convsLoading } = useConversations(user?.id)
  const { messages, loading: msgsLoading } = useMessages(conversationId, user?.id)

  const currentConv = conversations.find((c) => c.id === conversationId)
  const otherUserId = currentConv?.participants.find((p) => p !== user?.id)
  const otherName = otherUserId ? currentConv?.participant_names[otherUserId] : 'User'

  async function handleSend(content: string, fileUrl?: string, fileName?: string) {
    if (!user?.id || !conversationId) return

    await sendMessage({
      conversation_id: conversationId,
      sender_id: user.id,
      sender_name: user.fullName || 'User',
      content,
      type: (fileUrl ? 'file' : 'text') as MessageType,
      file_url: fileUrl || null,
      file_name: fileName || null,
    })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0 -m-6 lg:-m-8">
      {/* Sidebar - conversation list */}
      <div className="hidden w-72 shrink-0 border-r border-border bg-surface lg:block">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold text-text-primary">Conversations</h2>
        </div>
        <div className="overflow-y-auto p-2">
          {!convsLoading && (
            <ConversationList
              conversations={conversations}
              activeId={conversationId}
              userId={user?.id || ''}
              onSelect={(id) => router.push(`/freelancers/dashboard/messages/${id}`)}
            />
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
          <button
            type="button"
            onClick={() => router.push('/freelancers/dashboard/messages')}
            className="text-text-tertiary hover:text-text-primary lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-dim text-xs font-bold text-orange">
              {(otherName || 'U').charAt(0)}
            </div>
            <span className="text-sm font-medium text-text-primary">{otherName}</span>
          </div>
        </div>

        {/* Messages */}
        <MessageThread messages={messages} userId={user?.id || ''} loading={msgsLoading} />

        {/* Input */}
        <MessageInput onSend={handleSend} userId={user?.id || ''} />
      </div>
    </div>
  )
}
