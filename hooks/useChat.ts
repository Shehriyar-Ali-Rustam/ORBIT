'use client'

import { useState, useCallback, useRef } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Orbit AI. I can help you learn about our services, pricing, portfolio, and more. What would you like to know?",
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setError(null)

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      // Build messages for the new AI chat API
      const apiMessages = [
        ...messages.filter((m) => m.id !== 'welcome').slice(-18).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: content.trim() },
      ]

      const assistantId = `assistant-${Date.now()}`

      try {
        abortControllerRef.current = new AbortController()

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages, tool: 'chat' }),
          signal: abortControllerRef.current.signal,
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Something went wrong.')
        }

        const reader = res.body?.getReader()
        if (!reader) throw new Error('No response stream.')

        const decoder = new TextDecoder()

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: '' },
        ])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          )
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return

        const errorMsg = err instanceof Error ? err.message : 'Something went wrong.'
        setError(errorMsg)

        setMessages((prev) => [
          ...prev.filter((m) => m.id !== assistantId),
          {
            id: assistantId,
            role: 'assistant',
            content:
              "I'm having trouble responding right now. Please try again or contact us at hello.theorbit@gmail.com.",
          },
        ])
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [messages, isLoading]
  )

  const clearMessages = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearMessages }
}
