'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion'
import type { CaptionLine } from '@/data/orbie-graph'
import { EASE } from '@/components/motion/motion-config'

/**
 * The minimum needed to render captions.
 *
 * Deliberately not `Scene`. This component only ever reads an identity, the
 * lines and the full narration, so asking for a whole scene would mean Orbie's
 * graph nodes had to pretend to be Story Mode scenes to reuse it. Same
 * reasoning as `ClockNode` in useStoryClock.
 */
export interface CaptionSource {
  /** Only used to key the reveal, so any stable string works. */
  id: string
  lines: CaptionLine[]
  /** Announced once to screen readers, in full. */
  narration: string
}

interface StoryCaptionsProps {
  scene: CaptionSource
  elapsedMs: MotionValue<number>
}

/**
 * The narration, on screen.
 *
 * With no audio yet these captions *are* the narration, not a fallback, so they
 * carry the whole story and have to stay readable over any scene background.
 *
 * Sync without re-rendering every frame: the clock's `elapsedMs` is a
 * MotionValue, subscribed to here and converted into a line index. React state
 * only changes when the line actually changes, which is two or three times per
 * scene rather than sixty times a second.
 *
 * The full narration is also emitted once into an `aria-live` region, because a
 * screen reader announcing three separate fragments as they appear reads as
 * three interruptions rather than one sentence.
 */
export function OrbieCaptions({ scene, elapsedMs }: StoryCaptionsProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const reduce = useReducedMotion()

  // A new scene starts at its first line, whichever way we arrived.
  useEffect(() => setLineIndex(0), [scene.id])

  useMotionValueEvent(elapsedMs, 'change', (ms) => {
    let next = 0
    for (let i = 0; i < scene.lines.length; i += 1) {
      if (ms >= scene.lines[i].atMs) next = i
    }
    setLineIndex((current) => (current === next ? current : next))
  })

  const line = scene.lines[lineIndex]

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-28 md:pb-32">
      {/* A scrim, not a solid bar: keeps contrast over photography without
          boxing the text into a caption plate. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-orbit-canvas via-orbit-canvas/85 to-transparent"
      />

      <div className="relative mx-auto max-w-[34ch] text-center md:max-w-[46ch]">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${scene.id}-${lineIndex}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="text-balance font-grotesk text-[1.375rem] font-medium leading-[1.3] tracking-[-0.02em] text-orbit-ink md:text-[1.75rem]"
          >
            {line?.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* One announcement per scene, not one per fragment. */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {scene.narration}
      </p>
    </div>
  )
}
