'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function ServicesHero() {
  return (
    <section className="dot-grid relative flex min-h-[60vh] items-center justify-center pt-16">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=90"
          alt=""
          fill
          className="object-cover opacity-[0.15]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 via-transparent to-[var(--color-bg)]/80" />
      </div>

      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-accent opacity-[0.05] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="rounded-2xl border border-white/[0.08] bg-black/30 px-8 py-12 shadow-[0_8px_64px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <SectionLabel>Services</SectionLabel>
          <h1 className="mt-4 text-5xl font-black tracking-tighter text-text-primary md:text-6xl lg:text-7xl">
            Full-Service Technology{' '}
            <span className="text-gradient">Solutions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            From AI chatbots to mobile apps, we deliver end-to-end technology solutions
            that drive growth and innovation for businesses worldwide.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
