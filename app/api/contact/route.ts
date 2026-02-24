import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { sendContactEmail } from '@/lib/email'

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

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing EMAIL_USER or EMAIL_PASS environment variables')
      return NextResponse.json(
        { error: 'Email service is not configured. Please email us directly at hello.theorbit@gmail.com' },
        { status: 503 }
      )
    }

    await sendContactEmail(result.data)

    return NextResponse.json(
      { success: true, message: 'Message received! We will reply within 24 hours.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or email us directly at hello.theorbit@gmail.com' },
      { status: 500 }
    )
  }
}
