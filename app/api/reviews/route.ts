import { NextRequest, NextResponse } from 'next/server'
import { createReview, getSellerReviews } from '@/lib/firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sellerId = searchParams.get('sellerId')

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Missing required query param: sellerId' },
        { status: 400 },
      )
    }

    const reviews = await getSellerReviews(sellerId)
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('[REVIEWS_GET_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const id = await createReview(body)
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error('[REVIEWS_POST_ERROR]', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
