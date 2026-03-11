import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { getGigById } from '@/lib/marketplace/queries'
import { updateGig, deleteGig } from '@/lib/marketplace/mutations'
import type { GigCategory } from '@/types/marketplace'

const GIG_CATEGORIES: [GigCategory, ...GigCategory[]] = ['ai', 'web', 'mobile', 'design', 'marketing', 'other']

const tierPricingSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(500),
  price: z.number().min(1).max(50000),
  delivery_days: z.number().int().min(1).max(365),
  revisions: z.number().int().min(0).max(100),
  features: z.array(z.string().max(200)).max(20),
})

// H4: Zod schema for gig updates
const gigUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  category: z.enum(GIG_CATEGORIES).optional(),
  subcategory: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  cover_image: z.string().url().max(2000).optional().nullable(),
  images: z.array(z.string().url().max(2000)).max(10).optional(),
  pricing: z.object({
    basic: tierPricingSchema,
    standard: tierPricingSchema,
    premium: tierPricingSchema,
  }).optional(),
  faq: z.array(z.object({
    question: z.string().max(500),
    answer: z.string().max(2000),
  })).max(20).optional(),
  status: z.enum(['active', 'paused', 'draft']).optional(),
})

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
    const parsed = gigUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const updated = await updateGig(id, parsed.data)

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
