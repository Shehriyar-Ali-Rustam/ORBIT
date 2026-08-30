'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE, STAGGER_STEP } from './motion-config'

type Direction = 'up' | 'left' | 'right' | 'fade'

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 16 },
  left: { x: -20 },
  right: { x: 20 },
  fade: {},
}

interface RevealProps {
  children: ReactNode
  /** Which way the block travels in from. Default `up`. */
  from?: Direction
  delay?: number
  /** How much of the block must be on screen before it fires. */
  amount?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * The single scroll reveal on the marketing site.
 *
 * Travel is 16px, not the 40px the old sections used. Large offsets read as
 * "animated"; small ones read as the page settling, which is the point — the
 * motion should be noticed only if you look for it.
 *
 * Under `prefers-reduced-motion` the transform is dropped entirely rather than
 * shortened, so nothing moves for a visitor who asked for nothing to move.
 */
export function Reveal({
  children,
  from = 'up',
  delay = 0,
  amount = 0.25,
  className,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...(reduce ? {} : OFFSET[from]) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

const parentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_STEP } },
}

interface StaggerProps {
  children: ReactNode
  className?: string
  amount?: number
  as?: 'div' | 'ul' | 'ol' | 'dl'
}

/**
 * Parent for a staggered group. Children must be `StaggerItem` and must live
 * in this same client component tree — Framer resolves variants by walking the
 * React tree, so a server component in between silently breaks the cascade.
 */
export function Stagger({ children, className, amount = 0.2, as = 'div' }: StaggerProps) {
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={parentVariants}
    >
      {children}
    </Tag>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article' | 'dd'
}

export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]

  const variants: Variants = {
    hidden: { opacity: 0, ...(reduce ? {} : { y: 14 }) },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  }

  return (
    <Tag className={className} variants={variants}>
      {children}
    </Tag>
  )
}
