import { streamGroq } from './groq'
import { streamGemini } from './gemini'
import { streamOpenAI, isOpenAIConfigured } from './openai'
import { streamAnthropic, isAnthropicConfigured, ANTHROPIC_MODEL } from './anthropic'

export type AIProvider = 'anthropic' | 'groq' | 'gemini' | 'openai'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface RouterResponse {
  stream: ReadableStream
  provider: AIProvider
  model: string
}

interface RouteOptions {
  messages: ChatMessage[]
  maxTokens?: number
  temperature?: number
}

/**
 * Smart AI router with automatic fallback.
 * Groq (fastest, free) → Gemini (backup) → OpenAI (paid, if configured)
 */
export async function routeToAI(options: RouteOptions): Promise<RouterResponse> {
  const { messages, maxTokens = 2048, temperature = 0.7 } = options
  const preferred = (process.env.AI_PROVIDER || 'anthropic') as AIProvider

  const order: Record<AIProvider, AIProvider[]> = {
    anthropic: ['anthropic', 'groq', 'gemini', 'openai'],
    groq: ['groq', 'anthropic', 'gemini', 'openai'],
    gemini: ['gemini', 'anthropic', 'groq', 'openai'],
    openai: ['openai', 'anthropic', 'groq', 'gemini'],
  }
  const providers = order[preferred] ?? order.anthropic

  let lastError: Error | null = null

  for (const provider of providers) {
    try {
      switch (provider) {
        case 'anthropic': {
          if (!isAnthropicConfigured()) continue
          const stream = await streamAnthropic(messages, maxTokens)
          return { stream, provider: 'anthropic', model: ANTHROPIC_MODEL }
        }
        case 'groq': {
          if (!process.env.GROQ_API_KEY) continue
          const stream = await streamGroq(messages, maxTokens, temperature)
          return { stream, provider: 'groq', model: 'llama-3.3-70b-versatile' }
        }
        case 'gemini': {
          if (!process.env.GEMINI_API_KEY) continue
          const stream = await streamGemini(messages, maxTokens)
          return { stream, provider: 'gemini', model: 'gemini-2.0-flash' }
        }
        case 'openai': {
          if (!isOpenAIConfigured()) continue
          const stream = await streamOpenAI(messages, maxTokens, temperature)
          return { stream, provider: 'openai', model: 'gpt-4o-mini' }
        }
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      const statusCode = (err as { status?: number }).status
      // Only fallback on rate limit (429) or server errors (5xx)
      if (statusCode && statusCode !== 429 && statusCode < 500) {
        throw err
      }
      // Continue to next provider
    }
  }

  throw lastError || new Error('No AI provider is configured. Add ANTHROPIC_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY to .env.local')
}
