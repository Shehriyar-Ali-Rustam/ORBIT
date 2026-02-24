'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function OurStory() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>Our Story</SectionLabel>
            <SectionHeading className="mt-4 text-3xl md:text-4xl lg:text-5xl">
              From One Student to a{' '}
              <span className="text-gradient">Growing Company</span>
            </SectionHeading>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary sm:text-base">
              <p>
                I&apos;m Shehriyar Ali Rustam — a software engineering student from Pakistan. I started
                freelancing on Fiverr, building websites and AI chatbots for clients around the world.
                That&apos;s how ORBIT was born.
              </p>
              <p>
                ORBIT isn&apos;t some big corporate thing. It&apos;s a small, hungry team that takes real
                projects seriously — from AI tools to full websites to complete brand identities. We
                ship fast, communicate clearly, and actually care about the work.
              </p>
              <p>
                We&apos;re still growing, still learning, and still building. If you need something built
                right, we&apos;re the team for it.
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
            <div className="relative h-56 w-56 sm:h-64 sm:w-64 lg:h-80 lg:w-80">
              <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-orange/20" />
              <div className="absolute inset-6 animate-spin-slow rounded-full border border-dashed border-orange/30 sm:inset-8" style={{ animationDirection: 'reverse' }} />
              <div className="absolute inset-12 animate-spin-slow rounded-full border border-dashed border-orange/40 sm:inset-16" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand sm:h-20 sm:w-20">
                  <span className="text-2xl font-black text-text-primary sm:text-3xl">O</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
