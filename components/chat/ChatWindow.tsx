'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { X, Send, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage } from './ChatMessage'
import type { Message } from '@/hooks/useChat'

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  onSend: (content: string) => void
  onClear: () => void
  onClose: () => void
}

export function ChatWindow({ messages, isLoading, onSend, onClear, onClose }: ChatWindowProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={cn(
        'fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border shadow-2xl',
        'bg-background',
        'max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-0 max-sm:h-full max-sm:w-full max-sm:rounded-none'
      )}
      role="dialog"
      aria-label="Orbit AI Chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange">
            <span className="text-sm font-bold text-white">O</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Orbit AI</h3>
            <p className="text-xs text-text-tertiary">{isLoading ? 'Typing...' : 'Online'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary"
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-surface px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about our services..."
            rows={1}
            className={cn(
              'max-h-24 flex-1 resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary',
              'transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'
            )}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all',
              input.trim() && !isLoading
                ? 'bg-orange text-white shadow-orange-glow-sm hover:bg-orange-hover hover:shadow-orange-glow'
                : 'cursor-not-allowed bg-surface-2 text-text-disabled'
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-text-disabled">
          Powered by Gemini AI &bull; ORBIT
        </p>
      </div>
    </motion.div>
  )
}
