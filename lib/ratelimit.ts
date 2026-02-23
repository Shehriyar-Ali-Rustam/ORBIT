import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const contactRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '10 m'),
  analytics: true,
  prefix: 'orbit:contact',
})

export const freelancerRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '1 h'),
  analytics: true,
  prefix: 'orbit:freelancer',
})
