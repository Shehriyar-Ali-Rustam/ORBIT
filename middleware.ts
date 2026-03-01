import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Marketplace routes protected by Clerk
const isMarketplaceProtected = createRouteMatcher([
  '/freelancers/dashboard(.*)',
  '/freelancers/onboarding(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Marketplace protected routes → Clerk handles auth
  if (isMarketplaceProtected(req)) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/freelancers/sign-in', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
