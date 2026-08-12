'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Signature easing for the whole landing page. Do not vary it per-component. */
export const DS_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const variants = {
  up: { opacity: 0, y: 40 },
  down: { opacity: 0, y: -40 },
  left: { opacity: 0, x: -40 },
  right: { opacity: 0, x: 40 },
  scale: { opacity: 0, scale: 0.92 },
  fade: { opacity: 0 },
} as const

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  from?: keyof typeof variants
  duration?: number
  amount?: number
  once?: boolean
  className?: string
}

/**
 * Nothing on this page just appears — every content block enters through here.
 * Stagger lists with `delay={i * 0.05}`, capped at 0.3s for long lists.
 */
export default function MotionReveal({
  children,
  delay = 0,
  y,
  from = 'up',
  duration = 0.6,
  amount = 0.2,
  once = true,
  className = '',
}: Props) {
  const initial = y != null ? { opacity: 0, y } : variants[from] || variants.up

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, ease: DS_EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
