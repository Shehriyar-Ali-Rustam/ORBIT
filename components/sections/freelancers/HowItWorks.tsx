'use client'

import { motion } from 'framer-motion'
import { Search, MessageCircle, Handshake } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'

const steps = [
  { icon: Search, title: 'Browse', description: 'Explore our curated network and find the perfect match for your project.' },
  { icon: MessageCircle, title: 'Connect', description: 'Reach out directly to discuss your requirements, timeline, and budget.' },
  { icon: Handshake, title: 'Hire', description: 'Start working together with clear milestones and transparent communication.' },
]

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function HowItWorks() {
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
            <SectionLabel>How It Works</SectionLabel>
            <SectionHeading className="mt-4">Three Simple Steps</SectionHeading>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-50px' }}
              className="text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-1">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
