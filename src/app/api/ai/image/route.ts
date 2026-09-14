import { NextRequest } from 'next/server'
import { z } from 'zod'
import { streamAnthropic, isAnthropicConfigured, type ChatMessage } from '@/lib/ai/anthropic'
import { buildImageUrl } from '@/lib/ai/image'
import { aiImageRatelimit, enforceRateLimit, getClientIp } from '@/lib/ratelimit'

const imageSchema = z.object({
  prompt: z.string().min(1).max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const limited = await enforceRateLimit(aiImageRatelimit, getClientIp(req))
    if (limited) return limited

    const body = await req.json()
    const parsed = imageSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { prompt } = parsed.data

    // Use AI to enhance the prompt
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'You are an image prompt enhancer. Take the user\'s simple description and enhance it into a professional image generation prompt. Add style, lighting, quality, and composition details. Return ONLY the enhanced prompt text - nothing else. No explanations, no markdown, no quotes. Just the pure enhanced prompt.',
      },
      { role: 'user', content: prompt },
    ]

    if (!isAnthropicConfigured()) {
      return Response.json(
        { error: 'Image generation is not configured right now.' },
        { status: 503 }
      )
    }

    // Enhance the prompt, then collect the full stream — this one is not
    // streamed to the browser, it just feeds the image URL below.
    const stream = await streamAnthropic(messages, 300, 0.8)

    // Read the full stream to get the enhanced prompt
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let enhancedPrompt = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      enhancedPrompt += decoder.decode(value, { stream: true })
    }

    enhancedPrompt = enhancedPrompt.trim() || prompt
    const seed = Math.floor(Math.random() * 999999)
    const imageUrl = buildImageUrl(enhancedPrompt, { seed })

    return Response.json({
      imageUrl,
      enhancedPrompt,
      originalPrompt: prompt,
      seed,
    })
  } catch (error) {
    console.error('Image API error:', error)
    return Response.json(
      { error: 'Failed to generate image. Try again.' },
      { status: 500 }
    )
  }
}
