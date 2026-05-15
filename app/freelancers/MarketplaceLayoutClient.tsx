'use client'

import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar'
import { Footer } from '@/components/layout/Footer'

export function MarketplaceLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketplaceNavbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
