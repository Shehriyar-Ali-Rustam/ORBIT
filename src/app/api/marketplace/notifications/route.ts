import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { markNotificationRead, markAllNotificationsRead } from '@/lib/marketplace/mutations'
import { getSupabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    const { userId } = await requireMarketplaceUser()
    const supabase = getSupabase()

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json(data || [])
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await requireMarketplaceUser()
    const body = await req.json()

    if (body.mark_all_read) {
      await markAllNotificationsRead(userId)
    } else if (body.notification_id) {
      await markNotificationRead(body.notification_id, userId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
