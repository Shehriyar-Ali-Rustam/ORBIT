'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'

const steps = [
  { number: '01', title: 'Discover', description: 'We learn about your business, goals, and requirements through in-depth consultation.' },
  { number: '02', title: 'Design', description: 'We create wireframes, prototypes, and technical architecture tailored to your needs.' },
  { number: '03', title: 'Build', description: 'Our team develops your solution with agile methodology and regular progress updates.' },
  { number: '04', title: 'Launch', description: 'We deploy, test, and optimize your product for the best possible performance.' },
]

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Process() {
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
            <SectionLabel>Our Process</SectionLabel>
            <SectionHeading className="mt-4">How We Work</SectionHeading>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              viewport={{ once: true, margin: '-50px' }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-0.5 w-full bg-orange/20 md:block" />
              )}
              <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange text-sm font-bold text-white">
                {step.number}
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
