'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function JoinBanner() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, margin: '-50px' }}
          className="rounded-2xl border border-border bg-surface p-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Are You a Skilled Professional?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-1">
            Join the Orbit network — get access to quality clients worldwide and work on
            exciting projects with a team that values excellence.
          </p>
          <div className="mt-8">
            <Link href="/freelancers/apply">
              <Button variant="primary" size="lg">
                Apply to Join &rarr;
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
