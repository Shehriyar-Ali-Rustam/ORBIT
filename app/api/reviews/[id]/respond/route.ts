import { NextRequest, NextResponse } from 'next/server'
import { updateReview } from '@/lib/firebase/firestore'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { sellerResponse } = await req.json()

    if (!sellerResponse || typeof sellerResponse !== 'string') {
      return NextResponse.json(
        { error: 'sellerResponse is required' },
        { status: 400 },
      )
    }

    await updateReview(params.id, { sellerResponse })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[REVIEW_RESPOND_ERROR]', error)
    return NextResponse.json({ error: 'Failed to respond to review' }, { status: 500 })
  }
}
