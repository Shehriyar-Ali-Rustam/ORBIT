'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { services } from '@/data/services'
import { SceneShell } from './SceneShell'

const EASE = [0.22, 1, 0.36, 1] as const

/** The five real services, shortened to fit a satellite label. */
const LABELS = services.map((s) =>
  s.title.replace(' Development', '').replace(' & Fine-Tuning', '').replace(' & Branding', '')
)

/**
 * One orb divides into five, each service taking a position on the ring. The
 * arrangement is computed rather than hand-placed, so adding a sixth service to
 * `services.ts` redistributes the ring instead of breaking the layout.
 */
export function AIScene() {
  const reduce = useReducedMotion()
  const radius = 40 // percent of the container

  return (
    <SceneShell>
      <div className="relative aspect-square w-full max-w-[340px] md:max-w-[420px]">
        <motion.div
          aria-hidden
          className="absolute inset-[10%] rounded-full border border-dashed border-orbit-ink/15"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />

        {/* The core */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orbit-acc"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        />

        {LABELS.map((label, i) => {
          // Start at the top and distribute evenly clockwise.
          const angle = (i / LABELS.length) * Math.PI * 2 - Math.PI / 2
          const x = 50 + Math.cos(angle) * radius
          const y = 50 + Math.sin(angle) * radius

          return (
            <motion.div
              key={label}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
              style={{ left: `${x}%`, top: `${y}%` }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, left: '50%', top: '50%', scale: 0.4 }}
              animate={{ opacity: 1, left: `${x}%`, top: `${y}%`, scale: 1 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.35 + i * 0.09 }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-orbit-acc" />
              <span className="whitespace-nowrap font-spacemono text-[9px] uppercase tracking-[0.16em] text-orbit-ink/70 md:text-[10px]">
                {label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </SceneShell>
  )
}
