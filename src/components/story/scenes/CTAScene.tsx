'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import { SceneShell } from './SceneShell'

const EASE = [0.22, 1, 0.36, 1] as const

interface CTASceneProps {
  onExplore(): void
  onReplay(): void
  onContact(): void
}

/**
 * Both doors, equally weighted.
 *
 * "Explore the site" is not a lesser option styled as an afterthought: a
 * visitor who wants to browse has told you something useful, and making that
 * the grey link is how a tour turns into a funnel nobody asked to be in.
 */
export function CTAScene({ onExplore, onReplay, onContact }: CTASceneProps) {
  const reduce = useReducedMotion()

  return (
    <SceneShell>
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex w-full max-w-md flex-col items-center text-center"
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/contact" onClick={onContact} className="btn-primary">
            Let&apos;s talk
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </Link>
          <button type="button" onClick={onExplore} className="btn-ghost">
            Explore the site
          </button>
        </div>

        <button
          type="button"
          onClick={onReplay}
          className="mt-8 inline-flex items-center gap-2 font-spacemono text-[10px] uppercase tracking-[0.2em] text-orbit-ink/55 transition-colors hover:text-orbit-accInk"
        >
          <RotateCcw className="h-3 w-3" aria-hidden />
          Watch again
        </button>
      </motion.div>
    </SceneShell>
  )
}
