'use client'

import { motion } from 'framer-motion'
import { GraduationCap, ArrowUpRight } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASE } from '@/components/motion/motion-config'


export function Team() {
  return (
    <section id="hiring" className="section-padding bg-surface scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>Join the Team</SectionLabel>
            <SectionHeading className="mt-4">We&apos;re Hiring</SectionHeading>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          viewport={{ once: true, margin: '-50px' }}
          className="mx-auto mt-14 max-w-2xl"
        >
          <div className="group relative overflow-hidden rounded-xl border border-border bg-surface p-8 text-center transition-colors hover:border-accent/40 sm:p-10">
                        <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <GraduationCap className="h-7 w-7" />
              </div>
              <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Internship
              </p>
              <h3 className="mt-3 text-2xl font-bold text-text-primary">
                Learn by building real things
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
                A hands-on program across AI/ML, web, mobile, and design. Ship real client
                work from day one, mentored directly by the founders.
              </p>
              <a
                href="https://orbit-internship.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-accent-hover"
              >
                Apply for the internship
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
