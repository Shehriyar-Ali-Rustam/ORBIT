import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

/**
 * Three pieces of chrome used to render above every page here and have been
 * removed rather than restyled, because each was decoration with a cost:
 *
 *  - `Preloader` held a full-screen panel over the site for a fixed 500ms on
 *    every navigation. It was not waiting for anything — the timeout was the
 *    whole implementation — so it added half a second of blank screen to a
 *    page that was already painted underneath it.
 *  - `CursorGlow` tracked the pointer with a 300px orange radial gradient.
 *    Cursor effects read as a template flourish, and this one repainted a
 *    large fixed layer on every mousemove.
 *  - `GrainOverlay` ran an SVG `feTurbulence` filter across a fixed full-page
 *    element. Turbulence is one of the most expensive SVG filters there is,
 *    and it sat over the entire viewport at all times for a 3% opacity texture.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  )
}
