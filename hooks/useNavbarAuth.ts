'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { CLERK_ENABLED } from '@/lib/clerk-flag'

type SignOutOptions = { redirectUrl?: string }
type AuthState = {
  user: ReturnType<typeof useUser>['user']
  isLoaded: boolean
  isSignedIn: boolean
  signOut: (opts?: SignOutOptions) => Promise<void>
}

const STUB: AuthState = {
  user: null,
  isLoaded: true,
  isSignedIn: false,
  signOut: async () => {},
}

export function useNavbarAuth(): AuthState {
  // CLERK_ENABLED is a build-time constant (inlined from NEXT_PUBLIC_*),
  // so the conditional hook call collapses to a single branch per build.
  if (!CLERK_ENABLED) return STUB
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const u = useUser()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const c = useClerk()
  return {
    user: u.user,
    isLoaded: u.isLoaded,
    isSignedIn: u.isSignedIn ?? false,
    signOut: c.signOut,
  }
}
