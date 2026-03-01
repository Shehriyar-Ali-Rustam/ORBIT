'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { ConversationList } from '@/components/marketplace/messaging/ConversationList'
import { useConversations } from '@/hooks/marketplace/useConversations'

export default function MessagesPage() {
  const { user } = useUser()
  const router = useRouter()
  const { conversations, loading } = useConversations(user?.id)

  function handleSelect(id: string) {
    router.push(`/freelancers/dashboard/messages/${id}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
        <p className="mt-1 text-sm text-text-secondary">{conversations.length} conversation(s)</p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface py-16">
          <MessageSquare className="mb-3 h-10 w-10 text-text-tertiary" />
          <p className="text-sm text-text-tertiary">No conversations yet.</p>
          <p className="mt-1 text-xs text-text-tertiary">Messages from buyers and sellers will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface">
          <ConversationList
            conversations={conversations}
            userId={user?.id || ''}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  )
}
