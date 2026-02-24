import { NextRequest, NextResponse } from 'next/server'
import { updateOrder } from '@/lib/firebase/firestore'

interface DeliverRequestBody {
  deliverables: { url: string; name: string }[]
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const body: DeliverRequestBody = await req.json()

    if (!body.deliverables || !Array.isArray(body.deliverables)) {
      return NextResponse.json(
        { error: 'Missing or invalid deliverables array' },
        { status: 400 },
      )
    }

    await updateOrder(id, {
      deliverables: body.deliverables,
      status: 'delivered',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ORDER_DELIVER_ERROR]', error)
    return NextResponse.json({ error: 'Failed to deliver order' }, { status: 500 })
  }
}
