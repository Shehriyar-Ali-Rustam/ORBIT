'use client'

import { motion } from 'framer-motion'
import { Zap, Package, Shield } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { LineReveal } from '@/components/ui/LineReveal'

const features = [
  {
    icon: Zap,
    title: 'AI-First Approach',
    description: 'Every solution we build has intelligence at its core not as an add-on, but as a foundation.',
  },
  {
    icon: Package,
    title: 'End-to-End Delivery',
    description: 'From wireframe to launch, we manage the entire product lifecycle. You focus on your business, we handle everything else.',
  },
  {
    icon: Shield,
    title: 'Security by Default',
    description: "Enterprise-grade security practices from day one. Your data and your clients' data are always protected.",
  },
]

export function WhyOrbit() {
  return (
    <section className="section-padding bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
            >
              <Card className="h-full text-center" tilt gradientBorder>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orange-dim">
                  <feature.icon className="h-6 w-6 text-orange" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-text-secondary">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
