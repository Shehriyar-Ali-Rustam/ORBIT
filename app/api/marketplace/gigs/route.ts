import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { searchGigs } from '@/lib/marketplace/queries'
import { createGig } from '@/lib/marketplace/mutations'
import type { GigCategory } from '@/types/marketplace'

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
    limit: params.get('limit') ? Number(params.get('limit')) : 20,
  }

  const result = await searchGigs(filters)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireMarketplaceUser()
    const body = await req.json()

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) + '-' + Date.now().toString(36)

    const gig = await createGig({
      seller_id: userId,
      title: body.title,
      slug,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory,
      tags: body.tags || [],
      cover_image: body.cover_image || null,
      images: body.images || [],
      pricing: body.pricing,
      faq: body.faq || [],
      status: body.status || 'active',
    })

    return NextResponse.json(gig, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
