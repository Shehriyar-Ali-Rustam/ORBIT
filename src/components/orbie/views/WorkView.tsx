'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '@/data/portfolio'
import { EASE } from '@/components/motion/motion-config'


/** Real shipped work with local cover images, not stock. */
const PICKS = projects.filter((p) => p.featured).slice(0, 4)

/**
 * The work, dealt out like a hand of cards.
 *
 * The spec asks for exactly that image, and it is also the honest shape for
 * this content: four covers arriving on an arc reads as *a few things, shown
 * to you*, where a grid reads as a catalogue. Each card lands on its own
 * delay, so they deal rather than appear.
 *
 * Covers are the existing local `.webp` files from `src/data/portfolio.ts` —
 * the same ones `/portfolio` renders. No remote images: this is on the path a
 * first-time visitor sees, and a stock-photo fetch there is both slow and
 * exactly the thing the site was rebuilt to stop doing.
 */
export function WorkView() {
  const reduce = useReducedMotion()

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8">
      <div className="flex items-start justify-center">
        {PICKS.map((project, i) => {
          const offset = i - (PICKS.length - 1) / 2
          const rotate = offset * 7
          const y = Math.abs(offset) * 14

          return (
            <motion.div
              key={project.id}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: offset * -60, y: y + 80, rotate: rotate * 3, scale: 0.8 }
              }
              animate={{ opacity: 1, x: 0, y, rotate, scale: 1 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.15 + i * 0.13 }}
              className="relative -mx-3 w-[27%] max-w-[168px] shrink-0 md:-mx-4 md:w-[24%]"
              style={{ zIndex: PICKS.length - Math.abs(offset) }}
            >
              <div className="relative aspect-[3/4] overflow-hidden border border-orbit-ink/12 bg-orbit-canvas">
                <Image
                  src={project.coverImage}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 30vw, 180px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 truncate text-center font-spacemono text-[9px] uppercase tracking-[0.14em] text-orbit-ink/55">
                {project.title}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
