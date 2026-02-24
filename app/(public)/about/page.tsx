import type { Metadata } from 'next'
import { AboutHero } from '@/components/sections/about/AboutHero'
import { OurStory } from '@/components/sections/about/OurStory'
import { MissionVision } from '@/components/sections/about/MissionVision'
import { Values } from '@/components/sections/about/Values'
import { Team } from '@/components/sections/about/Team'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Orbit — our story, mission, values, and the team behind our AI-powered software solutions.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <Values />
      <Team />
      <HomeCTA />
    </>
  )
}
