'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PROCESS } from '@/data/landing'
import { SceneShell } from './SceneShell'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * The four real process steps, drawn as a path being travelled rather than four
 * cards in a row. The connecting line strokes on ahead of each marker, so the
 * scene reads as a journey with a direction instead of a list with numbers.
 */
export function JourneyScene() {
  const reduce = useReducedMotion()

  return (
    <SceneShell>
      <div className="w-full max-w-2xl">
        <div className="relative">
          {/* The path. Strokes left to right under the markers. */}
          <motion.div
            aria-hidden
            className="absolute left-0 right-0 top-[9px] h-px origin-left bg-orbit-ink/20"
            initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
            animate={reduce ? { opacity: 1 } : { scaleX: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
          />

          <ol className="relative flex justify-between">
            {PROCESS.map((step, i) => (
              <motion.li
                key={step.n}
                className="flex w-1/4 flex-col items-center px-1 text-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.25 + i * 0.28 }}
              >
                <span
                  className={`h-[19px] w-[19px] rounded-full border-2 ${
                    i === PROCESS.length - 1
                      ? 'border-orbit-acc bg-orbit-acc'
                      : 'border-orbit-ink/30 bg-orbit-canvas'
                  }`}
                />
                <span className="mt-4 font-spacemono text-[9px] uppercase tracking-[0.18em] text-orbit-ink/45">
                  {step.n}
                </span>
                <span className="mt-1.5 font-grotesk text-sm font-semibold text-orbit-ink md:text-base">
                  {step.title}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </SceneShell>
  )
}
