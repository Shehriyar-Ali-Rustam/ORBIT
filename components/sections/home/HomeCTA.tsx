'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Star, Briefcase, Zap } from 'lucide-react'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const stats = [
  { value: '24h',  label: 'Response Time', icon: Clock },
  { value: '101+', label: 'Projects Done',  icon: Briefcase },
  { value: '5.0',  label: 'Avg. Rating',    icon: Star },
  { value: '4+',   label: 'Years Active',   icon: Zap },
]

export function HomeCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* ── Full-bleed background image ── */}
      <div className="absolute inset-0">
        <Image
          src="/fotis-fotopoulos-6sAl6aQ4OWI-unsplash.jpg"
          alt="Tech workspace"
          fill
          className="object-cover object-center"
          priority={false}
          sizes="100vw"
        />
        {/* Multi-layer overlay: dark gradient for readability + brand tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/85" />
        {/* Orange brand tint from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/25 via-transparent to-transparent" />
        {/* Subtle vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* ── Floating ambient glow (over image) ── */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: 'rgba(255,117,31,0.18)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-28 text-center lg:px-8 lg:py-36">

        {/* Eyebrow chip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Now Accepting Projects
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          viewport={{ once: true }}
          className="text-5xl font-black tracking-tighter text-white md:text-6xl lg:text-7xl"
        >
          Ready to Build{' '}
          <span
            className="italic"
            style={{
              background: 'linear-gradient(135deg, #FF9A5C 0%, #FF751F 50%, #FF4D00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            the Future?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
          viewport={{ once: true }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/65"
        >
          Tell us about your project. We respond within 24 hours and turn ideas into products that matter.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.25 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #FF751F 0%, #FF4D00 100%)',
              boxShadow: '0 8px 32px rgba(255,117,31,0.45)',
            }}
          >
            Get in Touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white/85 backdrop-blur-sm transition-all hover:bg-white/15"
          >
            View Our Work
          </Link>
        </motion.div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          {/* Separator line */}
          <div
            className="mb-10 h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
          />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(255,117,31,0.18)', border: '1px solid rgba(255,117,31,0.30)' }}
                >
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <p className="font-mono text-2xl font-bold text-white">{value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/45">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
