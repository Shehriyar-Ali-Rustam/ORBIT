'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { Play } from 'lucide-react'
import {
  STORY_ENABLED,
  STORY_QUERY_PARAM,
  STORY_REPLAY_EVERY_VISIT,
  STORY_SEEN_KEY,
  STORY_SECONDS,
} from '@/lib/story-flags'
import { orbieWantsTheScreen } from '@/components/orbie/OrbieEntry'

/**
 * The player is code-split. `/` is the printed QR code's destination, so its
 * bundle is the one that matters most: imported statically the player and its
 * scenes added ~11 kB to every visit. `ssr: false` because the player owns the
 * viewport, reads localStorage and drives a rAF loop.
 */
const StoryPlayer = dynamic(() => import('./StoryPlayer').then((m) => m.StoryPlayer), {
  ssr: false,
})

type Mode = 'deciding' | 'player' | 'site'

/** Removes the pre-paint cover rendered in the page's HTML. See `StoryCover`. */
function dropCover() {
  document.getElementById('story-cover')?.remove()
  document.documentElement.classList.remove('story-covered')
}

/**
 * The walkthrough is the landing.
 *
 * A first-time visitor does not get a choice screen in front of the story —
 * they arrive inside it. That is the whole difference between this and an
 * overlay bolted onto a normal homepage.
 *
 * Three things make that work without breaking what `/` is for:
 *
 * 1. **The landing page is still in the same HTML document, underneath.**
 *    The story is `position: fixed` over it; the page is never unmounted or
 *    `display: none`. Crawlers, and anyone with JavaScript off, get the full
 *    marketing page exactly as before — which matters, because `/` is what
 *    ranks for the brand's own name.
 *
 * 2. **A cover is painted before hydration**, so there is no moment where the
 *    landing page flashes up before the story covers it. Without it the story
 *    reads as a modal that appeared late; with it, the story is simply what
 *    loaded. The cover is inert HTML plus one inline script — see the page.
 *
 * 3. **Exiting is a dissolve into the site, not a dismissal.** The visitor
 *    ends up on the landing page they were always technically on.
 */
export function StoryEntry() {
  const [mode, setMode] = useState<Mode>('deciding')
  const [showReplay, setShowReplay] = useState(false)

  useEffect(() => {
    // `?story=1` always plays, regardless of the flag or of having seen it.
    // That is how the tour stays reviewable and linkable.
    const forced =
      new URLSearchParams(window.location.search).get(STORY_QUERY_PARAM) === '1'

    if (forced) {
      setMode('player')
      return
    }

    // Orbie supersedes Story Mode where both would fire. Two full-screen
    // experiences on one page is not a degraded state, it is a broken one —
    // and this is the seam where they overlap until Story Mode is retired.
    // Orbie drops the pre-paint cover from its own player's mount.
    if (orbieWantsTheScreen()) return

    if (!STORY_ENABLED) {
      setMode('site')
      dropCover()
      return
    }

    let seen = false
    try {
      seen = window.localStorage.getItem(STORY_SEEN_KEY) === '1'
    } catch {
      // Private mode or blocked storage. Treat as a first visit.
    }

    if (seen && !STORY_REPLAY_EVERY_VISIT) {
      setMode('site')
      setShowReplay(true)
      dropCover()
      return
    }

    setMode('player')
  }, [])

  // Note: when mode is 'player' the cover is NOT dropped here. StoryPlayer
  // clears it from its own mount effect, so the cover lasts exactly until the
  // story is on screen rather than until we decided to load it.

  const remember = useCallback(() => {
    try {
      window.localStorage.setItem(STORY_SEEN_KEY, '1')
    } catch {
      // Not being able to remember is not a reason to trap them next time.
    }
  }, [])

  const leaveStory = useCallback(() => {
    remember()
    dropCover()
    setMode('site')
    setShowReplay(true)
  }, [remember])

  const replay = useCallback(() => setMode('player'), [])

  return (
    <>
      <AnimatePresence>
        {mode === 'player' && (
          <motion.div
            key="player"
            // Dissolving out reveals the landing page that was underneath the
            // whole time, so leaving reads as arriving somewhere.
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100]"
          >
            <StoryPlayer onExit={leaveStory} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReplay && mode === 'site' && (
          <motion.button
            key="replay"
            type="button"
            onClick={replay}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="fixed bottom-24 right-4 z-[60] inline-flex items-center gap-2 border border-orbit-accInk/45 bg-orbit-canvas/90 px-3.5 py-2.5 font-spacemono text-[10px] font-bold uppercase tracking-[0.2em] text-orbit-accInk backdrop-blur-sm transition-colors hover:bg-orbit-acc hover:text-orbit-onAcc md:bottom-6"
          >
            <Play className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            {STORY_SECONDS}s tour
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
