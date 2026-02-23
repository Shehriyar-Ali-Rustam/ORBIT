'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChatBubble } from './ChatBubble'
import { ChatWindow } from './ChatWindow'
import { useChat } from '@/hooks/useChat'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, isLoading, sendMessage, clearMessages } = useChat()

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSend={sendMessage}
            onClear={clearMessages}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <ChatBubble isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
    </>
  )
}
