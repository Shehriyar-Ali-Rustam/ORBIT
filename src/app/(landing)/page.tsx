import LandingNav from '@/components/landing/LandingNav'
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
    </>
  )
}
