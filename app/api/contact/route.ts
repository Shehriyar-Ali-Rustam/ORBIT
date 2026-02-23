import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.flatten() },
        { status: 400 }
      )
    }

    // In production, uncomment rate limiting and email sending:
    // import { contactRatelimit } from '@/lib/ratelimit'
    // import { sendContactEmail } from '@/lib/email'
    // const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous'
    // const { success } = await contactRatelimit.limit(ip)
    // if (!success) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    // await sendContactEmail(result.data)

    return NextResponse.json(
      { success: true, message: 'Message received! We will reply within 24 hours.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or email us directly.' },
      { status: 500 }
    )
  }
}
