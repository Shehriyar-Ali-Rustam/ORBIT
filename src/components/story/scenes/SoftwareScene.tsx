'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '@/data/portfolio'
import { SceneShell } from './SceneShell'

const EASE = [0.22, 1, 0.36, 1] as const

/** Real shipped work, not stock imagery. Four covers already in the repo. */
const PICKS = projects.filter((p) => p.featured).slice(0, 4)

/**
 * The covers arc into place along an ellipse rather than sliding on a straight
 * line, so the motion says "orbit" without needing a literal ring drawn behind
 * it. Each card is offset on its own arc; the group settles into a loose fan.
 */
export function SoftwareScene() {
  const reduce = useReducedMotion()

  return (
    <SceneShell>
      <div className="flex w-full max-w-3xl items-center justify-center">
        {PICKS.map((project, i) => {
          // Spread the fan symmetrically around centre.
          const offset = i - (PICKS.length - 1) / 2
          const rotate = offset * 7
          const y = Math.abs(offset) * 14

          return (
            <motion.div
              key={project.id}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: offset * 90, y: y + 70, rotate: rotate * 2.5, scale: 0.85 }
              }
              animate={{ opacity: 1, x: 0, y, rotate, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.11 }}
              className="relative -mx-3 w-[27%] max-w-[168px] shrink-0 md:-mx-4 md:w-[24%]"
              style={{ zIndex: PICKS.length - Math.abs(offset) }}
            >
              <div className="relative aspect-[3/4] overflow-hidden border border-orbit-ink/12 bg-orbit-canvas shadow-[0_10px_30px_rgb(13_13_13_/_0.10)]">
                <Image
                  src={project.coverImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 30vw, 180px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 truncate text-center font-spacemono text-[9px] uppercase tracking-[0.16em] text-orbit-ink/55">
                {project.category}
              </p>
            </motion.div>
          )
        })}
      </div>
    </SceneShell>
  )
}
