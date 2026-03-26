'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-[#04040e]">
      {/* ── Ambient glow behind the glowing element ── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute bottom-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 translate-y-[30%] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,117,31,0.18) 0%, rgba(255,117,31,0.06) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-8 pt-28 text-center sm:pb-12 lg:pt-36">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          viewport={{ once: true }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Start Building with
          <br />
          Orbit today
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          viewport={{ once: true }}
          className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#8a8a9a]"
        >
          Tell us about your project, get expert guidance,
          <br className="hidden sm:block" />
          and bring your vision to life.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-white/15 bg-white px-7 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Learn More
          </Link>
        </motion.div>

        {/* ── Glowing "Launch" element ── */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.35 }}
          viewport={{ once: true }}
          className="relative mx-auto mt-24 flex items-center justify-center pb-16 sm:mt-28"
        >
          {/* Multi-layer glow behind the button */}
          <motion.div
            className="absolute h-56 w-72 rounded-[32px] blur-[80px]"
            style={{ background: 'rgba(255,117,31,0.30)' }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute h-40 w-56 rounded-[28px] blur-[50px]"
            style={{ background: 'rgba(255,117,31,0.20)' }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* The glowing button element */}
          <motion.div
            className="relative flex h-[88px] w-[220px] cursor-default items-center justify-center rounded-2xl sm:h-[100px] sm:w-[260px]"
            style={{
              background: 'linear-gradient(135deg, #FF8C42 0%, #FF751F 40%, #FF5500 100%)',
              boxShadow:
                '0 0 50px rgba(255,117,31,0.35), 0 0 100px rgba(255,117,31,0.15), 0 20px 60px rgba(255,117,31,0.25), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
            }}
            animate={{
              boxShadow: [
                '0 0 50px rgba(255,117,31,0.35), 0 0 100px rgba(255,117,31,0.15), 0 20px 60px rgba(255,117,31,0.25), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
                '0 0 70px rgba(255,117,31,0.50), 0 0 140px rgba(255,117,31,0.25), 0 24px 80px rgba(255,117,31,0.35), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
                '0 0 50px rgba(255,117,31,0.35), 0 0 100px rgba(255,117,31,0.15), 0 20px 60px rgba(255,117,31,0.25), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Subtle inner highlight */}
            <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/10 to-transparent" />
            <span className="relative text-2xl font-bold tracking-wide text-white sm:text-3xl">
              Launch
            </span>
          </motion.div>

          {/* Reflection beneath */}
          <div
            className="absolute -bottom-4 h-16 w-48 rounded-full blur-[30px]"
            style={{ background: 'rgba(255,117,31,0.12)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
