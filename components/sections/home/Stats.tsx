'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const stats = [
  { target: 30, suffix: '+', label: 'Projects Delivered' },
  { target: 15, suffix: '+', label: 'Happy Clients' },
  { target: 5, suffix: '.0', label: 'Average Rating', prefix: '' },
  { target: 2, suffix: '+', label: 'Years Building' },
]

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Stats() {
  return (
    <section className="border-y border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-50px' }}
              className="text-center"
            >
              <AnimatedCounter
                target={stat.target}
                suffix={stat.suffix}
                prefix={stat.prefix}
                className="text-4xl font-black text-orange md:text-5xl"
              />
              <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
