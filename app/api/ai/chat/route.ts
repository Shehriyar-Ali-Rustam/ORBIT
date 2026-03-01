import { NextRequest } from 'next/server'
import { z } from 'zod'
import { routeToAI, type ChatMessage } from '@/lib/ai/router'
import { buildSystemPrompt, type AITool } from '@/lib/ai/prompts'
import { searchKnowledge } from '@/lib/ai/rag'

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
    'chat', 'code', 'write', 'translate', 'resume', 'freelance', 'image',
  ]),
})

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

    // Prompt injection check
    const lastMessage = messages[messages.length - 1].content.toLowerCase()
    if (INJECTION_PATTERNS.some((p) => lastMessage.includes(p))) {
      return new Response(
        "I'm Orbit AI — here to help you with real tasks! What can I do for you?",
        { headers: { 'Content-Type': 'text/plain' } }
      )
    }

    // RAG search for context
    const ragContext = searchKnowledge(lastMessage)

    // Build system prompt
    const systemPrompt = buildSystemPrompt(tool as AITool, ragContext, '')

    // Build full messages array
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    // Route to AI provider with fallback
    const { stream } = await routeToAI({
      messages: fullMessages,
      maxTokens: tool === 'code' ? 4096 : 2048,
      temperature: tool === 'code' ? 0.3 : 0.7,
    })

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
