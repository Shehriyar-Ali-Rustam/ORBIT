import type { Metadata } from 'next'
import { FreelancersHero } from '@/components/sections/freelancers/FreelancersHero'
import { FreelancerGrid } from '@/components/sections/freelancers/FreelancerGrid'
import { HowItWorks } from '@/components/sections/freelancers/HowItWorks'
import { JoinBanner } from '@/components/sections/freelancers/JoinBanner'

export const metadata: Metadata = {
  title: 'Freelancers',
  description: 'Find expert freelancers from the Orbit network — vetted developers, designers, AI engineers, and marketers.',
}

export default function FreelancersPage() {
  return (
    <>
      <FreelancersHero />
      <FreelancerGrid />
      <HowItWorks />
      <JoinBanner />
    </>
  )
}
