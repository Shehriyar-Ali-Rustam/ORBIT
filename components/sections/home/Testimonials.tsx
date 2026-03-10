'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LineReveal } from '@/components/ui/LineReveal'
import { testimonials } from '@/data/testimonials'

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
          <p className="text-sm font-semibold text-text-primary">{testimonial.author}</p>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  // Triplicate for seamless infinite loop
  const looped = [...testimonials, ...testimonials, ...testimonials]

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

      {/* Single-row marquee — full width */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--color-bg)] to-transparent sm:w-24" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--color-bg)] to-transparent sm:w-24" />

          <div
            className="flex gap-6 hover:[animation-play-state:paused]"
            style={{ animation: 'marquee-left 45s linear infinite' }}
          >
            {looped.map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
