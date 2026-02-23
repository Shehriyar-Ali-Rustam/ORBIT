import type { Metadata } from 'next'
import { ServicesHero } from '@/components/sections/services/ServicesHero'
import { ServiceBlock } from '@/components/sections/services/ServiceBlock'
import { Process } from '@/components/sections/services/Process'
import { FAQ } from '@/components/sections/services/FAQ'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore Orbit\'s full-service technology solutions — AI chatbots, model training, web development, mobile apps, and graphic design.',
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceBlock />
      <Process />
      <FAQ />
      <HomeCTA />
    </>
  )
}
