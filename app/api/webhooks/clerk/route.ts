import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!SIGNING_SECRET) {
    // In development without webhook secret, skip verification but log warning
    console.warn('[Clerk Webhook] CLERK_WEBHOOK_SECRET not set — skipping signature verification')
  }

  const body = await req.text()
  const headersList = await headers()

  // Verify webhook signature if secret is configured
  let evt: { type: string; data: Record<string, unknown> }

  if (SIGNING_SECRET) {
    const svixId = headersList.get('svix-id')
    const svixTimestamp = headersList.get('svix-timestamp')
    const svixSignature = headersList.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing svix headers', { status: 400 })
    }

    const wh = new Webhook(SIGNING_SECRET)
    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as { type: string; data: Record<string, unknown> }
    } catch (err) {
      console.error('[Clerk Webhook] Signature verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }
  } else {
    try {
      evt = JSON.parse(body)
    } catch {
      return new Response('Invalid JSON', { status: 400 })
    }
  }

  const { type, data } = evt
  const supabase = getSupabaseAdmin()

  if (type === 'user.created') {
    const emailAddresses = data.email_addresses as { email_address: string }[]
    const email = emailAddresses?.[0]?.email_address || ''
    const firstName = (data.first_name as string) || ''
    const lastName = (data.last_name as string) || ''
    const displayName = `${firstName} ${lastName}`.trim() || 'User'
    const photoUrl = (data.image_url as string) || null

    await supabase.from('profiles').upsert({
      id: data.id as string,
      email,
      display_name: displayName,
      photo_url: photoUrl,
      role: 'buyer',
    })
  }

  if (type === 'user.updated') {
    const emailAddresses = data.email_addresses as { email_address: string }[]
    const email = emailAddresses?.[0]?.email_address || ''
    const firstName = (data.first_name as string) || ''
    const lastName = (data.last_name as string) || ''
    const displayName = `${firstName} ${lastName}`.trim() || 'User'
    const photoUrl = (data.image_url as string) || null

    await supabase
      .from('profiles')
      .update({
        email,
        display_name: displayName,
        photo_url: photoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id as string)
  }

  if (type === 'user.deleted') {
    await supabase
      .from('profiles')
      .delete()
      .eq('id', data.id as string)
  }

  return new Response('OK', { status: 200 })
}
