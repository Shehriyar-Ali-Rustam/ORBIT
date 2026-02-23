'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function HomeCTA() {
  return (
    <section className="relative border-y border-border bg-surface py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-orange opacity-[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Ready to Build the Future?
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Tell us about your project — we respond within 24 hours.
          </p>
          <div className="mt-8">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="shadow-orange-glow">
                Get in Touch &rarr;
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
