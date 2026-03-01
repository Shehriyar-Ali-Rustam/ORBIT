import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { getOrder } from '@/lib/marketplace/queries'
import { updateOrderStatus } from '@/lib/marketplace/mutations'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireMarketplaceUser()
    const { id } = await params

    const order = await getOrder(id)
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (order.buyer_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (order.status !== 'delivered') {
      return NextResponse.json({ error: 'Order must be delivered before completing' }, { status: 400 })
    }

    await updateOrderStatus(id, 'completed')

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
