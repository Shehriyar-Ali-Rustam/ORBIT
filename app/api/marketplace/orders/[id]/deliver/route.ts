import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { getOrder } from '@/lib/marketplace/queries'
import { updateOrder, updateOrderStatus } from '@/lib/marketplace/mutations'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await requireMarketplaceUser()
    const { id } = await params

    const order = await getOrder(id)
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (order.seller_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (!['active', 'in_progress', 'revision_requested'].includes(order.status)) {
      return NextResponse.json({ error: 'Cannot deliver in current status' }, { status: 400 })
    }

    const body = await req.json()
    const deliverables = [...(order.deliverables || []), ...(body.deliverables || [])]

    await updateOrder(id, { deliverables })
    await updateOrderStatus(id, 'delivered')

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
