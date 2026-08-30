'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SceneShell } from './SceneShell'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * The mark draws itself: the orbit ring strokes on along its own path while the
 * satellite settles. It is the company's logo animating into being, which is the
 * one thing that only this brand can open with.
 */
export function WelcomeScene() {
  const reduce = useReducedMotion()

  return (
    <SceneShell>
      <div className="flex flex-col items-center text-center">
        <motion.svg
          viewBox="0 0 32 32"
          className="h-24 w-24 text-orbit-ink md:h-32 md:w-32"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <motion.circle
            cx="17.5"
            cy="18"
            r="10.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.9"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
          />
          <circle cx="9" cy="8.5" r="6.4" fill="rgb(var(--canvas-rgb))" />
          <motion.circle
            cx="9"
            cy="8.5"
            r="3.6"
            fill="none"
            stroke="rgb(var(--acc-rgb))"
            strokeWidth="3.2"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: '9px 8.5px' }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
          />
        </motion.svg>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 1.2 }}
          className="mt-8 flex flex-col items-center leading-none"
        >
          <span className="font-syne text-3xl font-extrabold uppercase tracking-[0.22em] text-orbit-ink md:text-4xl">
            Orbit
          </span>
          <span className="mt-2 font-spacemono text-[10px] uppercase tracking-[0.3em] text-orbit-ink/60">
            Innovations
          </span>
        </motion.div>
      </div>
    </SceneShell>
  )
}
