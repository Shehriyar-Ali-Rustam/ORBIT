'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Zap, Package, Shield } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LineReveal } from '@/components/ui/LineReveal'

const features = [
  {
    icon: Zap,
    title: 'AI-First Approach',
    subtitle: 'Faster Delivery',
    description: 'Every solution we build has intelligence at its core — not as an add-on, but as the foundation.',
    stat: '10×',
    // Vibrant red-pink-purple mesh gradient (like reference center card)
    gradient: [
      'radial-gradient(ellipse at 30% 20%, #FF6B6B 0%, transparent 55%)',
      'radial-gradient(ellipse at 80% 10%, #FFD6E8 0%, transparent 45%)',
      'radial-gradient(ellipse at 10% 70%, #C850C0 0%, transparent 50%)',
      'radial-gradient(ellipse at 75% 65%, #4158D0 0%, transparent 50%)',
      'radial-gradient(ellipse at 50% 50%, #FF9A9E 0%, transparent 40%)',
      'linear-gradient(135deg, #FF6B6B 0%, #C850C0 50%, #4158D0 100%)',
    ].join(', '),
    orb1: '#FF6B6B',
    orb2: '#C850C0',
  },
  {
    icon: Package,
    title: 'End-to-End Delivery',
    subtitle: '100% Ownership',
    description: 'From wireframe to launch, we manage the entire product lifecycle so you can focus on your business.',
    stat: '100%',
    // Green-teal mesh gradient (like reference left card)
    gradient: [
      'radial-gradient(ellipse at 20% 30%, #11998E 0%, transparent 55%)',
      'radial-gradient(ellipse at 80% 20%, #38EF7D 0%, transparent 45%)',
      'radial-gradient(ellipse at 60% 80%, #7B8CDE 0%, transparent 50%)',
      'radial-gradient(ellipse at 10% 80%, #43E97B 0%, transparent 45%)',
      'linear-gradient(135deg, #11998E 0%, #38EF7D 50%, #7B8CDE 100%)',
    ].join(', '),
    orb1: '#38EF7D',
    orb2: '#11998E',
  },
  {
    icon: Shield,
    title: 'Security by Default',
    subtitle: '99.9% Uptime SLA',
    description: 'Enterprise-grade security practices from day one. Your data and your clients\' data are always protected.',
    stat: '99.9%',
    // Blue-slate-sand mesh gradient (like reference right card)
    gradient: [
      'radial-gradient(ellipse at 70% 20%, #A8BFFF 0%, transparent 50%)',
      'radial-gradient(ellipse at 20% 40%, #C9A2E8 0%, transparent 50%)',
      'radial-gradient(ellipse at 60% 80%, #E8C4A2 0%, transparent 45%)',
      'radial-gradient(ellipse at 10% 80%, #7FB3F5 0%, transparent 50%)',
      'linear-gradient(135deg, #A8BFFF 0%, #C9A2E8 50%, #E8C4A2 100%)',
    ].join(', '),
    orb1: '#A8BFFF',
    orb2: '#C9A2E8',
  },
]

const CARD_W = 300
const CARD_H = 420

// 3D positions for each slot
const SLOT = {
  left:   { x: -CARD_W * 0.92, rotateY: 38,  scale: 0.80, zIndex: 1,  opacity: 0.88 },
  center: { x: 0,              rotateY: 0,   scale: 1.0,  zIndex: 10, opacity: 1    },
  right:  { x: CARD_W * 0.92,  rotateY: -38, scale: 0.80, zIndex: 1,  opacity: 0.88 },
}

function MeshCard({
  feature,
  slot,
  onClick,
}: {
  feature: (typeof features)[0]
  slot: 'left' | 'center' | 'right'
  onClick?: () => void
}) {
  const pos = SLOT[slot]
  const isCenter = slot === 'center'
  const Icon = feature.icon

  return (
    <motion.div
      onClick={onClick}
      animate={{
        x: pos.x,
        scale: pos.scale,
        opacity: pos.opacity,
        zIndex: pos.zIndex,
      }}
      style={{ rotateY: pos.rotateY, transformPerspective: 1200 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      className="absolute top-0"
      whileHover={!isCenter ? { scale: pos.scale * 1.04 } : undefined}
      aria-hidden={!isCenter}
    >
      <div
        className="overflow-hidden rounded-3xl shadow-2xl"
        style={{
          width: CARD_W,
          cursor: isCenter ? 'default' : 'pointer',
          boxShadow: isCenter
            ? '0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.08)'
            : '0 16px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* ── Mesh gradient image section ── */}
        <div
          className="relative overflow-hidden"
          style={{ height: Math.round(CARD_H * 0.58), background: feature.gradient }}
        >
          {/* Animated floating orbs inside the gradient */}
          <motion.div
            className="absolute rounded-full blur-[40px]"
            style={{ width: 140, height: 140, top: '10%', left: '5%', background: feature.orb1, opacity: 0.45 }}
            animate={isCenter ? { x: [0, 20, -10, 0], y: [0, -15, 20, 0] } : {}}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full blur-[50px]"
            style={{ width: 160, height: 160, bottom: '-10%', right: '-5%', background: feature.orb2, opacity: 0.35 }}
            animate={isCenter ? { x: [0, -20, 15, 0], y: [0, 20, -10, 0] } : {}}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          {/* Icon overlay on gradient */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <Icon className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
          </div>
          {/* Stat badge */}
          <div
            className="absolute bottom-3 right-3 rounded-full px-3 py-1 text-sm font-bold text-white backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {feature.stat}
          </div>
        </div>

        {/* ── Text section ── */}
        <div
          className="px-6 py-5"
          style={{
            height: Math.round(CARD_H * 0.42),
            background: 'var(--color-card-bg)',
            borderTop: '1px solid var(--color-card-border)',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: feature.orb1 }}
          >
            {feature.subtitle}
          </p>
          <h3 className="mt-1.5 text-lg font-bold text-text-primary leading-snug">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-3">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function WhyOrbit() {
  const [idx, setIdx] = useState(0)
  const n = features.length

  const prev = useCallback(() => setIdx((i) => (i - 1 + n) % n), [n])
  const next = useCallback(() => setIdx((i) => (i + 1) % n), [n])

  const leftIdx   = (idx - 1 + n) % n
  const centerIdx = idx
  const rightIdx  = (idx + 1) % n

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{ background: features[idx].orb1, opacity: 0.05 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
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

        {/* ── 3D Carousel ── */}
        <div className="mt-20 flex flex-col items-center">
          {/* Cards stage */}
          <div
            className="relative flex items-center justify-center"
            style={{ height: CARD_H + 40, width: '100%', maxWidth: CARD_W * 3 }}
          >
            {/* Left arrow */}
            <button
              onClick={prev}
              className="absolute left-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-text-secondary shadow-md transition-all hover:border-accent/50 hover:text-accent hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* 3 cards */}
            <div className="relative" style={{ width: CARD_W, height: CARD_H }}>
              <MeshCard feature={features[leftIdx]}   slot="left"   onClick={prev} />
              <MeshCard feature={features[rightIdx]}  slot="right"  onClick={next} />
              <MeshCard feature={features[centerIdx]} slot="center" />
            </div>

            {/* Right arrow */}
            <button
              onClick={next}
              className="absolute right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-text-secondary shadow-md transition-all hover:border-accent/50 hover:text-accent hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex gap-2.5">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? 28 : 8,
                  background: i === idx ? features[idx].orb1 : 'var(--color-card-border)',
                  boxShadow: i === idx ? `0 0 10px ${features[idx].orb1}80` : 'none',
                }}
                aria-label={`Go to ${features[i].title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
