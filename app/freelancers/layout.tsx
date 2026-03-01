import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar'
import { Footer } from '@/components/layout/Footer'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketplaceNavbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
