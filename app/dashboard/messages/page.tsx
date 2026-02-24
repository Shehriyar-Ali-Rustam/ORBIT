'use client'

import { useState } from 'react'
import { MessageSquare, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useConversations } from '@/hooks/useConversations'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { ConversationList } from '@/components/messaging/ConversationList'
import { MessageThread } from '@/components/messaging/MessageThread'

export default function MessagesPage() {
  const { user } = useAuthStore()
  const userId = user?.uid ?? null
  const { conversations, loading } = useConversations(userId)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileShowThread, setMobileShowThread] = useState(false)

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null

  // Determine the other participant's name for the selected conversation
  const otherParticipantName = (() => {
    if (!selectedConversation || !userId) return ''
    const otherId = selectedConversation.participants.find((p) => p !== userId)
    if (!otherId) return 'Unknown'
    return selectedConversation.participantNames[otherId] ?? 'Unknown'
  })()

  function handleSelectConversation(id: string) {
    setSelectedId(id)
    setMobileShowThread(true)
  }

  function handleBack() {
    setMobileShowThread(false)
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange" />
        </div>
      </DashboardShell>
    )
  }

  if (conversations.length === 0) {
    return (
      <DashboardShell>
        <EmptyState
          icon={MessageSquare}
          title="No Conversations Yet"
          description="Your messages with buyers and sellers will appear here."
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="flex h-[calc(100vh-10rem)]">
          {/* Conversation list - left panel */}
          <div
            className={cn(
              'w-full flex-shrink-0 border-r border-border lg:block lg:w-1/3',
              mobileShowThread ? 'hidden' : 'block'
            )}
          >
            <div className="border-b border-border px-4 py-3">
              <h1 className="text-sm font-semibold uppercase tracking-wide text-text-primary">
                Messages
              </h1>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 13rem)' }}>
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={handleSelectConversation}
                userId={userId!}
              />
            </div>
          </div>

          {/* Thread - right panel */}
          <div
            className={cn(
              'w-full flex-1 lg:block',
              mobileShowThread ? 'block' : 'hidden'
            )}
          >
            {selectedId && selectedConversation ? (
              <MessageThread
                conversationId={selectedId}
                userId={userId!}
                otherParticipantName={otherParticipantName}
                onBack={handleBack}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-dim">
                  <MessageSquare className="h-7 w-7 text-orange" />
                </div>
                <p className="mt-4 text-sm font-medium text-text-secondary">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
