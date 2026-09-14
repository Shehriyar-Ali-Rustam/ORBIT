import LandingNav from '@/components/landing/LandingNav'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
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
import { OrbieCover } from '@/components/orbie/OrbieCover'
// Side-effect import, on purpose. This is a server component, so evaluating
// the graph here runs its integrity checks during prerender — unreachable
// nodes, hold nodes with no way out, auto nodes with no `next`, digits in
// narration. Without it those warnings only ever reach a browser console
// somebody has to remember to open, which is not where a build-time mistake
// should be found. Types only, so nothing is added to the client bundle.
import '@/data/orbie-graph'
import { OrbieEntry } from '@/components/orbie/OrbieEntry'
import { OrbieDevTools } from '@/components/orbie/OrbieDevTools'

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
      {/* Sits under the fixed nav so the two read as one edge. */}
      <ScrollProgress className="fixed inset-x-0 top-[67px] z-50 h-[2px] bg-orbit-acc md:top-[79px]" />
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
        Orbie. The walkthrough is what a first-time visitor lands in, and
        everything above is what stays in the HTML underneath it: crawlers and
        no-JS visitors get the full landing page, and anyone who exits the tour
        lands on it. The page is never unmounted.

        OrbieCover paints before hydration so the page never flashes up first.
      */}
      <OrbieCover />
      {/* While ORBIE_ENABLED is false this renders nothing except at
          ?orbie=1. The landing page below is never unmounted. */}
      <OrbieEntry />
      {/* Dev-only. Compiles to nothing in a production build. */}
      <OrbieDevTools />
    </>
  )
}
