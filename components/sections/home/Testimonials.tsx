'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LineReveal } from '@/components/ui/LineReveal'
import { testimonials } from '@/data/testimonials'

const CARD_WIDTH = 400
const CARD_GAP = 24
const SCROLL_JUMP = (CARD_WIDTH + CARD_GAP) * 3 // jump 3 cards per click

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="relative w-[360px] flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-7 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover sm:w-[400px]">
      <span className="absolute -top-2 left-6 text-6xl font-bold text-accent/10">&ldquo;</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: testimonial.rating }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary italic">{testimonial.quote}</p>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-[#0a0a0a]">
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">@{testimonial.author}</p>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {testimonial.country}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const offsetRef = useRef(0) // manual offset in px (from arrow clicks)
  const totalCards = testimonials.length

  // Doubled for seamless infinite loop
  const doubled = [...testimonials, ...testimonials]

  // Total width of one full set
  const setWidth = totalCards * (CARD_WIDTH + CARD_GAP)

  // Duration for one full set to scroll past (controls speed)
  const duration = 35 // seconds — same as Work section

  // Track progress via animation frame
  useEffect(() => {
    let raf: number
    const track = trackRef.current
    if (!track) return

    const tick = () => {
      const style = getComputedStyle(track)
      const matrix = new DOMMatrix(style.transform)
      // translateX is negative as it moves left
      const currentX = -matrix.m41 + offsetRef.current
      // How far through one set (0 to 1)
      const p = (currentX % setWidth) / setWidth
      setProgress(Math.max(0, Math.min(p, 1)))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [setWidth])

  // Arrow click: shift the container by adjusting margin
  const handleArrow = useCallback(
    (direction: 'left' | 'right') => {
      const track = trackRef.current
      if (!track) return

      // Pause briefly so user can see the jump
      setIsPaused(true)

      const delta = direction === 'left' ? SCROLL_JUMP : -SCROLL_JUMP
      offsetRef.current += delta

      // Clamp so we don't go past boundaries
      if (offsetRef.current > 0) offsetRef.current = 0
      if (offsetRef.current < -setWidth) offsetRef.current = -setWidth

      track.style.marginLeft = `${offsetRef.current}px`

      // Resume after 4s
      setTimeout(() => setIsPaused(false), 4000)
    },
    [setWidth],
  )

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary opacity-[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <LineReveal>
            <SectionLabel>Client Reviews</SectionLabel>
          </LineReveal>
          <LineReveal delay={0.1}>
            <SectionHeading className="mt-4">Trusted Worldwide</SectionHeading>
          </LineReveal>
        </div>
      </div>

      {/* Continuous marquee with controls */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="relative overflow-hidden">
          {/* Left arrow */}
          <button
            onClick={() => handleArrow('left')}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-2.5 text-text-secondary shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:text-primary sm:left-4 sm:p-3"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => handleArrow('right')}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-2.5 text-text-secondary shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:text-primary sm:right-4 sm:p-3"
            aria-label="Next reviews"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[var(--color-bg)] to-transparent sm:w-20" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[var(--color-bg)] to-transparent sm:w-20" />

          {/* Marquee track */}
          <div
            ref={trackRef}
            className="flex gap-6 transition-[margin] duration-500 ease-out"
            style={{
              animation: `marquee-left ${duration}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {doubled.map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-8 max-w-xs px-6">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-text-secondary/15">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_8px_var(--color-primary)] transition-[width] duration-150 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
