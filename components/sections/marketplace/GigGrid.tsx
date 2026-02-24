'use client'

import { Briefcase } from 'lucide-react'
import { GigCard } from './GigCard'
import type { Gig } from '@/types/marketplace'

interface GigGridProps {
  gigs: Gig[]
}

export function GigGrid({ gigs }: GigGridProps) {
  if (gigs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-dim">
          <Briefcase className="h-8 w-8 text-orange" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-text-primary">
          No gigs found
        </h3>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          Try adjusting your filters or check back later for new listings.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {gigs.map((gig) => (
        <GigCard key={gig.id} gig={gig} />
      ))}
    </div>
  )
}
