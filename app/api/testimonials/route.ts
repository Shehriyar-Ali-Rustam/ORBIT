import { NextRequest, NextResponse } from 'next/server'

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

  // TODO(supabase): insert into `client_testimonials` once table is created.
  //   await getSupabase().from('client_testimonials').insert({
  //     name, email: email || null, role: role || null,
  //     project_type: projectType, rating, comment, status: 'pending',
  //   })
  console.log('[testimonial submission]', { name, email, role, projectType, rating, commentLength: comment.length })

  return NextResponse.json({ ok: true }, { status: 201 })
}
