import { auth, currentUser } from '@clerk/nextjs/server'
import { getProfile } from './queries'
import type { Profile } from '@/types/marketplace'

export async function getMarketplaceUser(): Promise<{ userId: string; profile: Profile | null } | null> {
  const { userId } = await auth()
  if (!userId) return null

  const profile = await getProfile(userId)
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
