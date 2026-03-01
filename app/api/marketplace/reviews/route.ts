import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { getOrder } from '@/lib/marketplace/queries'
import { createReview } from '@/lib/marketplace/mutations'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireMarketplaceUser()
    const body = await req.json()

    const { order_id, rating, comment } = body
    if (!order_id || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const order = await getOrder(order_id)
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.buyer_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (order.status !== 'completed') {
      return NextResponse.json({ error: 'Order must be completed to review' }, { status: 400 })
    }

    const review = await createReview({
      order_id,
      gig_id: order.gig_id,
      seller_id: order.seller_id,
      buyer_id: userId,
      rating: Number(rating),
      comment,
      seller_response: null,
    })

    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
