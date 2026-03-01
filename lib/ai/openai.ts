import OpenAI from 'openai'
import type { ChatMessage } from './router'

let _openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (_openai) return _openai
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')
  _openai = new OpenAI({ apiKey })
  return _openai
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

export async function streamOpenAI(
  messages: ChatMessage[],
  maxTokens = 2048,
  temperature = 0.7
): Promise<ReadableStream> {
  const openai = getOpenAI()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: maxTokens,
    temperature,
    stream: true,
  })

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })
}
