'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, ArrowRight, Sparkles } from 'lucide-react'
import { FreelancerCard } from './FreelancerCard'
import { Button } from '@/components/ui/Button'
import { freelancers } from '@/data/freelancers'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function FreelancerGrid() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          {/* Left: Freelancer Card */}
          <div>
            {freelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>

          {/* Right: More are joining */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="flex h-full flex-col rounded-2xl border border-dashed border-orange/30 bg-surface p-8 text-center lg:text-left">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-dim lg:mx-0">
                <Users className="h-8 w-8 text-orange" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-text-primary">
                More Talent is <span className="text-orange">Joining</span>
              </h3>
              <p className="mt-3 leading-relaxed text-text-secondary">
                We&apos;re growing our network of vetted developers, designers, and AI engineers.
                New freelancers are joining ORBIT every month to bring you even more expertise
                and faster delivery.
              </p>

              <div className="mt-6 space-y-3">
                {['AI & ML Engineers', 'UI/UX Designers', 'Backend Developers', 'Mobile Specialists'].map((role, i) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <Sparkles className="h-4 w-4 shrink-0 text-orange" />
                    <span className="text-sm text-text-secondary">{role}</span>
                    <span className="rounded-full bg-orange-dim px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange">
                      Coming Soon
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col items-center gap-3 pt-8 sm:flex-row lg:items-start">
                <Link href="/freelancers/apply">
                  <Button variant="primary" size="md">
                    Join the Network <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" size="md">
                    Hire Talent
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
