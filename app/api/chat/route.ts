import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ORBIT_SYSTEM_PROMPT } from '@/lib/chat-context'

interface ChatMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chat is currently unavailable. Please contact us at hello.theorbit@gmail.com.' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const { messages } = body as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const recentMessages = messages.slice(-20)

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: ORBIT_SYSTEM_PROMPT,
    })

    const chat = model.startChat({
      history: recentMessages.slice(0, -1),
    })

    const lastMessage = recentMessages[recentMessages.length - 1]
    const result = await chat.sendMessageStream(lastMessage.parts[0].text)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)

    const errorMessage =
      error instanceof Error && error.message.includes('API_KEY')
        ? 'Chat service configuration error. Please contact us directly.'
        : 'Something went wrong. Please try again or email us at hello.theorbit@gmail.com.'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
