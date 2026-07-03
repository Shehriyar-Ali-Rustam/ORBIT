import dynamic from 'next/dynamic'
import { Hero } from '@/components/sections/home/Hero'

// Below-the-fold sections are lazy-loaded so the initial JS bundle stays
// small and the hero paints faster. Each section renders in its own chunk
// only when the browser is ready for it.
const Stats = dynamic(() => import('@/components/sections/home/Stats').then((m) => ({ default: m.Stats })))
const ServicesSnapshot = dynamic(() => import('@/components/sections/home/ServicesSnapshot').then((m) => ({ default: m.ServicesSnapshot })))
const AIShowcase = dynamic(() => import('@/components/sections/home/AIShowcase').then((m) => ({ default: m.AIShowcase })))
const WhyOrbit = dynamic(() => import('@/components/sections/home/WhyOrbit').then((m) => ({ default: m.WhyOrbit })))
const FeaturedPortfolio = dynamic(() => import('@/components/sections/home/FeaturedPortfolio').then((m) => ({ default: m.FeaturedPortfolio })))
const Testimonials = dynamic(() => import('@/components/sections/home/Testimonials').then((m) => ({ default: m.Testimonials })))
const HomeCTA = dynamic(() => import('@/components/sections/home/HomeCTA').then((m) => ({ default: m.HomeCTA })))

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
