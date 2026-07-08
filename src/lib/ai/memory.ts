import type { ChatMessage } from './router'

/**
 * Client-side session key for localStorage.
 */
export const SESSION_KEY = 'orbit_ai_session'

export interface AISession {
  userName?: string
  preferredLanguage?: string
  recentTools: string[]
}

/**
 * Get stored session data (client-side only).
 */
export function getSession(): AISession {
  if (typeof window === 'undefined') return { recentTools: [] }
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return { recentTools: [] }
    return JSON.parse(raw) as AISession
  } catch {
    return { recentTools: [] }
  }
}

/**
 * Save session data to localStorage.
 */
export function saveSession(session: Partial<AISession>): void {
  if (typeof window === 'undefined') return
  try {
    const existing = getSession()
    const merged = { ...existing, ...session }
    localStorage.setItem(SESSION_KEY, JSON.stringify(merged))
  } catch {
    // Ignore storage errors
  }
}

/**
 * Build memory context string from conversation history.
 * Takes last N messages and summarizes them for context injection.
 */
export function buildMemoryContext(history: ChatMessage[], limit = 6): string {
  if (history.length === 0) return ''

  const recent = history.slice(-limit)
  const summary = recent
    .map((msg) => {
      const role = msg.role === 'user' ? 'User' : 'Assistant'
      const content =
        msg.content.length > 200
          ? msg.content.substring(0, 200) + '...'
          : msg.content
      return `${role}: ${content}`
    })
    .join('\n')

  return `This is a continuing conversation. Previous context:\n${summary}`
}

/**
 * Generate a conversation title from the first message.
 */
export function generateTitle(firstMessage: string): string {
  const cleaned = firstMessage.replace(/\n/g, ' ').trim()
  if (cleaned.length <= 50) return cleaned
  return cleaned.substring(0, 47) + '...'
}
