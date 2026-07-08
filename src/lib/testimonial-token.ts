import crypto from 'crypto'

export type TestimonialAction = 'approve' | 'decline'

function getSecret(): string {
  const secret = process.env.TESTIMONIAL_SIGN_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('TESTIMONIAL_SIGN_SECRET must be set to a value of at least 16 characters')
  }
  return secret
}

export function signTestimonialToken(id: string, action: TestimonialAction): string {
  const payload = `${id}:${action}`
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function verifyTestimonialToken(id: string, action: TestimonialAction, token: string): boolean {
  if (!token || token.length !== 64) return false
  const expected = signTestimonialToken(id, action)
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(token, 'hex'))
}
