'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Heart, Award, Rocket } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We push boundaries and embrace new technologies to solve problems in smarter ways.',
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'We are honest, transparent, and always put our clients\' interests first.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards, every line of code, every pixel, every interaction.',
  },
  {
    icon: Rocket,
    title: 'Impact',
    description: 'We build solutions that create real, measurable value for our clients and their users.',
  },
]

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Values() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>Our Values</SectionLabel>
            <SectionHeading className="mt-4">What Drives Us</SectionHeading>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 text-center backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-accent/5 to-transparent" />
                <div className="relative z-10">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{value.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
