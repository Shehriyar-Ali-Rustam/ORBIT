'use client'

import { motion } from 'framer-motion'
import { Zap, Package, Shield } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LineReveal } from '@/components/ui/LineReveal'

const features = [
  {
    icon: Zap,
    title: 'AI-First Approach',
    description: 'Every solution we build has intelligence at its core. Not as an add-on, but as a foundation.',
    stat: '10x',
    statLabel: 'Faster Delivery',
  },
  {
    icon: Package,
    title: 'End-to-End Delivery',
    description: 'From wireframe to launch, we manage the entire product lifecycle. You focus on your business.',
    stat: '100%',
    statLabel: 'Ownership',
  },
  {
    icon: Shield,
    title: 'Security by Default',
    description: "Enterprise-grade security practices from day one. Your data and your clients' data are always protected.",
    stat: '99.9%',
    statLabel: 'Uptime SLA',
  },
]

export function WhyOrbit() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent opacity-[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <LineReveal>
            <SectionLabel>Why Choose Us</SectionLabel>
          </LineReveal>
          <LineReveal delay={0.1}>
            <SectionHeading className="mt-4">
              Global Standards.{' '}
              <span className="text-gradient">Local Understanding.</span>
            </SectionHeading>
          </LineReveal>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.12 }}
              viewport={{ once: true, margin: '-50px' }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-8 backdrop-blur-sm transition-all duration-300 hover:border-accent/30"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

              <div className="relative z-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <feature.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-text-primary">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-text-secondary">{feature.description}</p>

                {/* Stat pill */}
                <div className="mt-6 flex items-center justify-center gap-3 border-t border-[var(--color-card-border)] pt-6">
                  <span className="font-mono text-2xl font-bold text-accent">{feature.stat}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-text-tertiary">{feature.statLabel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
