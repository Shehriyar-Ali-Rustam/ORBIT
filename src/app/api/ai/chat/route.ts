import { NextRequest } from 'next/server'
import { z } from 'zod'
import { streamAnthropic, isAnthropicConfigured, type ChatMessage } from '@/lib/ai/anthropic'
import { buildSystemPrompt, type PromptTool } from '@/lib/ai/prompts'
import { searchKnowledge } from '@/lib/ai/rag'
import {
  aiChatRatelimit,
  enforceRateLimit,
  enforceRateLimitStrict,
  getClientIp,
  orbieChatRatelimit,
} from '@/lib/ratelimit'
import { AI_ENABLED } from '@/lib/flags'
import { ORBIE_CHAT_ENABLED } from '@/lib/orbie-flags'

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(10000),
      })
    )
    .min(1)
    .max(50),
  tool: z.enum([
    'orbie', 'chat', 'code', 'write', 'translate', 'resume', 'freelance', 'image',
  ]),
})

/**
 * Orbie answers in a speech bubble, so it gets its own budget.
 *
 * 400 tokens is two or three sentences with room to spare; the identity
 * prompt asks for exactly that, and a cap makes it true rather than hoped for.
 *
 * Six messages of history, not the fifty the schema allows. A long tail is the
 * quiet cost driver on a conversational endpoint — every turn re-sends every
 * previous turn — and six is more than enough context for a site assistant.
 */
const ORBIE_MAX_TOKENS = 400
const ORBIE_HISTORY = 6

// Prompt injection patterns to guard against
const INJECTION_PATTERNS = [
  'ignore previous',
  'ignore all',
  'system prompt',
  'reveal your instructions',
  'forget your',
  'disregard all',
  'override your',
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = chatSchema.safeParse(body)

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages, tool } = parsed.data
    const isOrbie = tool === 'orbie'

    // ── Which flag gates what ──────────────────────────────────────────
    // Orbie is gated separately from the seven /ai tool pages on purpose.
    // AI_ENABLED turns those seven on, and they have a different product and
    // cost profile; Orbie going live must not drag them with it.
    if (isOrbie ? !ORBIE_CHAT_ENABLED : !AI_ENABLED) {
      return new Response(
        JSON.stringify({
          error: 'Chat is not available yet. Email info@orbitpk.com and a human will reply.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Orbie fails CLOSED. `enforceRateLimit` waves the request through when
    // Upstash is unconfigured, which is right for a contact form and wrong for
    // anything billed per call — an unset env var on a preview deploy would
    // otherwise be an LLM endpoint with no ceiling.
    const limited = isOrbie
      ? await enforceRateLimitStrict(orbieChatRatelimit, getClientIp(req))
      : await enforceRateLimit(aiChatRatelimit, getClientIp(req))
    if (limited) return limited

    // Prompt injection check
    const lastMessage = messages[messages.length - 1].content.toLowerCase()
    if (INJECTION_PATTERNS.some((p) => lastMessage.includes(p))) {
      return new Response(
        "I'm Orbit AI - here to help you with real tasks! What can I do for you?",
        { headers: { 'Content-Type': 'text/plain' } }
      )
    }

    // RAG search for context
    const ragContext = searchKnowledge(lastMessage)

    // Build system prompt
    const systemPrompt = buildSystemPrompt(tool as PromptTool, ragContext, '')

    // Every turn re-sends every previous turn, so an unbounded tail is the
    // quiet cost driver here. Orbie keeps the last six.
    const history = isOrbie ? messages.slice(-ORBIE_HISTORY) : messages

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    if (!isAnthropicConfigured()) {
      return Response.json(
        { error: 'Orbit AI is not configured right now.' },
        { status: 503 }
      )
    }

    const stream = await streamAnthropic(
      fullMessages,
      isOrbie ? ORBIE_MAX_TOKENS : tool === 'code' ? 4096 : 2048,
      tool === 'code' ? 0.3 : 0.7
    )

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    const message =
      error instanceof Error && error.message.includes('rate')
        ? "You've reached the rate limit. Try again in a moment!"
        : 'Orbit AI is taking a quick break. Try again in a moment.'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
