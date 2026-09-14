'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Bot, Brain, Globe, Smartphone, Palette, type LucideIcon } from 'lucide-react'
import { services } from '@/data/services'
import { EASE } from '@/components/motion/motion-config'


/** `services.ts` stores a lucide name as a string; this is where it becomes a
 *  component. Keeping the data free of imports is what lets it be read by the
 *  classic pages, the story and the graph without any of them coupling. */
const ICONS: Record<string, LucideIcon> = {
  Bot,
  Brain,
  Globe,
  Smartphone,
  Palette,
}

interface ServicesViewProps {
  /** The slug of the service being narrated. Undefined shows the whole set. */
  focus?: string
}

/**
 * The five practices, one highlighted at a time.
 *
 * Every service is on screen throughout and the focused one lifts out of the
 * row, rather than each beat replacing the last. The visitor keeps their
 * bearings — they can see there are five, and which one of the five Orbie is
 * on — which a sequence of full-screen cards takes away.
 *
 * Names and descriptions come from `src/data/services.ts`, the same module the
 * classic `/services` page reads. This component owns layout only. That is the
 * duplication worth having: the two contexts genuinely differ in shape, and
 * neither holds a second copy of the words.
 */
export function ServicesView({ focus }: ServicesViewProps) {
  const reduce = useReducedMotion()
  const active = services.find((s) => s.slug === focus)

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-10">
      {/* The focused service, in full. */}
      <div className="min-h-[104px] text-center">
        {active && (
          <motion.div
            key={active.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <h2 className="font-syne text-2xl font-extrabold uppercase tracking-[0.08em] text-orbit-ink md:text-3xl">
              {active.title}
            </h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-relaxed text-orbit-ink/65 md:text-base">
              {active.shortDescription}
            </p>
          </motion.div>
        )}
      </div>

      {/* All five, so the visitor can see where they are in the set. */}
      <div className="flex flex-wrap items-start justify-center gap-2 sm:gap-3">
        {services.map((service, i) => {
          const Icon = ICONS[service.icon] ?? Bot
          const isActive = service.slug === focus

          return (
            <motion.div
              key={service.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{
                opacity: isActive ? 1 : 0.4,
                y: reduce ? 0 : isActive ? -6 : 0,
              }}
              transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : i * 0.06 }}
              className={`flex w-[88px] flex-col items-center gap-2 border px-2 py-3 transition-colors sm:w-[112px] ${
                isActive ? 'border-orbit-accInk/60' : 'border-orbit-ink/12'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? 'text-orbit-accInk' : 'text-orbit-ink/50'}`}
                strokeWidth={1.75}
                aria-hidden
              />
              <span className="text-center font-spacemono text-[9px] uppercase leading-tight tracking-[0.12em] text-orbit-ink/60">
                {/* The second word of a long title is enough at this size. */}
                {service.title.replace(' Development', '').replace(' & Fine-Tuning', '')}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
