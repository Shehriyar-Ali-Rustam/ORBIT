'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Globe, Smartphone, Palette, TrendingUp, Layers, ArrowRight, Search as SearchIcon, ShoppingBag, Briefcase, DollarSign } from 'lucide-react'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { GigCard } from '@/components/marketplace/GigCard'
import { Button } from '@/components/ui/Button'
import { getActiveGigs } from '@/lib/marketplace/queries'
import { GIG_CATEGORIES } from '@/lib/marketplace/constants'
import type { Gig } from '@/types/marketplace'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const ICONS: Record<string, React.ElementType> = {
  Bot, Globe, Smartphone, Palette, TrendingUp, Layers,
}

const HOW_IT_WORKS_BUYER = [
  { icon: SearchIcon, title: 'Search', description: 'Browse thousands of services from talented professionals.' },
  { icon: ShoppingBag, title: 'Order', description: 'Choose a package and place your order securely.' },
  { icon: ArrowRight, title: 'Get Results', description: 'Receive quality work delivered on time.' },
]

const HOW_IT_WORKS_SELLER = [
  { icon: Briefcase, title: 'Create Profile', description: 'Set up your professional seller profile.' },
  { icon: Layers, title: 'Post Gigs', description: 'Create service listings with pricing tiers.' },
  { icon: DollarSign, title: 'Get Paid', description: 'Receive payments directly to your account.' },
]

export default function MarketplaceHome() {
  const [featuredGigs, setFeaturedGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGigs() {
      try {
        const { gigs } = await getActiveGigs({ limit: 8 })
        setFeaturedGigs(gigs)
      } catch {
        // Silently fail if Supabase not configured yet
      } finally {
        setLoading(false)
      }
    }
    fetchGigs()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-transparent to-transparent" />
        <div className="pointer-events-none absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-orange opacity-[0.05] blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Find the Perfect{' '}
              <span className="text-gradient">Freelancer</span>{' '}
              for Your Project
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Vetted talent. Real reviews. Fast delivery.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="mx-auto mt-8 max-w-xl"
          >
            <SearchBar showPopular />
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-text-primary"
          >
            Browse by Category
          </motion.h2>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {GIG_CATEGORIES.map((cat, i) => {
              const Icon = ICONS[cat.icon] || Layers
              return (
                <motion.div
                  key={cat.value}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/freelancers/search?category=${cat.value}`}
                    className="group flex flex-col items-center rounded-xl border border-border bg-surface p-6 text-center transition-all hover:border-orange hover:shadow-lg hover:shadow-orange/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-dim transition-colors group-hover:bg-orange/20">
                      <Icon className="h-6 w-6 text-orange" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-text-primary">{cat.label}</h3>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary">Top Services</h2>
            <Link
              href="/freelancers/search"
              className="flex items-center gap-1 text-sm font-medium text-orange transition-colors hover:text-orange-hover"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-surface" />
                ))
              : featuredGigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
          </div>

          {!loading && featuredGigs.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-text-secondary">No services available yet. Be the first to post a gig!</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-text-primary">How It Works</h2>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            {/* For Buyers */}
            <div>
              <h3 className="mb-6 text-center text-lg font-semibold text-text-primary">For Buyers</h3>
              <div className="space-y-6">
                {HOW_IT_WORKS_BUYER.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-dim text-sm font-bold text-orange">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{step.title}</h4>
                      <p className="mt-1 text-sm text-text-secondary">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* For Sellers */}
            <div>
              <h3 className="mb-6 text-center text-lg font-semibold text-text-primary">For Sellers</h3>
              <div className="space-y-6">
                {HOW_IT_WORKS_SELLER.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-dim text-sm font-bold text-orange">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{step.title}</h4>
                      <p className="mt-1 text-sm text-text-secondary">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Seller CTA */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-orange/20 bg-gradient-to-r from-orange/10 via-surface to-surface p-8 lg:p-12">
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Are you a skilled professional?
                </h2>
                <p className="mt-2 text-text-secondary">
                  Join the Orbit Network and start earning from your skills today.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/freelancers/onboarding">
                  <Button variant="primary" size="lg">
                    Start Selling
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
