'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { OptionCard } from '@/data/orbie-graph'

const EASE = [0.22, 1, 0.36, 1] as const

interface CrossroadsViewProps {
  options: OptionCard[]
  /** Only true once the node has finished narrating. */
  ready: boolean
  onPick(option: OptionCard): void
}

/**
 * The choice. Everything in the tour returns here, so it is the one view that
 * must never be a dead end.
 *
 * Two decisions worth knowing:
 *
 * The cards do not appear until the node has finished narrating. Offering a
 * choice while Orbie is still describing it means the visitor reads and
 * listens at once and does neither — and it is why `hold` narrates first and
 * parks second rather than holding from the start.
 *
 * Each card carries the classic route it mirrors as a real `<a>`. Someone who
 * would rather read the page than be walked through it can leave, which costs
 * nothing and is the difference between a guided tour and a captive one. It
 * also lets Next prefetch the destination.
 */
export function CrossroadsView({ options, ready, onPick }: CrossroadsViewProps) {
  const reduce = useReducedMotion()

  return (
    <div className="flex w-full max-w-2xl flex-col items-center">
      <motion.div
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
        initial="hidden"
        animate={ready ? 'shown' : 'hidden'}
        variants={{ shown: { transition: { staggerChildren: 0.07 } } }}
      >
        {options.map((option) => (
          <motion.div
            key={option.id}
            variants={{
              hidden: { opacity: 0, ...(reduce ? {} : { y: 12 }) },
              shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
            }}
            // `hidden` leaves the cards in the layout but untouchable, so the
            // view does not reflow when they arrive.
            style={{ pointerEvents: ready ? 'auto' : 'none' }}
          >
            <button
              type="button"
              onClick={() => onPick(option)}
              className="group flex w-full items-start justify-between gap-4 border border-orbit-ink/15 bg-orbit-canvas px-5 py-4 text-left transition-colors hover:border-orbit-accInk/60"
            >
              <span className="flex flex-col gap-1">
                <span className="font-grotesk text-base font-semibold text-orbit-ink">
                  {option.label}
                </span>
                {option.hint && (
                  <span className="font-spacemono text-[10px] uppercase tracking-[0.16em] text-orbit-ink/50">
                    {option.hint}
                  </span>
                )}
              </span>
              <ArrowUpRight
                className="mt-0.5 h-4 w-4 shrink-0 text-orbit-ink/35 transition-colors group-hover:text-orbit-accInk"
                aria-hidden
              />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* The way out of the tour, for anyone who would rather just read. */}
      {ready && options.some((o) => o.href) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          <span className="font-spacemono text-[10px] uppercase tracking-[0.18em] text-orbit-ink/40">
            or read the page
          </span>
          {options
            .filter((o) => o.href)
            .map((o) => (
              <Link
                key={o.id}
                href={o.href!}
                className="font-spacemono text-[10px] uppercase tracking-[0.18em] text-orbit-ink/55 underline-offset-4 transition-colors hover:text-orbit-accInk hover:underline"
              >
                {o.label}
              </Link>
            ))}
        </motion.div>
      )}
    </div>
  )
}
