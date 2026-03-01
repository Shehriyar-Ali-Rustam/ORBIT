'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AITool } from '@/lib/ai/prompts'

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider?: string
  timestamp: string
  imageData?: {
    imageUrl: string
    enhancedPrompt: string
    originalPrompt: string
  }
}

export interface AIConversation {
  id: string
  tool: AITool
  title: string
  messages: AIMessage[]
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'orbit-ai-conversations'
const MAX_CONVERSATIONS = 50

function loadAll(): AIConversation[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(conversations: AIConversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.slice(0, MAX_CONVERSATIONS)))
  } catch {
    // localStorage full — silently fail
  }
}

export function useAIConversations(tool: AITool) {
  const [conversations, setConversations] = useState<AIConversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Load on mount
  useEffect(() => {
    const all = loadAll()
    setConversations(all.filter((c) => c.tool === tool))
  }, [tool])

  const createConversation = useCallback((): string => {
    const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const newConvo: AIConversation = {
      id,
      tool,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const all = loadAll()
    const updated = [newConvo, ...all]
    saveAll(updated)
    setConversations(updated.filter((c) => c.tool === tool))
    setActiveId(id)
    return id
  }, [tool])

  const updateConversation = useCallback((id: string, messages: AIMessage[]) => {
    const all = loadAll()
    const idx = all.findIndex((c) => c.id === id)
    if (idx === -1) return
    all[idx].messages = messages
    all[idx].updatedAt = new Date().toISOString()
    // Auto-title from first user message
    const firstUserMsg = messages.find((m) => m.role === 'user')
    if (firstUserMsg) {
      all[idx].title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '')
    }
    saveAll(all)
    setConversations(all.filter((c) => c.tool === tool))
  }, [tool])

  const deleteConversation = useCallback((id: string) => {
    const all = loadAll().filter((c) => c.id !== id)
    saveAll(all)
    setConversations(all.filter((c) => c.tool === tool))
    if (activeId === id) setActiveId(null)
  }, [tool, activeId])

  const getConversation = useCallback((id: string): AIConversation | undefined => {
    return loadAll().find((c) => c.id === id)
  }, [])

  return {
    conversations,
    activeId,
    setActiveId,
    createConversation,
    updateConversation,
    deleteConversation,
    getConversation,
  }
}
