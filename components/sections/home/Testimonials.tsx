'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LineReveal } from '@/components/ui/LineReveal'
import { testimonials } from '@/data/testimonials'

const STACK = 4
const DRAG_THRESHOLD = 80
const TOTAL = testimonials.length

// Visual config per depth (0 = top card, 3 = furthest back)
const DEPTH_CFG = [
  { rotate: 1,  y: 0,  scale: 1,    zIndex: 40, opacity: 1 },
  { rotate: -6, y: 18, scale: 0.96, zIndex: 30, opacity: 1 },
  { rotate: 4,  y: 36, scale: 0.92, zIndex: 20, opacity: 1 },
  { rotate: -3, y: 54, scale: 0.88, zIndex: 10, opacity: 1 },
]

type Testimonial = (typeof testimonials)[0]

function FlipCard({
  testimonial,
  depth,
  isTop,
  onDismiss,
}: {
  testimonial: Testimonial
  depth: number
  isTop: boolean
  onDismiss: (dir: number) => void
}) {
  const cfg = DEPTH_CFG[Math.min(depth, DEPTH_CFG.length - 1)]
  const x = useMotionValue(0)
  const dragRotate = useTransform(x, [-300, 300], [-20, 20])

  // When this card becomes the top card again (e.g. cycling back), reset x
  useEffect(() => {
    if (isTop) {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 28 })
    }
  }, [isTop, x])

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const ox = info.offset.x
    const vx = info.velocity.x
    // Dismiss if dragged far enough OR flicked fast enough
    if (ox > DRAG_THRESHOLD || vx > 500) {
      animate(x, 900, { duration: 0.3, ease: [0.32, 0, 0.67, 0] })
      setTimeout(() => onDismiss(1), 220)
    } else if (ox < -DRAG_THRESHOLD || vx < -500) {
      animate(x, -900, { duration: 0.3, ease: [0.32, 0, 0.67, 0] })
      setTimeout(() => onDismiss(-1), 220)
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 })
    }
  }

  return (
    <motion.div
      className="absolute left-1/2 w-full max-w-[560px] touch-none"
      style={{
        x: isTop ? x : undefined,
        rotate: isTop ? dragRotate : undefined,
        zIndex: cfg.zIndex,
        translateX: '-50%',
      }}
      animate={{
        y: cfg.y,
        scale: cfg.scale,
        opacity: cfg.opacity,
        rotate: isTop ? 0 : cfg.rotate,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* Card */}
      <div
        className="relative select-none overflow-hidden rounded-3xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-7 shadow-[0_16px_48px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-shadow duration-300"
        style={{ cursor: isTop ? 'grab' : 'default' }}
      >
        {/* Decorative quote mark */}
        <span className="pointer-events-none absolute right-5 top-2 font-serif text-9xl font-bold leading-none text-accent/[0.07] dark:text-accent/[0.1] select-none">
          &rdquo;
        </span>

        {/* Orange accent line at top */}
        <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

        {/* Stars */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
          ))}
        </div>

        {/* Review text */}
        <p className="relative mt-4 text-sm leading-relaxed text-text-secondary italic line-clamp-6">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-accent/25 to-transparent" />

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-[0_0_16px_rgba(255,117,31,0.4)]">
            {testimonial.author.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text-primary">
              @{testimonial.author}
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              {testimonial.country}
            </p>
          </div>
          {isTop && (
            <span className="flex-shrink-0 text-[11px] text-text-tertiary/50 select-none">
              swipe →
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function Testimonials() {
  const [topIdx, setTopIdx] = useState(0)
  const [busy, setBusy] = useState(false)

  // Always show STACK cards from topIdx onward
  const deck = Array.from({ length: STACK }, (_, i) => (topIdx + i) % TOTAL)

  const shift = useCallback(
    (dir: number) => {
      if (busy) return
      setBusy(true)
      setTopIdx((prev) => (prev + dir + TOTAL) % TOTAL)
      setTimeout(() => setBusy(false), 420)
    },
    [busy],
  )

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-accent/[0.05] blur-[130px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-20 bottom-1/4 h-[350px] w-[350px] rounded-full bg-accent/[0.04] blur-[110px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <LineReveal>
            <SectionLabel>Client Reviews</SectionLabel>
          </LineReveal>
          <LineReveal delay={0.1}>
            <SectionHeading className="mt-4">Trusted Worldwide</SectionHeading>
          </LineReveal>
          <p className="mt-2 text-sm text-text-tertiary">
            {topIdx + 1} <span className="text-text-tertiary/50">of</span> {TOTAL} reviews
          </p>
        </div>

        {/* ── Stacked card deck ── */}
        <div className="relative mx-auto mt-14" style={{ height: 440 }}>
          {/* Render bottom → top so top card gets pointer events */}
          {[...deck].reverse().map((tIdx, reversedDepth) => {
            const depth = STACK - 1 - reversedDepth
            return (
              <FlipCard
                key={tIdx}
                testimonial={testimonials[tIdx]}
                depth={depth}
                isTop={depth === 0}
                onDismiss={shift}
              />
            )
          })}
        </div>

        {/* ── Controls ── */}
        <div className="mt-10 flex flex-col items-center gap-5">
          {/* Progress bar */}
          <div className="relative h-1 w-full max-w-xs overflow-hidden rounded-full bg-text-tertiary/[0.12]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent/80 via-accent to-accent/80 shadow-[0_0_8px_rgba(255,117,31,0.6)]"
              animate={{ width: `${((topIdx + 1) / TOTAL) * 100}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            />
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => shift(-1)}
              disabled={busy}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-3 text-text-secondary shadow-md transition-colors hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <span className="font-mono text-xs text-text-tertiary/60 tabular-nums">
              {String(topIdx + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
            </span>

            <motion.button
              onClick={() => shift(1)}
              disabled={busy}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-3 text-text-secondary shadow-md transition-colors hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
