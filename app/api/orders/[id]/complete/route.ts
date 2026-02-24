import { NextRequest, NextResponse } from 'next/server'
import { updateOrder } from '@/lib/firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    await updateOrder(id, {
      status: 'completed',
      completedAt: serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ORDER_COMPLETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to complete order' }, { status: 500 })
  }
}
