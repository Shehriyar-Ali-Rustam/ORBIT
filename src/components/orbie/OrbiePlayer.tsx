'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { track } from '@vercel/analytics'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { StoryProgress } from '@/components/story/StoryProgress'
import { StoryControls } from '@/components/story/StoryControls'
import { StoryCaptions } from '@/components/story/StoryCaptions'
import { useStoryInput } from '@/components/story/useStoryInput'
import { Orbie } from './character/Orbie'
import { useOrbieNavigator } from './useOrbieNavigator'
import { CrossroadsView } from './views/CrossroadsView'
import { ServicesView } from './views/ServicesView'
import { WorkView } from './views/WorkView'
import { AboutView } from './views/AboutView'
import { ContactView } from './views/ContactView'
import { ChatView } from './views/ChatView'
import { OrbieDock } from './OrbieDock'
import { ORBIE_CHAT_ENABLED } from '@/lib/orbie-flags'
import type { OptionCard } from '@/data/orbie-graph'

const EASE = [0.22, 1, 0.36, 1] as const

interface OrbiePlayerProps {
  onExit(): void
}

/**
 * Orbie's player.
 *
 * A deliberate fork of `StoryPlayer` rather than a parameterised version of
 * it. The two diverge on enough axes — routing, waiting, options, back — that
 * sharing one component would make it mostly branches, and branches in the
 * thing that orchestrates everything else is how both experiences end up
 * fragile. What they genuinely share (`StoryProgress`, `StoryControls`,
 * `StoryCaptions`, `useStoryInput`, the clock) is imported, not copied.
 *
 * The layer contract is inherited exactly, because it was worked out against
 * real touch targets: progress owns the top edge, controls sit top-right at
 * z-40, captions own the bottom third, the character sits bottom-left, and the
 * tap layer is z-10 underneath all of them.
 */
export function OrbiePlayer({ onExit }: OrbiePlayerProps) {
  const reduce = useReducedMotion()
  const nav = useOrbieNavigator()
  const { node, clock } = nav
  const [celebrating, setCelebrating] = useState(false)

  const exit = useCallback(() => {
    track('orbie_exit', { node: node.id })
    onExit()
  }, [onExit, node.id])

  // Tapping advances only while something is running. On a `hold` node the
  // next step is a choice, and a stray tap must not stand in for one.
  const tappable = !clock.isWaiting && !node.options?.length

  const input = useStoryInput({
    next: clock.next,
    prev: clock.prev,
    pause: clock.pause,
    play: clock.play,
    exit,
    isPaused: clock.isPaused,
  })

  useEffect(() => {
    track('orbie_start')
    // Clear the pre-paint cover from here rather than on a timer: this
    // component is behind a dynamic import, so "we decided to mount" and "we
    // are on screen" are different moments, and a timer drops the cover into
    // the gap on a slow connection.
    document.getElementById('story-cover')?.remove()
    document.documentElement.classList.remove('story-covered')
  }, [])

  useEffect(() => {
    track('orbie_node', { node: node.id })
  }, [node.id])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const onPick = useCallback(
    (option: OptionCard) => {
      track('orbie_pick', { from: node.id, to: option.to })
      nav.go(option.to)
    },
    [nav, node.id]
  )

  // A returning visitor hears the short version. Without this, coming back to
  // the crossroads a third time replays the same introduction each time.
  const scene = useMemo(
    () => ({
      id: node.id,
      narration: nav.isRepeat && node.repeat ? node.repeat.narration : node.narration,
      lines: nav.isRepeat && node.repeat ? node.repeat.lines : node.lines,
      durationMs: 0,
    }),
    [node, nav.isRepeat]
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Orbit Innovations guided tour"
      className="fixed inset-0 z-[100] min-h-dvh overflow-hidden bg-orbit-canvas"
    >
      {/* Screen-reader escape hatch, deliberately first in the DOM. */}
      <button
        type="button"
        onClick={exit}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-orbit-accInk focus:bg-orbit-canvas focus:px-4 focus:py-2 focus:text-sm focus:text-orbit-accInk"
      >
        Skip the tour and read the site
      </button>

      <div className="grid-faint pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      {/* Chapter position, not tour position — a graph has no linear place. */}
      <StoryProgress
        count={nav.chapterLength}
        activeIndex={nav.chapterIndex}
        progress={clock.progress}
      />

      <StoryControls
        isPaused={clock.isPaused}
        isComplete={false}
        onTogglePlay={clock.isPaused ? clock.play : clock.pause}
        onRestart={nav.restart}
        onExit={exit}
      />

      {nav.canGoBack && (
        <button
          type="button"
          onClick={nav.back}
          aria-label="Back"
          className="absolute left-3 top-6 z-40 flex h-11 w-11 items-center justify-center border border-orbit-ink/15 bg-orbit-canvas/70 text-orbit-ink/70 backdrop-blur-sm transition-colors hover:border-orbit-accInk/50 hover:text-orbit-accInk"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </button>
      )}

      {/* Chat overlays the current node rather than being one of them, so
          closing it puts the visitor back exactly where they were. */}
      {nav.mode === 'chat' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-orbit-canvas/95 px-6 pb-32 pt-20 backdrop-blur-sm">
          <ChatView onClose={nav.closeChat} />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={node.id}
          className="absolute inset-0 flex items-center justify-center px-6 pb-56 pt-16"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="flex w-full flex-col items-center gap-8">
            {node.view === 'crossroads' && node.options && (
              <>
                <CrossroadsView options={node.options} ready={clock.isWaiting} onPick={onPick} />
                {/* The fifth, smaller prompt the spec asks for. Only offered
                    where the visitor is already choosing, so it reads as
                    another door rather than an interruption. */}
                {clock.isWaiting && ORBIE_CHAT_ENABLED && (
                  <motion.button
                    type="button"
                    onClick={nav.openChat}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="inline-flex items-center gap-2 font-spacemono text-[10px] uppercase tracking-[0.18em] text-orbit-ink/50 transition-colors hover:text-orbit-accInk"
                  >
                    <MessageCircle className="h-3 w-3" aria-hidden />
                    or just ask me anything
                  </motion.button>
                )}
              </>
            )}
            {node.view === 'services' && <ServicesView focus={node.focus} />}
            {node.view === 'work' && <WorkView />}
            {node.view === 'about' && <AboutView />}
            {node.view === 'contact' && <ContactView onDone={() => setCelebrating(true)} />}

            {/* Arrival and the orientation beats stage the character itself;
                everything else keeps it docked in the corner. */}
            {(node.view === 'arrival' || node.view === 'beat') && (
              <Orbie
                pose={node.pose ?? 'idle'}
                emotion={node.emotion}
                size={node.view === 'arrival' ? 'hero' : 'stage'}
              />
            )}

            {/* Options on a content node. The crossroads renders its own,
                because there the choice is the whole view rather than a
                footer under something else. */}
            {node.view !== 'crossroads' && clock.isWaiting && node.options && (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex flex-wrap justify-center gap-3"
              >
                {node.options.map((o) => (
                  <button key={o.id} type="button" onClick={() => onPick(o)} className="btn-ghost">
                    {o.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <StoryCaptions scene={scene} elapsedMs={clock.elapsedMs} />

      {/* Docked wherever the view owns the stage, so Orbie stays present as
          the narrator without competing with the content it is describing. */}
      {!['arrival', 'beat'].includes(node.view) && (
        <div className="pointer-events-none absolute bottom-6 left-5 z-30 md:bottom-8 md:left-8">
          <Orbie
            pose={celebrating ? 'celebrate' : clock.isPaused ? 'sleep' : (node.pose ?? 'idle')}
            emotion={celebrating ? 'star' : node.emotion}
            size="dock"
            // celebrate is one-shot, so it returns to idle by itself. Clearing
            // the flag on its own end keeps the two in step rather than having
            // a timer here guess at the animation's length.
            onPoseEnd={(p) => p === 'celebrate' && setCelebrating(false)}
          />
        </div>
      )}

      {/* Call, WhatsApp, Save — present at every moment of the tour. `/` is
          the URL on the business card, and a card scanner must never have to
          finish a walkthrough to reach a phone number. */}
      <OrbieDock />

      {tappable && (
        <div
          className="absolute inset-0 z-10"
          style={{ touchAction: 'none' }}
          onPointerDown={input.onPointerDown}
          onPointerUp={input.onPointerUp}
          onPointerCancel={input.onPointerCancel}
        />
      )}

      {clock.isPaused && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute left-1/2 top-16 z-30 -translate-x-1/2 font-spacemono text-[10px] uppercase tracking-[0.24em] text-orbit-ink/50"
        >
          Paused
        </motion.p>
      )}
    </div>
  )
}
