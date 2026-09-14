import Anthropic from '@anthropic-ai/sdk'
import { ANTHROPIC_MODEL } from './model'

/** The shape both AI routes speak. Lived in `router.ts` until the router
 *  turned out to be routing to one place. */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

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

export async function streamAnthropic(
  messages: ChatMessage[],
  maxTokens = 2048,
  temperature?: number
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

  // ── On the missing cache_control ────────────────────────────────────
  // There was a `cache_control: { type: 'ephemeral' }` here. It did nothing,
  // for two compounding reasons, and it is removed rather than "fixed".
  //
  // First, caching is a prefix match, and `buildSystemPrompt` assembles
  // IDENTITY -> ragContext -> toolPrompt. The RAG context is recomputed from
  // the visitor's message on every request and sits in the middle of the
  // block, so the cached prefix was invalidated every single time.
  //
  // Second, and decisively: the block is too short to cache at all. Measured
  // BASE_IDENTITY at ~2.9 KB and the tool prompts at 0.6-1.2 KB, which puts
  // every tool's system block at roughly 870-1020 tokens. Sonnet's minimum
  // cacheable prefix is 1024. Below that the breakpoint is ignored outright,
  // so reordering the parts would not have helped either.
  //
  // Worth revisiting when a prompt actually grows past the minimum — Orbie's
  // will have its own identity and tool prompt. Measure with count_tokens
  // before adding it back; the estimate above is characters/4, not a real
  // tokenization, and the margin here is thin enough that the distinction
  // matters.
  const stream = client.messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    // Both callers have always passed this. The router accepted it and then
    // handed it to a function that had no parameter for it, so the code tool
    // has been running at the default 1.0 rather than the 0.3 it asks for.
    ...(temperature !== undefined && { temperature }),
    ...(systemText && { system: systemText }),
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
