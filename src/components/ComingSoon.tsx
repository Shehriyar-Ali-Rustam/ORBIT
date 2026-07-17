'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail } from 'lucide-react'
import { COMPANY } from '@/lib/constants'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface ComingSoonProps {
  /** Small eyebrow label, e.g. "Freelancer Marketplace" or "Orbit AI". */
  label: string
  /** One-line description of what's coming. */
  description: string
  /** Subject line for the "Get notified" mailto. */
  notifySubject?: string
}

export function ComingSoon({ label, description, notifySubject }: ComingSoonProps) {
  const subject = encodeURIComponent(notifySubject || `Notify me when ${label} launches`)

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-center">
      {/* Ambient orbital rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.15]">
        <div className="absolute h-[520px] w-[520px] animate-spin-slow rounded-full border border-dashed border-accent/40" />
        <div className="absolute h-[380px] w-[380px] animate-spin-slow rounded-full border border-dashed border-accent/30" style={{ animationDirection: 'reverse' }} />
        <div className="absolute h-[240px] w-[240px] animate-spin-slow rounded-full border border-dashed border-accent/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 flex flex-col items-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {label}
        </span>

        <h1 className="mt-8 text-4xl font-black tracking-tight text-text-primary sm:text-5xl md:text-6xl">
          Coming <span className="text-gradient">Soon</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
          {description}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-shadow hover:shadow-accent-glow"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <a
            href={`mailto:${COMPANY.email}?subject=${subject}`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <Mail className="h-4 w-4" />
            Get notified
          </a>
        </div>

        <p className="mt-10 text-xs text-text-tertiary">
          In the meantime, explore our{' '}
          <Link href="/services" className="text-accent hover:underline">services</Link>{' '}
          or{' '}
          <Link href="/contact" className="text-accent hover:underline">start a project</Link>.
        </p>
      </motion.div>
    </section>
  )
}
