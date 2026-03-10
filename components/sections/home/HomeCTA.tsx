'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LineReveal } from '@/components/ui/LineReveal'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function HomeCTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Lamp glow effect */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 lamp-glow" />
        <div className="absolute left-1/2 top-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-accent opacity-[0.08] blur-[100px]" />
      </div>

      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-50" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true }}
        >
          <LineReveal>
            <h2 className="text-4xl font-extrabold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Ready to Build{' '}
              <span className="text-gradient">the Future?</span>
            </h2>
          </LineReveal>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          viewport={{ once: true, margin: '-50px' }}
          className="mt-6 text-lg text-text-secondary"
        >
          Tell us about your project. We respond within 24 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          viewport={{ once: true, margin: '-50px' }}
          className="mt-10"
        >
          <Link href="/contact">
            <Button variant="glow" size="lg" magnetic>
              Get in Touch
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Mini stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-10 opacity-60 md:grid-cols-4"
        >
          {[
            { value: '24h', label: 'Response Time' },
            { value: '30+', label: 'Projects' },
            { value: '5.0', label: 'Rating' },
            { value: '2+', label: 'Years' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-text-tertiary">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
