import { MarketplaceLayoutClient } from './MarketplaceLayoutClient'

export const dynamic = 'force-dynamic'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <MarketplaceLayoutClient>{children}</MarketplaceLayoutClient>
}
