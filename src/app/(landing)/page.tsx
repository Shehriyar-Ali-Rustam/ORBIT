import LandingNav from '@/components/landing/LandingNav'
import ScrollProgress from '@/components/landing/ScrollProgress'
import Hero from '@/components/landing/Hero'
import Stats from '@/components/landing/Stats'
import Capabilities from '@/components/landing/Capabilities'
import SelectedWork from '@/components/landing/SelectedWork'
import Proof from '@/components/landing/Proof'
import Process from '@/components/landing/Process'
import ContactCard from '@/components/landing/ContactCard'
import CTABand from '@/components/landing/CTABand'
import LandingFooter from '@/components/landing/LandingFooter'
import StickyActionBar from '@/components/landing/StickyActionBar'
import { StoryCover } from '@/components/story/StoryCover'
import { StoryEntry } from '@/components/story/StoryEntry'

/**
 * v.l.01 — the destination for the QR code printed on the ORBIT business card.
 *
 * Section order is deliberate and reads top-to-bottom as the questions someone
 * asks in the thirty seconds after they scan:
 *   who is this / how do I reach them  → Hero + quick actions
 *   are they real                      → Stats
 *   what do they do                    → Capabilities
 *   have they done it before           → SelectedWork + Proof
 *   what is it like working with them  → Process
 *   let me save this for later         → ContactCard (vCard)
 *   fine, let's talk                   → CTABand
 */
export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <ScrollProgress />
      <main id="main-content">
        <Hero />
        <Stats />
        <Capabilities />
        <SelectedWork />
        <Proof />
        <Process />
        <ContactCard />
        <CTABand />
      </main>
      <LandingFooter />
      <StickyActionBar />
      {/*
        Story Mode. The walkthrough is what a first-time visitor lands in, and
        everything above is what stays in the HTML underneath it: crawlers and
        no-JS visitors get the full landing page, and anyone who exits the tour
        lands on it. The page is never unmounted.

        StoryCover paints before hydration so the page never flashes up first.
      */}
      <StoryCover />
      <StoryEntry />
    </>
  )
}
