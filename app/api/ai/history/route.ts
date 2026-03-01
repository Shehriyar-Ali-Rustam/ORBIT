import { NextRequest } from 'next/server'

// Simple in-memory conversation storage (persists per server lifecycle).
// For production, replace with Supabase or another database.
const conversations = new Map<
  string,
  { id: string; title: string; tool: string; createdAt: string; messages: { role: string; content: string }[] }
>()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversationId')

  if (conversationId) {
    const convo = conversations.get(conversationId)
    if (!convo) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(convo)
  }

  // Return all conversations (most recent first)
  const all = Array.from(conversations.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50)

  return Response.json(all)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, title, tool, messages } = body

    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

    const existing = conversations.get(id)
    if (existing) {
      if (title) existing.title = title
      if (messages) existing.messages = messages
    } else {
      conversations.set(id, {
        id,
        title: title || 'New Conversation',
        tool: tool || 'chat',
        createdAt: new Date().toISOString(),
        messages: messages || [],
      })
    }

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversationId')

  if (!conversationId) return Response.json({ error: 'Missing conversationId' }, { status: 400 })

  conversations.delete(conversationId)
  return Response.json({ success: true })
}
