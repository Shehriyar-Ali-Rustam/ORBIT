'use client'

import { useRef, useEffect, useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import toast from 'react-hot-toast'
import { getFirebaseDb } from '@/lib/firebase/config'
import { uploadImage } from '@/lib/firebase/storage'
import { useConversation } from '@/hooks/useConversation'
import { MessageBubble } from '@/components/messaging/MessageBubble'
import { MessageInput } from '@/components/messaging/MessageInput'
import type { MessageType } from '@/types/marketplace'

interface MessageThreadProps {
  conversationId: string
  userId: string
  otherParticipantName: string
  onBack?: () => void
}

export function MessageThread({
  conversationId,
  userId,
  otherParticipantName,
  onBack,
}: MessageThreadProps) {
  const { messages, loading } = useConversation(conversationId)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(content: string, type: MessageType, file?: File) {
    const db = getFirebaseDb()
    if (!db) {
      toast.error('Database not available.')
      return
    }

    setSending(true)

    try {
      let fileUrl: string | undefined
      let fileName: string | undefined

      // Upload file if present
      if (file && type === 'file') {
        const path = `messages/${conversationId}/${Date.now()}_${file.name}`
        fileUrl = await uploadImage(file, path)
        fileName = file.name
      }

      // Add message to subcollection
      const messagesRef = collection(db, 'conversations', conversationId, 'messages')
      await addDoc(messagesRef, {
        senderId: userId,
        senderName: '', // Will be populated from auth context on read
        content,
        type,
        ...(fileUrl && { fileUrl }),
        ...(fileName && { fileName }),
        read: false,
        createdAt: serverTimestamp(),
      })

      // Update parent conversation doc
      const conversationRef = doc(db, 'conversations', conversationId)
      await updateDoc(conversationRef, {
        lastMessage: type === 'file' ? `Sent a file: ${fileName}` : content,
        lastMessageAt: serverTimestamp(),
        lastMessageBy: userId,
        // Increment unread for the other participant
        // We set our own unread to 0 since we just sent
        [`unreadCount.${userId}`]: 0,
      })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-text-primary">
            {otherParticipantName}
          </h2>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-orange" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-text-tertiary">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === userId}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  )
}
