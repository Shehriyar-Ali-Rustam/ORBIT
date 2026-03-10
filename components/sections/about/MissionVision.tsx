'use client'

import { motion } from 'framer-motion'
import { Target, Eye } from 'lucide-react'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function MissionVision() {
  return (
    <section className="section-padding bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-8 backdrop-blur-sm"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-accent/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-text-primary">Our Mission</h3>
              <p className="mt-4 leading-relaxed text-text-secondary">
                To deliver world-class AI-powered software solutions that empower businesses to grow,
                innovate, and compete globally, regardless of their size or location.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            viewport={{ once: true, margin: '-50px' }}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-8 backdrop-blur-sm"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-accent/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-text-primary">Our Vision</h3>
              <p className="mt-4 leading-relaxed text-text-secondary">
                To become a globally recognized technology company from Pakistan, proving that
                innovation knows no borders and that the best solutions can come from anywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
