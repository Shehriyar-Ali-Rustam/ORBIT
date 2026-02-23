'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function OurStory() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>Our Story</SectionLabel>
            <SectionHeading className="mt-4">
              From One Student to a{' '}
              <span className="text-gradient">Growing Company</span>
            </SectionHeading>
            <div className="mt-6 space-y-4 leading-relaxed text-gray-1">
              <p>
                Orbit started as a dream of one software engineering student — Shehriyar Ali Rustam —
                who believed that world-class technology shouldn&apos;t be limited by geography.
              </p>
              <p>
                What began as freelance projects on Fiverr quickly evolved into something bigger. After
                delivering AI chatbots, custom websites, and brand identities to clients worldwide,
                the vision became clear: build a company that combines AI innovation with full-service
                software development.
              </p>
              <p>
                Today, Orbit is growing into a team of specialists — developers, designers, and AI
                engineers — united by a single mission: to build technology that competes with the
                best in the world.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
            className="flex items-center justify-center"
          >
            <div className="relative h-80 w-80">
              <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-orange/20" />
              <div className="absolute inset-8 animate-spin-slow rounded-full border border-dashed border-orange/30" style={{ animationDirection: 'reverse' }} />
              <div className="absolute inset-16 animate-spin-slow rounded-full border border-dashed border-orange/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-brand">
                  <span className="text-3xl font-black text-white">O</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
