import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function buildLimiter(prefix: string, max: number, window: `${number} ${'s' | 'm' | 'h' | 'd'}`) {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, window),
    analytics: true,
    prefix,
  })
}

/**
 * Public form limits (per-IP). Contact form and review form: 3 per 10 min.
 */
export const contactRatelimit = buildLimiter('orbit:contact', 3, '10 m')
export const testimonialRatelimit = buildLimiter('orbit:testimonial', 3, '10 m')

/**
 * AI endpoint limits (per-IP). Chatbot + image generation: 30 per hour to
 * cap cost from bots while staying generous for a real conversation.
 */
export const aiChatRatelimit = buildLimiter('orbit:ai-chat', 30, '1 h')
export const aiImageRatelimit = buildLimiter('orbit:ai-image', 10, '1 h')

/**
 * Legacy alias.
 */
export const freelancerRatelimit = buildLimiter('orbit:freelancer', 2, '1 h')

/**
 * Extract the client IP from Vercel edge headers with sensible fallbacks.
 * Handles x-forwarded-for chains (first entry is client-facing).
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') || '127.0.0.1'
}

/**
 * Apply a limiter and return a 429 response if the caller is over quota.
 * Returns `null` when the request is allowed (so the handler can proceed).
 * When Redis env vars are absent (dev / preview without Upstash), the
 * limiter is null and this function no-ops - fail open, not closed, so a
 * missing side-channel doesn't take the whole site offline.
 */
export async function enforceRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<NextResponse | null> {
  if (!limiter) return null
  const result = await limiter.limit(identifier)
  if (result.success) return null

  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
  return NextResponse.json(
    { error: 'Too many requests. Please try again in a moment.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    },
  )
}
