'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Trash2 } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { WelcomeScreen } from './WelcomeScreen'
import { InputBar } from './InputBar'
import { TypingIndicator } from './TypingIndicator'
import { ImageResult } from './ImageResult'
import { ModelBadge } from './ModelBadge'
import { AISidebar } from './AISidebar'
import type { AttachmentFile } from './AttachmentPreview'
import { TOOL_CONFIG, type AITool } from '@/lib/ai/prompts'
import type { AIProvider } from '@/lib/ai/router'
import { useAIConversations, type AIMessage } from '@/hooks/useAIConversations'
import {
  Bot, Code2, PenTool, Languages, FileText, Briefcase, ImageIcon,
} from 'lucide-react'

const TOOL_ICONS: Record<AITool, typeof Bot> = {
  chat: Bot,
  code: Code2,
  write: PenTool,
  translate: Languages,
  resume: FileText,
  freelance: Briefcase,
  image: ImageIcon,
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider?: AIProvider
  imageData?: {
    imageUrl: string
    enhancedPrompt: string
    originalPrompt: string
  }
}

interface ChatInterfaceProps {
  tool: AITool
}

export function ChatInterface({ tool }: ChatInterfaceProps) {
  const config = TOOL_CONFIG[tool]
  const Icon = TOOL_ICONS[tool]

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentProvider, setCurrentProvider] = useState<AIProvider>('groq')
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Conversation persistence
  const {
    conversations,
    activeId,
    setActiveId,
    createConversation,
    updateConversation,
    deleteConversation,
    getConversation,
  } = useAIConversations(tool)

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (activeId && messages.length > 0) {
      const aiMessages: AIMessage[] = messages.map((m) => ({
        ...m,
        timestamp: new Date().toISOString(),
      }))
      updateConversation(activeId, aiMessages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  const handleAttach = (files: AttachmentFile[]) => {
    setAttachments((prev) => [...prev, ...files].slice(0, 5))
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => {
      const removed = prev[index]
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const processAttachments = async (): Promise<string> => {
    if (attachments.length === 0) return ''

    const parts: string[] = []
    for (const att of attachments) {
      if (att.type === 'document' && att.file.type === 'text/plain') {
        const text = await att.file.text()
        parts.push(`[Attached file: ${att.file.name}]\n${text}`)
      } else if (att.type === 'image') {
        parts.push(`[Attached image: ${att.file.name}]`)
      }
    }
    return parts.length > 0 ? '\n\n' + parts.join('\n\n') : ''
  }

  const handleSend = async () => {
    const trimmed = input.trim()
    if ((!trimmed && attachments.length === 0) || isLoading) return

    const attachmentContext = await processAttachments()
    const fullContent = trimmed + attachmentContext

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed || `Sent ${attachments.length} file(s)`,
    }

    // Create conversation on first message
    if (!activeId) {
      createConversation()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setAttachments([])
    setIsLoading(true)

    // Cancel any previous request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    try {
      if (tool === 'image') {
        await handleImageGeneration(trimmed || 'Generate an image')
      } else {
        await handleChatStream(fullContent || trimmed)
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return

      const errorMsg =
        err instanceof Error ? err.message : 'Something went wrong'
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatStream = async (userText: string) => {
    // Build messages for API (only last 20 for context)
    const apiMessages = [
      ...messages.slice(-18).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user' as const, content: userText },
    ]

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages, tool }),
      signal: abortControllerRef.current?.signal,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to get response')
    }

    // Stream the response
    const reader = res.body?.getReader()
    if (!reader) throw new Error('No response stream')

    const decoder = new TextDecoder()
    const assistantId = `assistant-${Date.now()}`

    // Add empty assistant message
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
  }

  const handleImageGeneration = async (prompt: string) => {
    const res = await fetch('/api/ai/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: abortControllerRef.current?.signal,
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to generate image')
    }

    const data = await res.json()
    setCurrentProvider(data.provider || 'groq')

    setMessages((prev) => [
      ...prev,
      {
        id: `image-${Date.now()}`,
        role: 'assistant',
        content: `Generated image for: "${prompt}"`,
        provider: data.provider,
        imageData: {
          imageUrl: data.imageUrl,
          enhancedPrompt: data.enhancedPrompt,
          originalPrompt: data.originalPrompt,
        },
      },
    ])
  }

  const handleRegenerate = async () => {
    if (messages.length < 2) return
    // Find the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUserMsg) return

    // Remove last assistant message
    setMessages((prev) => prev.slice(0, -1))

    setInput(lastUserMsg.content)
    // Use setTimeout so input updates first
    setTimeout(() => {
      setInput('')
      setIsLoading(true)
      if (tool === 'image') {
        handleImageGeneration(lastUserMsg.content).finally(() =>
          setIsLoading(false)
        )
      } else {
        handleChatStream(lastUserMsg.content).finally(() =>
          setIsLoading(false)
        )
      }
    }, 0)
  }

  const handleImageRegenerate = async (originalPrompt: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: originalPrompt }),
      })
      if (!res.ok) throw new Error('Failed to regenerate')
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          id: `image-${Date.now()}`,
          role: 'assistant',
          content: `Regenerated image for: "${originalPrompt}"`,
          provider: data.provider,
          imageData: {
            imageUrl: data.imageUrl,
            enhancedPrompt: data.enhancedPrompt,
            originalPrompt: data.originalPrompt,
          },
        },
      ])
    } catch {
      // Silently fail regeneration
    } finally {
      setIsLoading(false)
    }
  }

  const handleStop = () => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
  }

  const clearChat = () => {
    setMessages([])
    setInput('')
    setActiveId(null)
  }

  const handleNewChat = () => {
    setMessages([])
    setInput('')
    const id = createConversation()
    setActiveId(id)
  }

  const handleSelectConversation = (id: string) => {
    const convo = getConversation(id)
    if (convo) {
      setActiveId(id)
      setMessages(convo.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        provider: m.provider as AIProvider | undefined,
        imageData: m.imageData,
      })))
    }
  }

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id)
    if (activeId === id) {
      setMessages([])
      setActiveId(null)
    }
  }

  const handleSuggestionClick = (text: string) => {
    setInput(text)
  }

  return (
    <>
    <AISidebar
      conversations={conversations.map((c) => ({
        id: c.id,
        title: c.title,
        tool: c.tool,
        createdAt: c.createdAt,
      }))}
      activeConversationId={activeId || undefined}
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      onDeleteConversation={handleDeleteConversation}
    />
    <main className="flex-1 overflow-hidden">
    <div className="flex h-full flex-col bg-background">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 lg:px-6">
        <div className="flex items-center gap-3 pl-12 lg:pl-0">
          <Icon className="h-5 w-5 text-[#FF751F]" />
          <span className="text-sm font-semibold text-text-primary">{config.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <ModelBadge provider={currentProvider} />
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen
            tool={tool}
            suggestions={config.suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 lg:px-6">
            {messages.map((msg, idx) => {
              // Render image result for image tool
              if (msg.imageData) {
                return (
                  <div key={msg.id}>
                    {/* Show user message above */}
                    {msg.role === 'assistant' && (
                      <div className="mb-4">
                        <MessageBubble
                          role="assistant"
                          content={msg.content}
                          provider={msg.provider}
                        />
                      </div>
                    )}
                    <ImageResult
                      imageUrl={msg.imageData.imageUrl}
                      enhancedPrompt={msg.imageData.enhancedPrompt}
                      originalPrompt={msg.imageData.originalPrompt}
                      onRegenerate={() =>
                        handleImageRegenerate(msg.imageData!.originalPrompt)
                      }
                      isRegenerating={isLoading}
                    />
                  </div>
                )
              }

              return (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  provider={msg.provider}
                  isLast={
                    idx === messages.length - 1 && msg.role === 'assistant'
                  }
                  onRegenerate={handleRegenerate}
                />
              )
            })}

            {isLoading && !messages.some((m) => m.content === '' && m.role === 'assistant') && (
              <TypingIndicator />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        onStop={handleStop}
        placeholder={config.placeholder}
        isLoading={isLoading}
        attachments={attachments}
        onAttach={handleAttach}
        onRemoveAttachment={handleRemoveAttachment}
      />
    </div>
    </main>
    </>
  )
}
