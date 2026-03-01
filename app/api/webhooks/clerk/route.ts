import { getSupabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()

  // If svix is not installed, just parse the JSON directly
  // For production, install svix and verify the webhook signature
  let evt: { type: string; data: Record<string, unknown> }

  try {
    evt = JSON.parse(body)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
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
