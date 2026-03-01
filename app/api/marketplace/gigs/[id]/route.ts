import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { getGigById } from '@/lib/marketplace/queries'
import { updateGig, deleteGig } from '@/lib/marketplace/mutations'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gig = await getGigById(id)
  if (!gig) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(gig)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireMarketplaceUser()
    const { id } = await params

    const gig = await getGigById(id)
    if (!gig) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (gig.seller_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const updated = await updateGig(id, {
      title: body.title,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory,
      tags: body.tags,
      cover_image: body.cover_image,
      images: body.images,
      pricing: body.pricing,
      faq: body.faq,
      status: body.status,
    })

    return NextResponse.json(updated)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireMarketplaceUser()
    const { id } = await params

    const gig = await getGigById(id)
    if (!gig) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (gig.seller_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await deleteGig(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
