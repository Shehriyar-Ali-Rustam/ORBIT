import { auth, currentUser } from '@clerk/nextjs/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { getProfile } from './queries'
import type { Profile } from '@/types/marketplace'

export async function getMarketplaceUser(): Promise<{ userId: string; profile: Profile | null } | null> {
  const { userId } = await auth()
  if (!userId) return null

  let profile = await getProfile(userId)

  if (!profile) {
    profile = await createProfileFromClerk(userId)
  }

  return { userId, profile }
}

export async function requireMarketplaceUser(): Promise<{ userId: string; profile: Profile | null }> {
  const user = await getMarketplaceUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function getClerkUser() {
  return await currentUser()
}

async function createProfileFromClerk(userId: string): Promise<Profile | null> {
  const clerkUser = await currentUser()
  if (!clerkUser || clerkUser.id !== userId) return null

  const email = clerkUser.emailAddresses[0]?.emailAddress || ''
  const firstName = clerkUser.firstName || ''
  const lastName = clerkUser.lastName || ''
  const displayName = `${firstName} ${lastName}`.trim() || 'User'
  const photoUrl = clerkUser.imageUrl || null

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email,
      display_name: displayName,
      photo_url: photoUrl,
      role: 'buyer',
    })
    .select()
    .single()

  if (error) {
    console.error('[auth] Failed to create profile from Clerk user:', error)
    return null
  }

  return data as Profile
}
