import { NextRequest, NextResponse } from 'next/server'
import { sendTestimonialEmail } from '@/lib/email'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { signTestimonialToken } from '@/lib/testimonial-token'
import { testimonialRatelimit, enforceRateLimit, getClientIp } from '@/lib/ratelimit'

const PROJECT_TYPES = ['ai-chatbot', 'model-training', 'web', 'mobile', 'design', 'other'] as const
type ProjectType = (typeof PROJECT_TYPES)[number]

interface SubmitPayload {
  name?: string
  email?: string
  role?: string
  project_type?: ProjectType
  rating?: number
  comment?: string
}

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(testimonialRatelimit, getClientIp(req))
  if (limited) return limited

  let body: SubmitPayload
  try {
    body = (await req.json()) as SubmitPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const role = typeof body.role === 'string' ? body.role.trim() : ''
  const projectType = body.project_type && PROJECT_TYPES.includes(body.project_type) ? body.project_type : null
  const rating = Math.round(Number(body.rating))
  const comment = typeof body.comment === 'string' ? body.comment.trim() : ''

  if (!name || name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: 'Please enter your name (2–80 chars)' }, { status: 400 })
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 })
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 })
  }
  if (!comment || comment.length < 20 || comment.length > 2000) {
    return NextResponse.json({ error: 'Review must be 20–2000 characters' }, { status: 400 })
  }

  let testimonialId: string | null = null
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('client_testimonials')
      .insert({
        name,
        email: email || null,
        role: role || null,
        project_type: projectType,
        rating,
        comment,
        status: 'pending',
      })
      .select('id')
      .single()
    if (error) {
      console.error('[testimonial submission] supabase insert failed:', error)
    } else {
      testimonialId = data.id as string
    }
  } catch (err) {
    console.error('[testimonial submission] supabase error:', err)
  }

  const canEmail = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)

  // Routine logging carries no personal data. The name, email and comment are
  // already in Supabase and already in the notification email; repeating them
  // here only copied them into the hosting provider's log retention, where
  // nobody reads them and nobody can delete one on request.
  //
  // This mattered more than it looks: the form that posts here used to live on
  // /home, which nothing linked to and the sitemap did not list. It is on
  // /contact now, so this path went from "reachable if you guess the URL" to
  // every visitor.
  console.log('[testimonial submission]', {
    id: testimonialId,
    projectType,
    rating,
    commentLength: comment.length,
  })

  // The one case where the log is the only copy: the insert failed and there is
  // no mailer configured, so nothing else recorded the submission. Losing a
  // real person's review is worse than the log entry, so it goes in - marked,
  // so it is clear this is a fallback and not routine.
  if (!testimonialId && !canEmail) {
    console.error(
      '[testimonial submission] NOT PERSISTED - no database row and no mailer. ' +
        'This log is the only copy:',
      { name, email, role, projectType, rating, comment }
    )
  }

  if (canEmail) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://orbitpk.com'
      let approveUrl: string | undefined
      let declineUrl: string | undefined
      if (testimonialId && process.env.TESTIMONIAL_SIGN_SECRET) {
        const approveToken = signTestimonialToken(testimonialId, 'approve')
        const declineToken = signTestimonialToken(testimonialId, 'decline')
        approveUrl = `${appUrl}/api/testimonials/${testimonialId}/approve?token=${approveToken}`
        declineUrl = `${appUrl}/api/testimonials/${testimonialId}/decline?token=${declineToken}`
      }
      await sendTestimonialEmail({
        name, email, role, projectType, rating, comment,
        approveUrl, declineUrl,
      })
    } catch (err) {
      console.error('[testimonial submission] email failed:', err)
    }
  } else {
    console.warn('[testimonial submission] EMAIL_USER or EMAIL_PASS not set - no notification sent')
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
