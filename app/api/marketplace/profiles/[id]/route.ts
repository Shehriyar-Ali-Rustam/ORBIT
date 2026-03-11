import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { getProfile } from '@/lib/marketplace/queries'
import { updateProfile } from '@/lib/marketplace/mutations'

// H5: Zod schema for profile updates — excludes role, rating, review_count
const profileUpdateSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  bio: z.string().max(3000).optional(),
  skills: z.array(z.string().max(50)).max(30).optional(),
  languages: z.array(z.object({ language: z.string().max(50), level: z.string().max(50) })).max(10).optional(),
  hourly_rate: z.number().min(0).max(10000).optional().nullable(),
  response_time: z.string().max(50).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  portfolio_urls: z.array(z.string().url().max(2000)).max(10).optional(),
  github: z.string().max(200).optional().nullable(),
  linkedin: z.string().max(200).optional().nullable(),
  fiverr: z.string().max(200).optional().nullable(),
  photo_url: z.string().url().max(2000).optional().nullable(),
  available: z.boolean().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile(id)
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(profile)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireMarketplaceUser()
    const { id } = await params

    if (id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const parsed = profileUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const updated = await updateProfile(id, parsed.data)

    return NextResponse.json(updated)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
