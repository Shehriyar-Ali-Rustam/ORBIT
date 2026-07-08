import { NextRequest } from 'next/server'

// Simple in-memory conversation storage (persists per server lifecycle).
// Scoped by sessionId header to prevent cross-user data access.
const MAX_CONVERSATIONS = 200
const conversations = new Map<
  string,
  { id: string; sessionId: string; title: string; tool: string; createdAt: string; messages: { role: string; content: string }[] }
>()

function getSessionId(req: NextRequest): string {
  return req.headers.get('x-session-id') || 'anonymous'
}

export async function GET(req: NextRequest) {
  const sessionId = getSessionId(req)
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversationId')

  if (conversationId) {
    const convo = conversations.get(conversationId)
    if (!convo || convo.sessionId !== sessionId) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json(convo)
  }

  // Return only this session's conversations (most recent first)
  const all = Array.from(conversations.values())
    .filter((c) => c.sessionId === sessionId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50)

  return Response.json(all)
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = getSessionId(req)
    const body = await req.json()
    const { id, title, tool, messages } = body

    if (!id || typeof id !== 'string') {
      return Response.json({ error: 'Missing or invalid id' }, { status: 400 })
    }

    const existing = conversations.get(id)
    if (existing) {
      if (existing.sessionId !== sessionId) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (title) existing.title = String(title).slice(0, 200)
      if (Array.isArray(messages)) existing.messages = messages.slice(-100)
    } else {
      // Enforce size cap — evict oldest when full
      if (conversations.size >= MAX_CONVERSATIONS) {
        const oldest = Array.from(conversations.entries())
          .sort(([, a], [, b]) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
        if (oldest) conversations.delete(oldest[0])
      }

      conversations.set(id, {
        id,
        sessionId,
        title: String(title || 'New Conversation').slice(0, 200),
        tool: String(tool || 'chat').slice(0, 50),
        createdAt: new Date().toISOString(),
        messages: Array.isArray(messages) ? messages.slice(-100) : [],
      })
    }

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const sessionId = getSessionId(req)
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversationId')

  if (!conversationId) return Response.json({ error: 'Missing conversationId' }, { status: 400 })

  const convo = conversations.get(conversationId)
  if (convo && convo.sessionId !== sessionId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  conversations.delete(conversationId)
  return Response.json({ success: true })
}
