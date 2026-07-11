import type { Metadata } from 'next'
import { PortfolioHero } from '@/components/sections/portfolio/PortfolioHero'
import { ProjectGrid } from '@/components/sections/portfolio/ProjectGrid'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

export const metadata: Metadata = {
  title: 'Portfolio - AI, Web & Mobile Projects Built by ORBIT',
  description:
    'Real projects shipped by ORBIT: AI chatbots, machine learning tools, e-voting systems, adventure marketplaces, food ordering, portfolios and more. See what our team builds.',
  keywords: [
    'ORBIT portfolio',
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
      <HomeCTA />
    </>
  )
}
