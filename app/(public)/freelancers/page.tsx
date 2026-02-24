'use client'

import { useState } from 'react'
import { FreelancersHero } from '@/components/sections/freelancers/FreelancersHero'
import { FreelancerGrid } from '@/components/sections/freelancers/FreelancerGrid'
import { HowItWorks } from '@/components/sections/freelancers/HowItWorks'
import { JoinBanner } from '@/components/sections/freelancers/JoinBanner'
import { CategoryBar } from '@/components/sections/marketplace/CategoryBar'
import { GigGrid } from '@/components/sections/marketplace/GigGrid'
import { useGigs } from '@/hooks/useGigs'
import type { GigCategory } from '@/types/marketplace'

export default function FreelancersPage() {
  const [selectedCategory, setSelectedCategory] = useState<GigCategory | null>(null)
  const { gigs, loading } = useGigs(selectedCategory)

  return (
    <>
      <FreelancersHero />

      {/* Marketplace Browse Section */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-text-primary">
            Browse Services
          </h2>
          <CategoryBar
            selected={selectedCategory}
            onSelect={(cat) => setSelectedCategory(cat as GigCategory | null)}
          />
          <div className="mt-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
              </div>
            ) : (
              <GigGrid gigs={gigs} />
            )}
          </div>
        </div>
      </section>

      {/* Existing static freelancer cards */}
      <FreelancerGrid />
      <HowItWorks />
      <JoinBanner />
    </>
  )
}
