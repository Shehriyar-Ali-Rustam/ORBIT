import type { Metadata } from 'next'
import { AboutHero } from '@/components/sections/about/AboutHero'
import { OurStory } from '@/components/sections/about/OurStory'
import { MissionVision } from '@/components/sections/about/MissionVision'
import { Values } from '@/components/sections/about/Values'
import { PeopleBehindOrbit } from '@/components/sections/about/PeopleBehindOrbit'
import { Team } from '@/components/sections/about/Team'
import { HomeCTA } from '@/components/sections/home/HomeCTA'

export const metadata: Metadata = {
  title: 'About ORBIT — The Software Team Behind Our AI & Web Products',
  description:
    'Meet the three software engineering students from Pakistan behind ORBIT — Shehriyar Ali Rustam, Saqib Nawaz Khan, and Abdul Ahad. AI, web, and mobile projects delivered fast, worldwide.',
  keywords: [
    'about ORBIT',
    'ORBIT founders',
    'Pakistan software team',
    'Shehriyar Ali Rustam',
    'Saqib Nawaz Khan',
    'Abdul Ahad',
    'ORBIT company',
  ],
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <MissionVision />
      <Values />
      <PeopleBehindOrbit />
      <Team />
      <HomeCTA />
    </>
  )
}
