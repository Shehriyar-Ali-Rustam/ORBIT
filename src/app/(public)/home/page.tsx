import { Hero } from '@/components/sections/home/Hero'
import { Stats } from '@/components/sections/home/Stats'
import { ServicesSnapshot } from '@/components/sections/home/ServicesSnapshot'
import { AIShowcase } from '@/components/sections/home/AIShowcase'
import { WhyOrbit } from '@/components/sections/home/WhyOrbit'
import { FeaturedPortfolio } from '@/components/sections/home/FeaturedPortfolio'
import { Testimonials } from '@/components/sections/home/Testimonials'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

/**
 * The pre-v.l.01 landing page, parked here so the old and new versions can be
 * compared side by side while v.l.01 is being reviewed. `/` now serves the
 * QR-card landing page from src/app/(landing).
 *
 * Kept out of the sitemap and noindexed — it is a review artefact, not a real
 * page. Delete this folder once v.l.01 is signed off.
 */
export const metadata = {
  title: 'Home (previous version)',
  robots: { index: false, follow: false },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesSnapshot />
      <AIShowcase />
      <WhyOrbit />
      <FeaturedPortfolio />
      <Testimonials />
      <HomeCTA />
    </>
  )
}
