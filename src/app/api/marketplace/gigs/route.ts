import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { searchGigs } from '@/lib/marketplace/queries'
import { createGig } from '@/lib/marketplace/mutations'
import type { GigCategory } from '@/types/marketplace'

const createGigSchema = z.object({
  title: z.string().min(10).max(120),
  description: z.string().min(50).max(5000),
  category: z.enum(['ai', 'web', 'mobile', 'design', 'marketing', 'other']),
  subcategory: z.string().min(2).max(50),
  tags: z.array(z.string()).default([]),
  cover_image: z.string().url().nullable().optional(),
  images: z.array(z.string().url()).default([]),
  pricing: z.record(z.string(), z.object({
    title: z.string(),
    description: z.string(),
    price: z.number().min(5).max(50000),
    delivery_days: z.number().min(1).max(365),
    revisions: z.number().min(0).max(100),
    features: z.array(z.string()),
  })),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  status: z.enum(['draft', 'active', 'paused']).default('active'),
})

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const filters = {
    query: params.get('q') || undefined,
    category: (params.get('category') as GigCategory) || undefined,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    minRating: params.get('minRating') ? Number(params.get('minRating')) : undefined,
    sortBy: (params.get('sortBy') as 'relevant' | 'newest' | 'rating' | 'price_low' | 'price_high') || undefined,
    page: params.get('page') ? Number(params.get('page')) : 1,
    limit: Math.min(Number(params.get('limit')) || 20, 100),
  }

  const result = await searchGigs(filters)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireMarketplaceUser()
    const body = await req.json()

    const parsed = createGigSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) + '-' + Date.now().toString(36)

    const gig = await createGig({
      seller_id: userId,
      title: data.title,
      slug,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      tags: data.tags,
      cover_image: data.cover_image || null,
      images: data.images,
      pricing: data.pricing,
      faq: data.faq,
      status: data.status,
    })

    return NextResponse.json(gig, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
