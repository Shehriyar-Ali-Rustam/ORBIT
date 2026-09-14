'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { founders } from '@/data/founders'
import { CARD } from '@/data/landing'
import { EASE } from '@/components/motion/motion-config'


/**
 * The people.
 *
 * Faces rather than a paragraph, because the claim this section makes — that
 * the people who scope your project are the people who write it — is the kind
 * a prospective client believes from names and photographs and discounts from
 * prose. Three founders, named, with the roles they actually hold.
 *
 * Everything here comes from `src/data/founders.ts`, the same module `/about`
 * and `/team` read. Note that the two non-founder team members are flagged in
 * that file as placeholders with no photo and a dead LinkedIn — which is
 * exactly why this view shows `founders` and not `fullTeam`.
 */
export function AboutView() {
  const reduce = useReducedMotion()

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-9">
      <div className="flex items-start justify-center gap-4 sm:gap-8">
        {founders.map((person, i) => (
          <motion.div
            key={person.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.12 + i * 0.12 }}
            className="flex w-[92px] flex-col items-center gap-3 sm:w-[120px]"
          >
            <div className="relative aspect-square w-full overflow-hidden border border-orbit-ink/12 bg-orbit-canvas">
              <Image
                src={person.photo}
                alt=""
                fill
                sizes="(max-width: 640px) 92px, 120px"
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <p className="font-grotesk text-[13px] font-semibold leading-tight text-orbit-ink">
                {person.name}
              </p>
              <p className="mt-1 font-spacemono text-[9px] uppercase tracking-[0.14em] text-orbit-ink/50">
                {person.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="font-spacemono text-[10px] uppercase tracking-[0.2em] text-orbit-ink/45"
      >
        {CARD.location}
      </motion.p>
    </div>
  )
}
