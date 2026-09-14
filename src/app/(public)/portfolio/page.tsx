import type { Metadata } from 'next'
import { PortfolioHero } from '@/components/sections/portfolio/PortfolioHero'
import { ProjectGrid } from '@/components/sections/portfolio/ProjectGrid'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Portfolio - AI, Web & Mobile Projects Built by Orbit Innovations',
  description:
    'Real projects shipped by Orbit Innovations: AI chatbots, machine learning tools, e-voting systems, adventure marketplaces, food ordering, portfolios and more. See what our team builds.',
  keywords: [
    'Orbit Innovations portfolio',
    'AI projects Pakistan',
    'web development portfolio',
    'software case studies Pakistan',
  ],
  alternates: { canonical: '/portfolio' },
}

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <ProjectGrid />
      <CTASection />
    </>
  )
}
