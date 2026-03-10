'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LineReveal } from '@/components/ui/LineReveal'
import { testimonials } from '@/data/testimonials'
import { cn } from '@/lib/utils'

const carouselVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
    scale: 0.95,
  }),
}

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-8 backdrop-blur-sm">
      {/* Large quote mark */}
      <span className="absolute -top-2 left-6 text-6xl font-bold text-accent/10">&ldquo;</span>

      {/* Star rating */}
      <div className="flex items-center gap-1">
        {Array.from({ length: testimonial.rating }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </div>

      <p className="mt-4 text-lg leading-relaxed text-text-secondary italic">{testimonial.quote}</p>

      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

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
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setActive((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

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

        {/* Mobile: carousel with nav arrows */}
        <div className="mt-16 md:hidden">
          <div className="relative h-[340px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                <TestimonialCard testimonial={testimonials[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Navigation */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:border-accent/50 hover:text-accent">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > active ? 1 : -1)
                    setActive(i)
                  }}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === active ? 'w-8 bg-accent' : 'w-2 bg-border hover:bg-text-tertiary'
                  )}
                />
              ))}
            </div>
            <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all hover:border-accent/50 hover:text-accent">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="mt-16 hidden gap-8 md:grid md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.12 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
