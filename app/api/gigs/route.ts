import { NextRequest, NextResponse } from 'next/server'
import { getActiveGigs } from '@/lib/firebase/firestore'
import type { GigCategory } from '@/types/marketplace'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') as GigCategory | null
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 20

    const gigs = await getActiveGigs({
      category: category || undefined,
      limit,
    })

    return NextResponse.json({ gigs })
  } catch (error) {
    console.error('Failed to fetch gigs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gigs' },
      { status: 500 }
    )
  }
}
