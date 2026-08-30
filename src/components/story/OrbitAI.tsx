'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface OrbitAIProps {
  /** Dimmed and still when the story is paused. */
  isPaused: boolean
  className?: string
}

/**
 * Orbit AI, the narrator.
 *
 * Built on the existing `OrbitMark` geometry rather than a new asset, so the
 * narrator is recognisably the company's own mark: the ring inherits the ink
 * colour and flips with the theme, the satellite stays brand orange.
 *
 * With no audio there is no amplitude to react to, so the orb breathes on a
 * slow loop instead. When narration ships, this is the one component that
 * changes: an `AnalyserNode` on the audio element drives `scale` and the halo
 * opacity, and the loop below becomes the muted fallback.
 */
export function OrbitAI({ isPaused, className = '' }: OrbitAIProps) {
  const reduce = useReducedMotion()
  const alive = !isPaused && !reduce

  return (
    <div className={`relative h-14 w-14 ${className}`} aria-hidden>
      {/* Halo. Opacity only, so it composites cheaply. */}
      <motion.span
        className="absolute inset-0 rounded-full bg-orbit-acc/20 blur-md"
        animate={alive ? { opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.06, 0.9] } : { opacity: 0.3, scale: 1 }}
        transition={alive ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      />

      <motion.svg
        viewBox="0 0 32 32"
        className="relative h-full w-full text-orbit-ink"
        animate={alive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={alive ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      >
        <circle cx="17.5" cy="18" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
        {/* Knocks the ring out behind the satellite so they read as two bodies. */}
        <circle cx="9" cy="8.5" r="6.4" fill="rgb(var(--canvas-rgb))" />
        <motion.circle
          cx="9"
          cy="8.5"
          r="3.6"
          fill="none"
          stroke="rgb(var(--acc-rgb))"
          strokeWidth="3.2"
          animate={alive ? { opacity: [0.75, 1, 0.75] } : { opacity: 0.8 }}
          transition={alive ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        />
      </motion.svg>
    </div>
  )
}
