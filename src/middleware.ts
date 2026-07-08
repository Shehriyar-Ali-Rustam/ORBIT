import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { CLERK_ENABLED } from '@/lib/clerk-flag'

const isMarketplaceProtected = createRouteMatcher([
  '/freelancers/dashboard(.*)',
  '/freelancers/onboarding(.*)',
])

const protectedRegex = [/^\/freelancers\/dashboard(\/|$)/, /^\/freelancers\/onboarding(\/|$)/]

const clerkHandler = clerkMiddleware(async (auth, req: NextRequest) => {
  if (isMarketplaceProtected(req)) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/freelancers/sign-in', req.url))
    }
  }
  return NextResponse.next()
})

export default function middleware(req: NextRequest, event: Parameters<typeof clerkHandler>[1]) {
  if (CLERK_ENABLED) {
    return clerkHandler(req, event)
  }
  if (protectedRegex.some((re) => re.test(req.nextUrl.pathname))) {
    const url = req.nextUrl.clone()
    url.pathname = '/freelancers/sign-in'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
