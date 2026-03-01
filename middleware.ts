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

  // Legacy Firebase auth pages (login/register) — keep existing behavior
  const token = req.cookies.get('firebase-auth-token')?.value
  if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/', req.url))
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
