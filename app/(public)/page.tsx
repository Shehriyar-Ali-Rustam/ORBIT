import { Hero } from '@/components/sections/home/Hero'
import { Stats } from '@/components/sections/home/Stats'
import { ServicesSnapshot } from '@/components/sections/home/ServicesSnapshot'
import { AIShowcase } from '@/components/sections/home/AIShowcase'
import { WhyOrbit } from '@/components/sections/home/WhyOrbit'
import { FeaturedPortfolio } from '@/components/sections/home/FeaturedPortfolio'
import { Testimonials } from '@/components/sections/home/Testimonials'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

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
