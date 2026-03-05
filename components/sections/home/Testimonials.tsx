'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
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
    <div className="rounded-xl border border-border bg-background p-6">
      <span className="text-4xl font-bold text-orange">&ldquo;</span>
      <p className="mt-2 leading-relaxed text-text-secondary">{testimonial.quote}</p>
      <div className="mt-6 h-px w-full bg-orange/20" />
      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: testimonial.rating }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-orange text-orange" />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-sm font-bold text-orange">
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{testimonial.author}</p>
          <p className="text-xs text-text-tertiary">
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

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="section-padding bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <LineReveal>
            <SectionLabel>Client Reviews</SectionLabel>
          </LineReveal>
          <LineReveal delay={0.1}>
            <SectionHeading className="mt-4">Trusted Worldwide</SectionHeading>
          </LineReveal>
        </div>

        {/* Mobile: auto-rotating carousel */}
        <div className="mt-16 md:hidden">
          <div className="relative h-[320px] overflow-hidden">
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
          {/* Dot indicators */}
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > active ? 1 : -1)
                  setActive(i)
                }}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === active ? 'w-6 bg-orange' : 'w-2 bg-border'
                )}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 3-column grid with spring animations */}
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
