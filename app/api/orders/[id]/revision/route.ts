import { NextRequest, NextResponse } from 'next/server'
import { updateOrder } from '@/lib/firebase/firestore'
import { increment } from 'firebase/firestore'

interface RevisionRequestBody {
  message: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const body: RevisionRequestBody = await req.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid message' },
        { status: 400 },
      )
    }

    await updateOrder(id, {
      status: 'revision_requested',
      revisionCount: increment(1),
      revisionMessage: body.message,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ORDER_REVISION_ERROR]', error)
    return NextResponse.json({ error: 'Failed to request revision' }, { status: 500 })
  }
}
