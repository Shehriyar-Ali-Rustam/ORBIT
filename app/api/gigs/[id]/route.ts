import { NextRequest, NextResponse } from 'next/server'
import { getGig, updateGig, deleteGig } from '@/lib/firebase/firestore'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gig = await getGig(params.id)
    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }
    return NextResponse.json({ gig })
  } catch (error) {
    console.error('Failed to fetch gig:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gig' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    await updateGig(params.id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update gig:', error)
    return NextResponse.json(
      { error: 'Failed to update gig' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteGig(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete gig:', error)
    return NextResponse.json(
      { error: 'Failed to delete gig' },
      { status: 500 }
    )
  }
}
