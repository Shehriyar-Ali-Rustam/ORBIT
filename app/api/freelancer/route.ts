import { NextRequest, NextResponse } from 'next/server'
import { freelancerApplySchema } from '@/lib/validations'
import { sendFreelancerApplyEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = freelancerApplySchema.safeParse(body)

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

    await sendFreelancerApplyEmail(result.data as unknown as Record<string, string>)

    return NextResponse.json(
      { success: true, message: 'Application received! We will review within 48 hours.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Freelancer apply error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or email us directly at hello.theorbit@gmail.com' },
      { status: 500 }
    )
  }
}
