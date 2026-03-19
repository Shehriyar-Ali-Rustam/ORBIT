'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const stats = [
  { target: 101, suffix: '+', label: 'Projects Delivered' },
  { target: 100, suffix: '+', label: 'Happy Clients' },
  { target: 5, suffix: '.0', label: 'Average Rating', prefix: '' },
  { target: 4, suffix: '+', label: 'Years Building' },
]

export function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface py-16">

      {/* Animated grid lines */}
      <div className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stats-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stats-grid)" className="text-accent" />
        </svg>
      </div>

      {/* Slow drifting orbs */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/10 blur-[80px]"
        animate={{ x: [0, 40, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/10 blur-[80px]"
        animate={{ x: [0, -40, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[60px]"
        animate={{ scaleX: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Scanning line */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-accent/40 to-transparent"
        animate={{ left: ['-2px', '100%', '-2px'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.12 }}
              viewport={{ once: true, margin: '-50px' }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(255,117,31,0.15)]"
            >
              {/* Corner accent marks */}
              <span className="absolute left-2 top-2 h-3 w-3 rounded-sm border-l-2 border-t-2 border-accent/30 transition-all duration-300 group-hover:border-accent/70" />
              <span className="absolute bottom-2 right-2 h-3 w-3 rounded-sm border-b-2 border-r-2 border-accent/30 transition-all duration-300 group-hover:border-accent/70" />

              {/* Gradient sweep on hover */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/0 via-accent/8 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Shimmer on hover */}
              <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                whileHover={{ translateX: '200%' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />

              <div className="relative z-10 text-center">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  className="font-mono text-4xl font-bold text-accent drop-shadow-[0_0_12px_rgba(255,117,31,0.45)] md:text-5xl"
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
