'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { track } from '@vercel/analytics'
import { ACTIONS } from '@/components/landing/QuickActions'
import { EASE } from '@/components/motion/motion-config'

/** Call, WhatsApp, Save. Email is dropped — the contact node covers it, and it
 *  serves a card scanner least of the four. Filtered by key rather than
 *  redefined, so editing the phone number in CARD still reaches here. */
const DOCK_KEYS = ['call', 'whatsapp', 'save'] as const
const DOCK_ACTIONS = ACTIONS.filter((a) =>
  (DOCK_KEYS as readonly string[]).includes(a.key)
)

/**
 * The contact dock — visible in every scene, at every moment of the tour.
 *
 * `/` is the URL printed on the company's business card. Someone who scans
 * that QR wants a phone number, not a guided tour, and before this they had to
 * either sit through the walkthrough or find the exit. Three taps of screen
 * real estate is a cheap price for not losing the person the card was printed
 * for.
 *
 * Four things that make it work rather than just exist:
 *
 *  - Real `<a href>` with `tel:`, `wa.me` and the vCard route. No JavaScript
 *    needed, works with a screen reader, and long-press or right-click behave
 *    the way anyone expects a link to.
 *  - Rendered as a sibling of the scene container, never inside it. Put it
 *    within the `AnimatePresence` and it unmounts and remounts on every single
 *    navigation.
 *  - `z-40`, matching the controls, so it sits above the `z-10` tap layer. A
 *    tap on the dock must not also advance the tour.
 *  - `env(safe-area-inset-bottom)`, copying `StickyActionBar`, or it lands
 *    under the home indicator on a notched phone.
 */
export function OrbieDock() {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
      className="absolute bottom-0 right-0 z-40 flex items-center gap-2 p-3 md:p-5"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      {DOCK_ACTIONS.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          onClick={() => track('orbie_dock', { action: key })}
          aria-label={label}
          className="flex h-11 w-11 items-center justify-center border border-orbit-ink/15 bg-orbit-canvas/80 text-orbit-ink/70 backdrop-blur-sm transition-colors hover:border-orbit-accInk/60 hover:text-orbit-accInk"
        >
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      ))}
    </motion.div>
  )
}
