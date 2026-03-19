'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Bot, Globe, Smartphone, Palette, TrendingUp, Layers,
  ArrowRight, Star, Users, Shield, Zap, CheckCircle,
  Sparkles, ChevronRight,
} from 'lucide-react'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { GigCard } from '@/components/marketplace/GigCard'
import { getActiveGigs } from '@/lib/marketplace/queries'
import type { Gig } from '@/types/marketplace'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CATEGORIES = [
  {
    value: 'ai',
    label: 'AI & Machine Learning',
    icon: Bot,
    desc: 'Chatbots, automation & models',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&q=80&fit=crop',
    gradient: 'from-purple-900/90 via-purple-700/50 to-purple-500/10',
    color: '#A78BFA',
  },
  {
    value: 'web',
    label: 'Web Development',
    icon: Globe,
    desc: 'Full-stack apps & websites',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=700&q=80&fit=crop',
    gradient: 'from-blue-900/90 via-blue-700/50 to-blue-500/10',
    color: '#60A5FA',
  },
  {
    value: 'mobile',
    label: 'Mobile Apps',
    icon: Smartphone,
    desc: 'iOS & Android development',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&q=80&fit=crop',
    gradient: 'from-emerald-900/90 via-emerald-700/50 to-emerald-500/10',
    color: '#34D399',
  },
  {
    value: 'design',
    label: 'Graphic Design',
    icon: Palette,
    desc: 'UI/UX, logos & branding',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80&fit=crop',
    gradient: 'from-pink-900/90 via-pink-700/50 to-pink-500/10',
    color: '#F472B6',
  },
  {
    value: 'marketing',
    label: 'Digital Marketing',
    icon: TrendingUp,
    desc: 'SEO, ads & growth',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80&fit=crop',
    gradient: 'from-orange-900/90 via-orange-700/50 to-orange-500/10',
    color: '#FB923C',
  },
  {
    value: 'other',
    label: 'Other Services',
    icon: Layers,
    desc: 'Writing, video & more',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&q=80&fit=crop',
    gradient: 'from-slate-900/90 via-slate-700/50 to-slate-500/10',
    color: '#94A3B8',
  },
]

const TRUST_STATS = [
  { label: 'Vetted Experts', value: '101+', icon: Users, color: '#8B5CF6' },
  { label: 'Projects Delivered', value: '100+', icon: CheckCircle, color: '#10B981' },
  { label: 'Avg. Rating', value: '5.0', icon: Star, color: '#F59E0B' },
  { label: 'Years of Excellence', value: '4+', icon: Zap, color: '#FF751F' },
]

const HOW_BUYER = [
  { n: '01', title: 'Search & Browse', desc: 'Explore hundreds of services from vetted professionals across all categories.', color: '#60A5FA' },
  { n: '02', title: 'Pick Your Expert', desc: 'Review portfolios, ratings, and reviews — then message the perfect freelancer.', color: '#A78BFA' },
  { n: '03', title: 'Get Results, Fast', desc: "Collaborate, review deliverables, and pay only when you're 100% satisfied.", color: '#34D399' },
]

const HOW_SELLER = [
  { n: '01', title: 'Build Your Profile', desc: 'Showcase your skills, past work, and certifications to stand out.', color: '#F472B6' },
  { n: '02', title: 'Create Gig Packages', desc: 'Set your own pricing, delivery time, and tiered service offerings.', color: '#FB923C' },
  { n: '03', title: 'Earn & Scale', desc: 'Deliver great work, earn 5-star reviews, and grow your client base.', color: '#FF751F' },
]

const TRENDING = ['AI Chatbot', 'React App', 'Logo Design', 'Mobile Dev', 'Python Script']

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
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-[82vh] overflow-hidden">
        {/* Animated mesh background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[var(--color-bg)]" />
          <motion.div
            className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[-5%] top-[10%] h-[500px] w-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,117,31,0.14) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--color-text-primary) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Label chip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ borderColor: 'rgba(255,117,31,0.3)', background: 'rgba(255,117,31,0.08)', color: '#FF751F' }}
            >
              <Sparkles className="h-3 w-3" />
              Orbit Marketplace
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.05 }}
              className="text-5xl font-bold tracking-tight text-text-primary md:text-6xl lg:text-7xl"
            >
              Hire World-Class
              <br />
              <span className="text-gradient">Freelancers.</span>
              <br />
              <span className="font-light text-text-secondary">Ship Faster.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.15 }}
              className="mx-auto mt-6 max-w-xl text-lg text-text-secondary"
            >
              Vetted talent. Real reviews. Secure payments. Get your project done right — every time.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.22 }}
              className="mx-auto mt-8 max-w-xl"
            >
              <SearchBar showPopular />
            </motion.div>

            {/* Trending chips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="text-xs text-text-tertiary">Trending:</span>
              {TRENDING.map((t) => (
                <Link
                  key={t}
                  href={`/freelancers/search?q=${encodeURIComponent(t)}`}
                  className="rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-3 py-1 text-xs text-text-secondary transition-all hover:border-accent/40 hover:text-accent"
                >
                  {t}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Trust stat bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.4 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {TRUST_STATS.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-5 text-center"
                  style={{ boxShadow: `0 0 24px ${s.color}12` }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${s.color}18` }}>
                    <Icon className="h-4 w-4" style={{ color: s.color }} />
                  </div>
                  <span className="text-2xl font-bold text-text-primary">{s.value}</span>
                  <span className="text-xs text-text-tertiary">{s.label}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section className="section-padding relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[var(--color-surface)]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--color-text-primary) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                viewport={{ once: true }}
                className="text-xs font-semibold uppercase tracking-widest text-accent"
              >
                Explore Services
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.05 }}
                viewport={{ once: true }}
                className="mt-2 text-3xl font-bold text-text-primary lg:text-4xl"
              >
                Browse by Category
              </motion.h2>
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <Link href="/freelancers/search" className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.value}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: i * 0.06 }}
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <Link
                    href={`/freelancers/search?category=${cat.value}`}
                    className="group relative block overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ height: 200 }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Hover border glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ boxShadow: `inset 0 0 0 1.5px ${cat.color}60` }}
                    />

                    {/* Icon top-right */}
                    <div
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-sm"
                      style={{ background: `${cat.color}28`, border: `1px solid ${cat.color}40` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: cat.color }} />
                    </div>

                    {/* Content bottom-left */}
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="text-base font-bold text-white">{cat.label}</h3>
                      <p className="mt-0.5 text-xs text-white/60">{cat.desc}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs font-semibold" style={{ color: cat.color }}>
                        Browse <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURED GIGS ══════════════ */}
      <section className="section-padding relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,117,31,0.06) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease }}
                viewport={{ once: true }}
                className="text-xs font-semibold uppercase tracking-widest text-accent"
              >
                Hand-Picked
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.05 }}
                viewport={{ once: true }}
                className="mt-2 text-3xl font-bold text-text-primary lg:text-4xl"
              >
                Top Services
              </motion.h2>
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <Link href="/freelancers/search" className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-[var(--color-card-border)]">
                    <div className="aspect-video animate-pulse bg-[var(--color-surface)]" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-surface)]" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--color-surface)]" />
                    </div>
                  </div>
                ))
              : featuredGigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
          </div>

          {!loading && featuredGigs.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
                <Layers className="h-8 w-8 text-text-tertiary" />
              </div>
              <p className="text-text-secondary">No services yet — be the first to post a gig!</p>
              <Link href="/freelancers/onboarding" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80">
                Start Selling <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="section-padding relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[var(--color-surface)]" />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)' }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest text-accent"
            >
              Simple Process
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.05 }}
              viewport={{ once: true }}
              className="mt-2 text-3xl font-bold text-text-primary lg:text-4xl"
            >
              How It Works
            </motion.h2>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {/* For Buyers */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)]"
            >
              <div
                className="relative overflow-hidden px-8 py-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(96,165,250,0.15) 0%, rgba(139,92,246,0.10) 100%)',
                  borderBottom: '1px solid var(--color-card-border)',
                }}
              >
                <div className="absolute right-4 top-4 opacity-[0.12]">
                  <Users className="h-20 w-20 text-blue-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">For Buyers</span>
                <h3 className="mt-1 text-xl font-bold text-text-primary">Hire in Minutes</h3>
                <p className="mt-1 text-sm text-text-secondary">Find the right expert and get your project moving.</p>
              </div>
              <div className="divide-y divide-[var(--color-card-border)]">
                {HOW_BUYER.map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-5 px-8 py-5"
                  >
                    <div
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold"
                      style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{step.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="px-8 pb-7 pt-4">
                <Link
                  href="/freelancers/search"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-blue-400 transition-all hover:bg-blue-500/20"
                >
                  Start Hiring <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* For Sellers */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)]"
            >
              <div
                className="relative overflow-hidden px-8 py-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,117,31,0.15) 0%, rgba(244,114,182,0.10) 100%)',
                  borderBottom: '1px solid var(--color-card-border)',
                }}
              >
                <div className="absolute right-4 top-4 opacity-[0.12]">
                  <Zap className="h-20 w-20 text-orange-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">For Sellers</span>
                <h3 className="mt-1 text-xl font-bold text-text-primary">Earn on Your Terms</h3>
                <p className="mt-1 text-sm text-text-secondary">Turn your skills into a thriving freelance business.</p>
              </div>
              <div className="divide-y divide-[var(--color-card-border)]">
                {HOW_SELLER.map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-5 px-8 py-5"
                  >
                    <div
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold"
                      style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{step.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="px-8 pb-7 pt-4">
                <Link
                  href="/freelancers/onboarding"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: '#FF751F', boxShadow: '0 0 20px rgba(255,117,31,0.3)' }}
                >
                  Start Selling <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════ SELLER CTA ══════════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: [
                'radial-gradient(ellipse at 10% 50%, rgba(255,117,31,0.22) 0%, transparent 55%)',
                'radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.18) 0%, transparent 55%)',
                'radial-gradient(ellipse at 60% 90%, rgba(96,165,250,0.12) 0%, transparent 50%)',
                'var(--color-card-bg)',
              ].join(', '),
              border: '1px solid rgba(255,117,31,0.2)',
              boxShadow: '0 0 80px rgba(255,117,31,0.08)',
            }}
          >
            {/* Orbs */}
            <motion.div
              className="pointer-events-none absolute right-[-60px] top-[-60px] h-[300px] w-[300px] rounded-full blur-[80px]"
              style={{ background: 'rgba(255,117,31,0.15)' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="pointer-events-none absolute bottom-[-40px] left-[30%] h-[200px] w-[200px] rounded-full blur-[70px]"
              style={{ background: 'rgba(139,92,246,0.12)' }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            {/* Top accent line */}
            <div
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, #FF751F, #A78BFA, transparent)' }}
            />

            <div className="relative px-8 py-12 lg:px-14 lg:py-16">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <div
                    className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                    style={{ background: 'rgba(255,117,31,0.12)', color: '#FF751F', border: '1px solid rgba(255,117,31,0.25)' }}
                  >
                    <Sparkles className="h-3 w-3" />
                    Join the Network
                  </div>
                  <h2 className="text-3xl font-bold text-text-primary lg:text-4xl">
                    Are you a skilled professional?
                  </h2>
                  <p className="mt-3 text-base text-text-secondary">
                    Join the Orbit Network and start earning from your skills today.
                    Our marketplace connects top talent with clients who need your expertise.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-6">
                    {[
                      { label: 'Active Clients', val: '50+' },
                      { label: 'Avg. Earnings', val: '$500+/mo' },
                      { label: 'Top Rated', val: '5.0 ★' },
                    ].map((s) => (
                      <div key={s.label}>
                        <span className="block text-xl font-bold text-accent">{s.val}</span>
                        <span className="text-xs text-text-tertiary">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <Link
                    href="/freelancers/onboarding"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #FF751F 0%, #FF4D00 100%)',
                      boxShadow: '0 8px 32px rgba(255,117,31,0.35)',
                    }}
                  >
                    Start Selling Today <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/freelancers/search"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-8 py-4 text-sm font-semibold text-text-primary transition-all hover:border-accent/40"
                  >
                    Browse Gigs
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div className="border-t border-[var(--color-card-border)] py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-6 text-xs text-text-tertiary lg:px-8">
          {[
            { icon: Shield, text: 'Secure Payments' },
            { icon: CheckCircle, text: 'Vetted Sellers' },
            { icon: Star, text: '5.0 Avg Rating' },
            { icon: Zap, text: 'Fast Delivery' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-accent" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
