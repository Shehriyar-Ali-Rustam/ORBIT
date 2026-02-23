import type { Metadata } from 'next'
import { PortfolioHero } from '@/components/sections/portfolio/PortfolioHero'
import { ProjectGrid } from '@/components/sections/portfolio/ProjectGrid'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Explore Orbit\'s portfolio of AI chatbots, web applications, mobile apps, and design projects.',
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
