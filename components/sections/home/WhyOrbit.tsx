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
    description: 'Every solution we build has intelligence at its core — not as an add-on, but as the foundation that powers real business outcomes.',
    stat: '10×',
    gradient: [
      'radial-gradient(ellipse at 25% 15%, #FF6B6B 0%, transparent 50%)',
      'radial-gradient(ellipse at 75% 10%, #FFD6E8 0%, transparent 40%)',
      'radial-gradient(ellipse at 10% 65%, #C850C0 0%, transparent 48%)',
      'radial-gradient(ellipse at 80% 70%, #4158D0 0%, transparent 48%)',
      'radial-gradient(ellipse at 50% 50%, #FF9A9E 0%, transparent 38%)',
      'linear-gradient(155deg, #FF6B6B 0%, #C850C0 45%, #4158D0 100%)',
    ].join(', '),
    orb1: '#FF6B6B',
    orb2: '#C850C0',
    glow: 'rgba(255,107,107,0.4)',
  },
  {
    icon: Package,
    title: 'End-to-End Delivery',
    subtitle: '100% Ownership',
    description: 'From wireframe to launch, we own the entire product lifecycle — strategy, design, engineering, and post-launch support.',
    stat: '100%',
    gradient: [
      'radial-gradient(ellipse at 20% 25%, #11998E 0%, transparent 52%)',
      'radial-gradient(ellipse at 80% 15%, #38EF7D 0%, transparent 45%)',
      'radial-gradient(ellipse at 65% 80%, #7B8CDE 0%, transparent 48%)',
      'radial-gradient(ellipse at 10% 80%, #43E97B 0%, transparent 44%)',
      'linear-gradient(155deg, #11998E 0%, #38EF7D 50%, #7B8CDE 100%)',
    ].join(', '),
    orb1: '#38EF7D',
    orb2: '#11998E',
    glow: 'rgba(56,239,125,0.4)',
  },
  {
    icon: Shield,
    title: 'Security by Default',
    subtitle: '99.9% Uptime SLA',
    description: 'Enterprise-grade security practices from day one. Your data and your clients\' data are always fully protected.',
    stat: '99.9%',
    gradient: [
      'radial-gradient(ellipse at 70% 15%, #A8BFFF 0%, transparent 48%)',
      'radial-gradient(ellipse at 20% 35%, #C9A2E8 0%, transparent 48%)',
      'radial-gradient(ellipse at 60% 80%, #E8C4A2 0%, transparent 44%)',
      'radial-gradient(ellipse at 10% 80%, #7FB3F5 0%, transparent 48%)',
      'linear-gradient(155deg, #A8BFFF 0%, #C9A2E8 50%, #E8C4A2 100%)',
    ].join(', '),
    orb1: '#A8BFFF',
    orb2: '#C9A2E8',
    glow: 'rgba(168,191,255,0.4)',
  },
]

const CARD_W = 290
const CARD_H = 490

// Fan layout: left card tilts right ~48°, right card tilts left ~48°
const SLOT = {
  left: {
    x: -CARD_W * 1.08,
    rotateY: 48,
    scale: 0.74,
    zIndex: 2,
    opacity: 0.82,
  },
  center: {
    x: 0,
    rotateY: 0,
    scale: 1.0,
    zIndex: 10,
    opacity: 1,
  },
  right: {
    x: CARD_W * 1.08,
    rotateY: -48,
    scale: 0.74,
    zIndex: 2,
    opacity: 0.82,
  },
}

function Card({
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
      style={{ rotateY: pos.rotateY, transformPerspective: 1100 }}
      transition={{ type: 'spring', stiffness: 240, damping: 30 }}
      className="absolute top-0"
      whileHover={!isCenter ? { scale: pos.scale * 1.05 } : undefined}
      aria-hidden={!isCenter}
    >
      {/* Glow beneath center card */}
      {isCenter && (
        <div
          className="pointer-events-none absolute -inset-4 rounded-[40px] blur-[50px]"
          style={{ background: feature.glow, opacity: 0.5 }}
        />
      )}

      <div
        className="relative overflow-hidden rounded-[28px]"
        style={{
          width: CARD_W,
          height: CARD_H,
          background: feature.gradient,
          cursor: isCenter ? 'default' : 'pointer',
          boxShadow: isCenter
            ? '0 40px 100px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.10)'
            : '0 20px 50px rgba(0,0,0,0.25)',
        }}
      >
        {/* ── Animated floating orbs ── */}
        <motion.div
          className="absolute rounded-full blur-[50px]"
          style={{
            width: 180,
            height: 180,
            top: '-5%',
            left: '-5%',
            background: feature.orb1,
            opacity: 0.5,
          }}
          animate={isCenter ? { x: [0, 25, -12, 0], y: [0, -18, 22, 0] } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-[60px]"
          style={{
            width: 200,
            height: 200,
            bottom: '25%',
            right: '-10%',
            background: feature.orb2,
            opacity: 0.4,
          }}
          animate={isCenter ? { x: [0, -25, 18, 0], y: [0, 22, -12, 0] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        <motion.div
          className="absolute rounded-full blur-[40px]"
          style={{
            width: 120,
            height: 120,
            bottom: '10%',
            left: '15%',
            background: feature.orb1,
            opacity: 0.3,
          }}
          animate={isCenter ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* ── Stat badge — top right ── */}
        <div
          className="absolute right-4 top-4 rounded-full px-4 py-1.5 font-mono text-sm font-bold text-white"
          style={{
            background: 'rgba(0,0,0,0.32)',
            border: '1px solid rgba(255,255,255,0.20)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {feature.stat}
        </div>

        {/* ── Icon — centered upper area ── */}
        <div className="absolute left-0 right-0 top-[28%] flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl"
            style={{
              background: 'rgba(255,255,255,0.16)',
              border: '1px solid rgba(255,255,255,0.28)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            <Icon className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* ── Glassmorphism content panel at bottom ── */}
        <div
          className="absolute inset-x-0 bottom-0 px-6 pb-7 pt-5"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.0) 100%)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <p
            className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60"
          >
            {feature.subtitle}
          </p>
          <h3 className="text-xl font-bold leading-snug text-white">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/70 line-clamp-3">
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
      {/* ── Section background: rich atmospheric gradient ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Base */}
        <div className="absolute inset-0 bg-[var(--color-bg)]" />
        {/* Ambient color shifted by active card */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: 1 }}
          key={idx}
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${features[centerIdx].glow.replace('0.4', '0.07')} 0%, transparent 70%)`,
          }}
        />
        {/* Left atmospheric bloom */}
        <motion.div
          className="absolute left-[-5%] top-[20%] h-[600px] w-[600px] rounded-full blur-[140px]"
          style={{ background: `${features[centerIdx].orb2}12` }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Right atmospheric bloom */}
        <motion.div
          className="absolute right-[-5%] top-[30%] h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ background: `${features[centerIdx].orb1}10` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-text-primary) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
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

        {/* ── 3D Fan Carousel ── */}
        <div className="mt-20 flex flex-col items-center">
          {/* Cards stage */}
          <div
            className="relative flex items-center justify-center"
            style={{ height: CARD_H + 60, width: '100%', maxWidth: CARD_W * 3.2 }}
          >
            {/* Render back-to-front: sides first, center on top */}
            <div className="relative" style={{ width: CARD_W, height: CARD_H }}>
              <Card feature={features[leftIdx]}   slot="left"   onClick={prev} />
              <Card feature={features[rightIdx]}  slot="right"  onClick={next} />
              <Card feature={features[centerIdx]} slot="center" />
            </div>
          </div>

          {/* ── Controls: [←] [• • •] [→] ── */}
          <div className="mt-10 flex items-center gap-4">
            {/* Prev arrow */}
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-text-secondary shadow-lg transition-all hover:scale-110 hover:border-accent/50 hover:text-accent"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2.5">
              {features.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === idx ? 32 : 8,
                    background: i === idx ? f.orb1 : 'var(--color-card-border)',
                    boxShadow: i === idx ? `0 0 12px ${f.orb1}90` : 'none',
                  }}
                  aria-label={`Go to ${features[i].title}`}
                />
              ))}
            </div>

            {/* Next arrow */}
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-text-secondary shadow-lg transition-all hover:scale-110 hover:border-accent/50 hover:text-accent"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
