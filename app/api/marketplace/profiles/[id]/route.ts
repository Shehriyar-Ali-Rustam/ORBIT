import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { getProfile } from '@/lib/marketplace/queries'
import { updateProfile } from '@/lib/marketplace/mutations'

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
    const updated = await updateProfile(id, {
      display_name: body.display_name,
      tagline: body.tagline,
      bio: body.bio,
      skills: body.skills,
      languages: body.languages,
      hourly_rate: body.hourly_rate,
      response_time: body.response_time,
      country: body.country,
      portfolio_urls: body.portfolio_urls,
      github: body.github,
      linkedin: body.linkedin,
      fiverr: body.fiverr,
      photo_url: body.photo_url,
      available: body.available,
    })

    return NextResponse.json(updated)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
