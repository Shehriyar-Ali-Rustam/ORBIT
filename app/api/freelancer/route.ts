import { NextRequest, NextResponse } from 'next/server'
import { freelancerApplySchema } from '@/lib/validations'

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

    // In production, uncomment rate limiting and email sending:
    // import { freelancerRatelimit } from '@/lib/ratelimit'
    // import { sendFreelancerApplyEmail } from '@/lib/email'
    // const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous'
    // const { success } = await freelancerRatelimit.limit(ip)
    // if (!success) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    // await sendFreelancerApplyEmail(result.data as unknown as Record<string, string>)

    return NextResponse.json(
      { success: true, message: 'Application received! We will review within 48 hours.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Freelancer apply error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
