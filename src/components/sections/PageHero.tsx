'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { EASE } from '@/components/motion/motion-config'
import { cn } from '@/lib/utils'

export interface HeroMeta {
  label: string
  value: string
}

interface PageHeroProps {
  eyebrow: string
  /** Plain leading text of the headline. */
  title: string
  /** Optional second clause, set in the accent. Kept short — two or three words. */
  accent?: string
  lede: string
  /** Two to four real facts. Never round numbers; they read as invented. */
  meta?: HeroMeta[]
  className?: string
}

/**
 * The hero for every interior marketing page.
 *
 * About, Services, Portfolio and Contact previously each shipped their own
 * copy of the same component: a centred glass panel floating on a remote
 * Unsplash photograph, with a gradient-filled second clause in the headline.
 * Four files, one design, four places to fix anything.
 *
 * This replaces all four. Three things changed and each was a real defect:
 *
 *  - The photograph is gone. It was generic stock, it cost a remote fetch on
 *    first paint, and its scrims were pinned to `rgba(10,10,10,…)` literals,
 *    so in light mode the page opened with a dark slab across the top.
 *  - The glass panel is gone. Blurring a backdrop that carries no information
 *    is decoration, and `backdrop-blur-xl` across a full-width hero is one of
 *    the more expensive things you can ask a phone GPU to do on load.
 *  - The layout is asymmetric. Copy holds the left seven columns; the facts
 *    sit right, against a hairline. Centred headline over a dimmed photo is
 *    the single most recognisable generated-landing-page shape there is.
 */
export function PageHero({ eyebrow, title, accent, lede, meta, className }: PageHeroProps) {
  const reduce = useReducedMotion()

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay },
  })

  return (
    <section
      className={cn(
        'relative border-b border-border bg-background pb-16 pt-32 md:pb-20 md:pt-40',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div {...rise(0)}>
              <SectionLabel>{eyebrow}</SectionLabel>
            </motion.div>

            <motion.h1
              {...rise(0.07)}
              className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-text-primary sm:text-[3.25rem] md:text-[4rem]"
            >
              {title}
              {accent && (
                <>
                  {' '}
                  <span className="text-accent">{accent}</span>
                </>
              )}
            </motion.h1>
          </div>

          <div className="flex flex-col justify-end lg:col-span-5">
            <motion.p
              {...rise(0.14)}
              className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-text-secondary"
            >
              {lede}
            </motion.p>

            {meta && meta.length > 0 && (
              <motion.dl
                {...rise(0.2)}
                className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-6 sm:grid-cols-3 lg:grid-cols-2"
              >
                {meta.map((item) => (
                  <div key={item.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 font-mono text-lg font-medium tabular-nums text-text-primary">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
