import { NextRequest, NextResponse } from 'next/server'
import { requireMarketplaceUser } from '@/lib/marketplace/auth'
import { sendMessage } from '@/lib/marketplace/mutations'
import type { MessageType } from '@/types/marketplace'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireMarketplaceUser()
    const body = await req.json()

    const { conversation_id, content, type, file_url, file_name, sender_name } = body

    if (!conversation_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const message = await sendMessage({
      conversation_id,
      sender_id: userId,
      sender_name: sender_name || 'User',
      content,
      type: (type || 'text') as MessageType,
      file_url: file_url || null,
      file_name: file_name || null,
    })

    return NextResponse.json(message, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 500 })
  }
}
