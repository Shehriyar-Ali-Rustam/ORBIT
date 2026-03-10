'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const stats = [
  { target: 30, suffix: '+', label: 'Projects Delivered' },
  { target: 15, suffix: '+', label: 'Happy Clients' },
  { target: 5, suffix: '.0', label: 'Average Rating', prefix: '' },
  { target: 2, suffix: '+', label: 'Years Building' },
]

export function Stats() {
  return (
    <section className="relative border-y border-border bg-surface py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.12 }}
              viewport={{ once: true, margin: '-50px' }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 transition-all duration-300 hover:border-accent/30"
            >
              {/* Gradient sweep on hover */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 text-center">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  className="font-mono text-4xl font-bold text-accent md:text-5xl"
                />
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-text-tertiary">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
