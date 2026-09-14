'use client'

import { motion, type MotionValue } from 'framer-motion'

interface StoryProgressProps {
  count: number
  activeIndex: number
  /** 0..1 through the active scene. Per-frame, so it must stay a MotionValue. */
  progress: MotionValue<number>
}

/**
 * The Instagram bar: one segment per scene, the active one filling in real time.
 *
 * The fill is bound straight to the clock's MotionValue via `scaleX`, so it
 * updates every frame without React re-rendering. Segments behind the active
 * one are full, ahead of it are empty, and both are plain CSS.
 */
export function StoryProgress({ count, activeIndex, progress }: StoryProgressProps) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex gap-1 px-3 pt-3"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={activeIndex + 1}
      aria-label={`Scene ${activeIndex + 1} of ${count}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-[3px] flex-1 overflow-hidden bg-orbit-ink/15">
          {i < activeIndex && <div className="h-full w-full bg-orbit-ink/70" />}
          {i === activeIndex && (
            <motion.div
              className="h-full w-full origin-left bg-orbit-ink/70"
              style={{ scaleX: progress }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
