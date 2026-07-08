import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage } from './router'

const MODEL = 'claude-sonnet-4-6'

let _anthropic: Anthropic | null = null

function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')
  _anthropic = new Anthropic({ apiKey })
  return _anthropic
}

export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

export const ANTHROPIC_MODEL = MODEL

export async function streamAnthropic(
  messages: ChatMessage[],
  maxTokens = 2048
): Promise<ReadableStream> {
  const client = getAnthropic()

  const systemText = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n')

  const conversation = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: maxTokens,
    ...(systemText && {
      system: [
        {
          type: 'text' as const,
          text: systemText,
          cache_control: { type: 'ephemeral' as const },
        },
      ],
    }),
    messages: conversation,
  })

  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })
}
