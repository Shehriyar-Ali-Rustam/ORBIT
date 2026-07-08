import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { findConversation, getUserConversations, getProfile } from '@/lib/marketplace/queries'
import { createConversation } from '@/lib/marketplace/mutations'

export async function GET() {
  try {
    const { userId } = await requireMarketplaceUser()
    const conversations = await getUserConversations(userId)
    return NextResponse.json(conversations)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, profile } = await requireMarketplaceUser()
    const body = await req.json()
    const { other_user_id, related_gig_id, related_order_id } = body

    if (!other_user_id) {
      return NextResponse.json({ error: 'other_user_id is required' }, { status: 400 })
    }

    // Check if conversation already exists
    const existing = await findConversation(userId, other_user_id)
    if (existing) return NextResponse.json(existing)

    // Get other user profile
    const otherProfile = await getProfile(other_user_id)
    const otherName = otherProfile?.display_name || 'User'
    const myName = profile?.display_name || 'User'

    const conversation = await createConversation({
      participants: [userId, other_user_id],
      participant_names: { [userId]: myName, [other_user_id]: otherName },
      participant_photos: {
        [userId]: profile?.photo_url || null,
        [other_user_id]: otherProfile?.photo_url || null,
      },
      last_message: null,
      last_message_at: new Date().toISOString(),
      last_message_by: null,
      unread_count: { [userId]: 0, [other_user_id]: 0 },
      related_gig_id: related_gig_id || null,
      related_order_id: related_order_id || null,
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
