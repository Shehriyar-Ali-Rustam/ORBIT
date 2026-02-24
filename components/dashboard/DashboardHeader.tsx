'use client'

import { usePathname } from 'next/navigation'

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/seller': 'Overview',
  '/dashboard/seller/profile': 'Profile',
  '/dashboard/seller/gigs': 'My Gigs',
  '/dashboard/seller/gigs/new': 'Create Gig',
  '/dashboard/seller/orders': 'Orders',
  '/dashboard/seller/reviews': 'Reviews',
  '/dashboard/seller/earnings': 'Earnings',
  '/dashboard/orders': 'My Orders',
  '/dashboard/messages': 'Messages',
  '/dashboard/reviews': 'Reviews',
  '/dashboard/settings': 'Settings',
}

export function DashboardHeader() {
  const pathname = usePathname()
  const title = breadcrumbMap[pathname] || 'Dashboard'

  return (
    <header className="flex h-16 items-center border-b border-border bg-surface px-6">
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
    </header>
  )
}
