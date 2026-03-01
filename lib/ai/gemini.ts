import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ChatMessage } from './router'

let _genAI: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (_genAI) return _genAI
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
  _genAI = new GoogleGenerativeAI(apiKey)
  return _genAI
}

export async function streamGemini(
  messages: ChatMessage[],
  maxTokens = 2048
): Promise<ReadableStream> {
  const genAI = getGenAI()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { maxOutputTokens: maxTokens },
  })

  // Convert ChatMessage[] to Gemini format
  // System messages become the first part of the conversation
  const systemParts: string[] = []
  const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
  let lastUserMessage = ''

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemParts.push(msg.content)
    } else if (msg.role === 'user') {
      lastUserMessage = msg.content
      history.push({ role: 'user', parts: [{ text: msg.content }] })
    } else if (msg.role === 'assistant') {
      history.push({ role: 'model', parts: [{ text: msg.content }] })
    }
  }

  // Remove last user message from history (it will be sent as the prompt)
  if (history.length > 0 && history[history.length - 1].role === 'user') {
    history.pop()
  }

  const chat = model.startChat({
    history,
    systemInstruction: systemParts.length > 0 ? systemParts.join('\n\n') : undefined,
  })

  const result = await chat.sendMessageStream(lastUserMessage || 'Hello')

  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })
}
