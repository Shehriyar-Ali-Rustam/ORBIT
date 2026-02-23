'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { testimonials } from '@/data/testimonials'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Testimonials() {
  return (
    <section className="section-padding bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>Client Reviews</SectionLabel>
            <SectionHeading className="mt-4">Trusted Worldwide</SectionHeading>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-50px' }}
              className="rounded-xl border border-border bg-background p-6"
            >
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
                  <p className="text-xs text-text-tertiary">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
