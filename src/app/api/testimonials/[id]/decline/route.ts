import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { verifyTestimonialToken } from '@/lib/testimonial-token'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://orbitpk.com'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const token = req.nextUrl.searchParams.get('token') || ''

  try {
    if (!verifyTestimonialToken(id, 'decline', token)) {
      return NextResponse.redirect(`${APP_URL}/testimonials/thanks?status=invalid`)
    }
  } catch {
    return NextResponse.redirect(`${APP_URL}/testimonials/thanks?status=invalid`)
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data: existing } = await supabase
      .from('client_testimonials')
      .select('status, name')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.redirect(`${APP_URL}/testimonials/thanks?status=notfound`)
    }
    if (existing.status === 'approved') {
      return NextResponse.redirect(`${APP_URL}/testimonials/thanks?status=already-approved&name=${encodeURIComponent(existing.name)}`)
    }
    if (existing.status === 'rejected') {
      return NextResponse.redirect(`${APP_URL}/testimonials/thanks?status=already-rejected&name=${encodeURIComponent(existing.name)}`)
    }

    await supabase
      .from('client_testimonials')
      .update({ status: 'rejected', decided_at: new Date().toISOString() })
      .eq('id', id)

    return NextResponse.redirect(`${APP_URL}/testimonials/thanks?status=rejected&name=${encodeURIComponent(existing.name)}`)
  } catch (err) {
    console.error('[decline testimonial] error:', err)
    return NextResponse.redirect(`${APP_URL}/testimonials/thanks?status=error`)
  }
}
