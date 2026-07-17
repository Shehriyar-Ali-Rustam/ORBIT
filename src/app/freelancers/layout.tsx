import { MARKETPLACE_ENABLED } from '@/lib/flags'
import { ComingSoon } from '@/components/ComingSoon'
import { MarketplaceLayoutClient } from './MarketplaceLayoutClient'

export const dynamic = 'force-dynamic'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  // While the marketplace is disabled, every /freelancers/* route shows the
  // Coming Soon screen. Flip MARKETPLACE_ENABLED in src/lib/flags.ts to
  // restore the real marketplace.
  if (!MARKETPLACE_ENABLED) {
    return (
      <ComingSoon
        label="Freelancer Marketplace"
        description="We're building a curated marketplace to hire vetted Orbiters - designers, developers, and AI specialists. It's almost ready. Check back shortly."
      />
    )
  }
  return <MarketplaceLayoutClient>{children}</MarketplaceLayoutClient>
}
