'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Play, X } from 'lucide-react'
import OrbitMark from '@/components/landing/OrbitMark'
import {
  STORY_CHOICE_KEY,
  STORY_ENABLED,
  STORY_QUERY_PARAM,
  STORY_SECONDS,
} from '@/lib/story-flags'
/**
 * The player is code-split, and that is not a micro-optimisation.
 *
 * `/` is the destination printed on the company's business card, so its bundle
 * is the one that matters most. Imported statically, the player and its five
 * scenes added ~11 kB to every visit — including the overwhelming majority
 * that never start the tour, and including every visit while STORY_ENABLED is
 * still false. Now it is fetched on the tap that opens it.
 *
 * `ssr: false` because the player is client-only by nature: it owns the
 * viewport, reads localStorage and drives a rAF loop.
 */
const StoryPlayer = dynamic(
  () => import('./StoryPlayer').then((m) => m.StoryPlayer),
  { ssr: false }
)

type Mode =
  /** Nothing rendered. The landing page behaves exactly as it always has. */
  | 'idle'
  /** The choice screen. */
  | 'gate'
  /** The story itself. */
  | 'player'
  /** Visitor already chose "browse", so offer a quiet way back in. */
  | 'button'

const TOUR_SECONDS = STORY_SECONDS

/**
 * The entry point for Story Mode, and the only thing the landing page mounts.
 *
 * Three decisions worth knowing:
 *
 * 1. **The query param is read from `window.location`, not `useSearchParams()`.**
 *    In the App Router, `useSearchParams()` opts the whole route into dynamic
 *    rendering unless it sits inside a Suspense boundary. `/` is statically
 *    generated today and is the destination of a printed QR code, so keeping it
 *    static matters more than the ergonomics of the hook.
 *
 * 2. **Everything decides in an effect, so nothing renders on the server.**
 *    Crawlers and no-JS visitors get the landing page untouched, which is the
 *    point: the classic site is the SEO surface and this is a layer on top.
 *
 * 3. **The landing page stays in the DOM underneath.** The overlay is
 *    `position: fixed`; the page is never unmounted or `display: none`.
 */
export function StoryGate() {
  const [mode, setMode] = useState<Mode>('idle')
  const reduce = useReducedMotion()

  useEffect(() => {
    // `?story=1` always opens the player, regardless of STORY_ENABLED. That is
    // how the story stays testable in production before it is switched on.
    const forced =
      new URLSearchParams(window.location.search).get(STORY_QUERY_PARAM) === '1'
    if (forced) {
      setMode('player')
      return
    }

    if (!STORY_ENABLED) return

    let dismissed = false
    try {
      dismissed = window.localStorage.getItem(STORY_CHOICE_KEY) === 'browse'
    } catch {
      // Private mode or blocked storage. Treat as a first visit.
    }
    setMode(dismissed ? 'button' : 'gate')
  }, [])

  const remember = useCallback((choice: 'browse' | 'tour') => {
    try {
      window.localStorage.setItem(STORY_CHOICE_KEY, choice)
    } catch {
      // Not being able to remember the choice is not a reason to block it.
    }
  }, [])

  const startTour = useCallback(() => setMode('player'), [])

  const browse = useCallback(() => {
    remember('browse')
    setMode('button')
  }, [remember])

  // Leaving the player returns to the quiet button, never back to the gate.
  // Being asked the same question twice in one visit reads as a trap.
  const exitPlayer = useCallback(() => {
    remember('browse')
    setMode(STORY_ENABLED ? 'button' : 'idle')
  }, [remember])

  if (mode === 'player') return <StoryPlayer onExit={exitPlayer} />

  return (
    <AnimatePresence>
      {mode === 'gate' && (
        <motion.div
          key="gate"
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-gate-title"
          initial={reduce ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex min-h-dvh flex-col items-center justify-center bg-orbit-canvas px-6 text-center"
        >
          <div className="grid-faint pointer-events-none absolute inset-0 opacity-60" aria-hidden />

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="relative flex flex-col items-center"
          >
            <OrbitMark className="h-12 w-12 text-orbit-ink" />

            <p className="eyebrow accent-rule-both mt-8">Orbit Innovations</p>

            <h1
              id="story-gate-title"
              className="h-section mt-5 max-w-[16ch] font-syne font-extrabold text-orbit-ink"
            >
              Would you like the short version?
            </h1>

            <p className="mt-5 max-w-[46ch] text-orbit-ink/70">
              Orbit AI will walk you through what we build. About {TOUR_SECONDS} seconds, and
              you can leave at any point.
            </p>

            <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:flex-row">
              <button type="button" onClick={startTour} className="btn-primary">
                <Play className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                Take the {TOUR_SECONDS}-second tour
              </button>
              <button type="button" onClick={browse} className="btn-ghost">
                Browse the site
              </button>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={browse}
            aria-label="Close and browse the site"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-orbit-ink/50 transition-colors hover:text-orbit-accInk"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </motion.div>
      )}

      {mode === 'button' && (
        <motion.button
          key="button"
          type="button"
          onClick={startTour}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-4 z-[60] inline-flex items-center gap-2 border border-orbit-accInk/45 bg-orbit-canvas/90 px-3.5 py-2.5 font-spacemono text-[10px] font-bold uppercase tracking-[0.2em] text-orbit-accInk backdrop-blur-sm transition-colors hover:bg-orbit-acc hover:text-orbit-onAcc md:bottom-6"
        >
          <Play className="h-3 w-3" strokeWidth={2.5} aria-hidden />
          {TOUR_SECONDS}s tour
        </motion.button>
      )}
    </AnimatePresence>
  )
}
