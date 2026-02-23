'use client'

import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function FreelancersHero() {
  return (
    <section className="dot-grid relative flex min-h-[60vh] items-center justify-center pt-16">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-orange opacity-[0.05] blur-[100px]" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <SectionLabel>Talent Network</SectionLabel>
          <h1 className="mt-4 text-5xl font-black tracking-tighter text-text-primary md:text-6xl lg:text-7xl">
            Find Expert Freelancers
            <br />
            From the <span className="text-gradient">Orbit Network</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Browse our curated network of vetted professionals — developers, designers,
            AI engineers, and marketers ready to bring your project to life.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
