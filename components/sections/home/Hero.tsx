'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Hero() {
  return (
    <section className="dot-grid relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background orb */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-orange opacity-[0.07] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-border px-4 py-2"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-orange">
            AI-Powered Software Company
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mx-auto max-w-5xl text-6xl font-black leading-none tracking-tighter text-text-primary md:text-7xl lg:text-8xl"
        >
          We Build Software
          <br />
          That Orbits{' '}
          <span className="text-gradient">the Future</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl"
        >
          Orbit is a full-service technology company specializing in AI chatbots, model training,
          custom software, and design — built to compete globally.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Start a Project &rarr;
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button variant="ghost" size="lg">
              View Our Work
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6 text-text-tertiary" />
        </motion.div>
      </motion.div>
    </section>
  )
}
