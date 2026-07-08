import Groq from 'groq-sdk'
import type { ChatMessage } from './router'

let _groq: Groq | null = null

function getGroq(): Groq {
  if (_groq) return _groq
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not set')
  _groq = new Groq({ apiKey })
  return _groq
}

export async function streamGroq(
  messages: ChatMessage[],
  maxTokens = 2048,
  temperature = 0.7
): Promise<ReadableStream> {
  const groq = getGroq()

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
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
