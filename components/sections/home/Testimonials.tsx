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
const CARD_HEIGHT = 320

// Each card cycles through a distinct color theme
const THEMES = [
  { a: '#FF751F', b: '#FF4D00', mid: '#FF9A5C' }, // orange  (brand)
  { a: '#8B5CF6', b: '#6D28D9', mid: '#A78BFA' }, // purple
  { a: '#06B6D4', b: '#0EA5E9', mid: '#67E8F9' }, // cyan
  { a: '#10B981', b: '#059669', mid: '#6EE7B7' }, // emerald
  { a: '#F59E0B', b: '#D97706', mid: '#FCD34D' }, // amber
  { a: '#EC4899', b: '#BE185D', mid: '#F9A8D4' }, // pink
]

const DEPTH_CFG = [
  { rotate: 1,  y: 0,  scale: 1,    zIndex: 40 },
  { rotate: -5, y: 10, scale: 0.97, zIndex: 30 },
  { rotate: 4,  y: 20, scale: 0.94, zIndex: 20 },
  { rotate: -3, y: 30, scale: 0.91, zIndex: 10 },
]

type Testimonial = (typeof testimonials)[0]

function FlipCard({
  testimonial,
  themeIdx,
  depth,
  isTop,
  onDismiss,
}: {
  testimonial: Testimonial
  themeIdx: number
  depth: number
  isTop: boolean
  onDismiss: (dir: number) => void
}) {
  const cfg = DEPTH_CFG[Math.min(depth, DEPTH_CFG.length - 1)]
  const theme = THEMES[themeIdx % THEMES.length]
  const x = useMotionValue(0)
  const dragRotate = useTransform(x, [-300, 300], [-20, 20])

  useEffect(() => {
    if (isTop) animate(x, 0, { type: 'spring', stiffness: 300, damping: 28 })
  }, [isTop, x])

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const { x: ox } = info.offset
    const { x: vx } = info.velocity
    if (ox > DRAG_THRESHOLD || vx > 500) {
      animate(x, 900, { duration: 0.28, ease: [0.32, 0, 0.67, 0] })
      setTimeout(() => onDismiss(1), 220)
    } else if (ox < -DRAG_THRESHOLD || vx < -500) {
      animate(x, -900, { duration: 0.28, ease: [0.32, 0, 0.67, 0] })
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
      animate={{ y: cfg.y, scale: cfg.scale, rotate: isTop ? 0 : cfg.rotate }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* ── Card shell ── */}
      <div
        className="relative flex select-none flex-col overflow-hidden rounded-3xl"
        style={{
          height: CARD_HEIGHT,
          cursor: isTop ? 'grab' : 'default',
          background: '#111111',
          border: `1px solid ${theme.a}35`,
          boxShadow: `0 0 0 1px ${theme.a}20, 0 24px 64px rgba(0,0,0,0.50), 0 0 80px ${theme.a}18`,
        }}
      >
        {/* ── Animated gradient orbs (background) ── */}
        <motion.div
          className="pointer-events-none absolute rounded-full blur-[70px]"
          style={{
            width: 200, height: 200,
            top: -60, right: -40,
            background: `radial-gradient(circle, ${theme.a}55, transparent 70%)`,
          }}
          animate={isTop ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute rounded-full blur-[80px]"
          style={{
            width: 180, height: 180,
            bottom: -50, left: -40,
            background: `radial-gradient(circle, ${theme.b}40, transparent 70%)`,
          }}
          animate={isTop ? { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] } : {}}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* ── Animated top gradient bar ── */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.a}, ${theme.mid}, ${theme.b}, transparent)` }}
          animate={isTop ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.4 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Subtle mesh overlay ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 85% 15%, ${theme.a}12 0%, transparent 55%),
                         radial-gradient(ellipse at 15% 85%, ${theme.b}0a 0%, transparent 50%)`,
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-1 flex-col p-7">
          {/* Stars */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4" style={{ fill: theme.a, color: theme.a }} />
            ))}
          </div>

          {/* Big decorative quote */}
          <span
            className="pointer-events-none absolute right-6 top-3 select-none font-serif text-8xl font-bold leading-none"
            style={{ color: `${theme.a}15` }}
          >
            &rdquo;
          </span>

          {/* Review text */}
          <p className="mt-4 flex-1 overflow-hidden text-sm leading-relaxed text-white/75 italic line-clamp-[6]">
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          {/* Divider */}
          <div
            className="mt-auto mb-4 h-px w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.a}35, transparent)` }}
          />

          {/* Author row */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${theme.a}, ${theme.b})`,
                boxShadow: `0 0 20px ${theme.a}50`,
              }}
            >
              {testimonial.author.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white/90">
                @{testimonial.author}
              </p>
              <p
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: theme.a }}
              >
                {testimonial.country}
              </p>
            </div>
            {isTop && (
              <span className="flex-shrink-0 text-[11px] text-white/30 select-none">
                swipe →
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Testimonials() {
  const [topIdx, setTopIdx] = useState(0)
  const [busy, setBusy] = useState(false)

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

  const currentTheme = THEMES[topIdx % THEMES.length]

  return (
    <section className="section-padding relative overflow-hidden bg-[var(--color-surface)]">
      {/* Section background */}
      <div className="pointer-events-none absolute inset-0">
        {/* In light mode: add a gentle inward vignette so dark cards feel intentional */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-surface)] to-[var(--color-bg)]" />
        <motion.div
          className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{ background: `radial-gradient(circle, ${currentTheme.a}18, transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${currentTheme.b}14, transparent 70%)` }}
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
            {topIdx + 1}{' '}
            <span className="text-text-tertiary/40">of</span>{' '}
            {TOTAL} reviews
          </p>
        </div>

        {/* Card stack */}
        <div className="relative mx-auto mt-14" style={{ height: CARD_HEIGHT + 60 }}>
          {[...deck].reverse().map((tIdx, reversedDepth) => {
            const depth = STACK - 1 - reversedDepth
            return (
              <FlipCard
                key={tIdx}
                testimonial={testimonials[tIdx]}
                themeIdx={tIdx}
                depth={depth}
                isTop={depth === 0}
                onDismiss={shift}
              />
            )
          })}
        </div>

        {/* Controls */}
        <div className="mt-10 flex flex-col items-center gap-5">
          {/* Progress bar */}
          <div className="relative h-1 w-full max-w-xs overflow-hidden rounded-full bg-[var(--color-card-border)]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${currentTheme.b}, ${currentTheme.a}, ${currentTheme.mid})`,
                boxShadow: `0 0 10px ${currentTheme.a}80`,
              }}
              animate={{ width: `${((topIdx + 1) / TOTAL) * 100}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            />
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => shift(-1)}
              disabled={busy}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-3 text-text-secondary shadow-md transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              style={{ '--hover-border': currentTheme.a } as React.CSSProperties}
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <span className="font-mono text-xs tabular-nums text-text-tertiary">
              {String(topIdx + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
            </span>

            <motion.button
              onClick={() => shift(1)}
              disabled={busy}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-3 text-text-secondary shadow-md transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
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
