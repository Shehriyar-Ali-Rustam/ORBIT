'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lightbulb, Heart, Award, Rocket } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    subtitle: 'Push Boundaries',
    description: 'We embrace new technologies and bold ideas to solve problems in ways nobody has tried before.',
    stat: '#1',
    gradient: [
      'radial-gradient(ellipse at 25% 15%, #8B5CF6 0%, transparent 52%)',
      'radial-gradient(ellipse at 80% 10%, #C4B5FD 0%, transparent 45%)',
      'radial-gradient(ellipse at 10% 70%, #6D28D9 0%, transparent 50%)',
      'radial-gradient(ellipse at 75% 75%, #4338CA 0%, transparent 48%)',
      'linear-gradient(155deg, #7C3AED 0%, #4338CA 50%, #1E1B4B 100%)',
    ].join(', '),
    orb1: '#8B5CF6',
    orb2: '#6D28D9',
    glow: 'rgba(139,92,246,0.5)',
  },
  {
    icon: Heart,
    title: 'Integrity',
    subtitle: 'Client First',
    description: "We are honest, transparent, and always put our clients' interests first — no shortcuts, ever.",
    stat: '100%',
    gradient: [
      'radial-gradient(ellipse at 20% 20%, #F43F5E 0%, transparent 50%)',
      'radial-gradient(ellipse at 80% 15%, #FDA4AF 0%, transparent 44%)',
      'radial-gradient(ellipse at 15% 75%, #E11D48 0%, transparent 50%)',
      'radial-gradient(ellipse at 70% 80%, #9F1239 0%, transparent 46%)',
      'linear-gradient(155deg, #F43F5E 0%, #BE123C 50%, #4C0519 100%)',
    ].join(', '),
    orb1: '#F43F5E',
    orb2: '#BE123C',
    glow: 'rgba(244,63,94,0.5)',
  },
  {
    icon: Award,
    title: 'Excellence',
    subtitle: 'Highest Standards',
    description: 'Every line of code, every pixel, every interaction — we hold ourselves to the highest standards.',
    stat: '5.0★',
    gradient: [
      'radial-gradient(ellipse at 20% 15%, #F59E0B 0%, transparent 52%)',
      'radial-gradient(ellipse at 80% 20%, #FDE68A 0%, transparent 44%)',
      'radial-gradient(ellipse at 10% 70%, #D97706 0%, transparent 50%)',
      'radial-gradient(ellipse at 75% 80%, #92400E 0%, transparent 48%)',
      'linear-gradient(155deg, #F59E0B 0%, #B45309 50%, #451A03 100%)',
    ].join(', '),
    orb1: '#FBBF24',
    orb2: '#D97706',
    glow: 'rgba(245,158,11,0.5)',
  },
  {
    icon: Rocket,
    title: 'Impact',
    subtitle: 'Real Results',
    description: 'We build solutions that create measurable, lasting value for our clients and their users.',
    stat: '10×',
    gradient: [
      'radial-gradient(ellipse at 20% 20%, #06B6D4 0%, transparent 52%)',
      'radial-gradient(ellipse at 80% 15%, #67E8F9 0%, transparent 44%)',
      'radial-gradient(ellipse at 10% 72%, #0284C7 0%, transparent 50%)',
      'radial-gradient(ellipse at 75% 78%, #0C4A6E 0%, transparent 48%)',
      'linear-gradient(155deg, #06B6D4 0%, #0284C7 50%, #0C4A6E 100%)',
    ].join(', '),
    orb1: '#22D3EE',
    orb2: '#0891B2',
    glow: 'rgba(6,182,212,0.5)',
  },
]

const N = values.length // 4
const CARD_W = 280
const CARD_H = 460

// For n=4, dist is in {-1, 0, 1, 2}
// -1=left, 0=center, 1=right, 2=far-right (barely visible)
function getDist(cardIdx: number, centerIdx: number): number {
  let d = ((cardIdx - centerIdx) % N + N) % N
  if (d > N / 2) d -= N
  return d
}

interface SlotPos { x: number; rotateY: number; scale: number; opacity: number; zIndex: number }

const SLOT: Record<number, SlotPos> = {
  [-1]: { x: -310, rotateY: 46,  scale: 0.73, opacity: 0.78, zIndex: 3 },
  [0]:  { x: 0,    rotateY: 0,   scale: 1.00, opacity: 1.00, zIndex: 10 },
  [1]:  { x: 310,  rotateY: -46, scale: 0.73, opacity: 0.78, zIndex: 3 },
  [2]:  { x: 515,  rotateY: -60, scale: 0.50, opacity: 0.18, zIndex: 1 },
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function Values() {
  const [idx, setIdx]           = useState(0)
  // Each card's key — bumped when that card needs to wrap (remounts with new initial)
  const [cardKeys, setCardKeys] = useState<number[]>([0, 0, 0, 0])
  // Off-screen starting position for wrapping card (null = don't use initial)
  const [initials, setInitials] = useState<(Partial<SlotPos> | null)[]>([null, null, null, null])

  function navigate(newIdx: number) {
    // direction: 1=next (cards shift left), -1=prev (cards shift right)
    const diff = ((newIdx - idx) % N + N) % N
    const direction = diff <= N / 2 ? 1 : -1

    const newKeys     = [...cardKeys]
    const newInitials = initials.map(() => null) as (Partial<SlotPos> | null)[]

    values.forEach((_, i) => {
      const oldDist = getDist(i, idx)
      const newDist = getDist(i, newIdx)
      // A jump > 1 slot means this card is wrapping around
      if (Math.abs(newDist - oldDist) > 1) {
        newKeys[i]++
        const target = SLOT[newDist]
        // Appear from off-screen on the correct side, then spring to target
        newInitials[i] = {
          ...target,
          x:       direction === 1 ? 700 : -540,
          opacity: 0,
        }
      }
    })

    setCardKeys(newKeys)
    setInitials(newInitials)
    setIdx(newIdx)
  }

  // Clear initials after one frame — they only matter at mount time
  useEffect(() => {
    const raf = requestAnimationFrame(() => setInitials([null, null, null, null]))
    return () => cancelAnimationFrame(raf)
  }, [cardKeys])

  const goNext = useCallback(() => navigate((idx + 1) % N), [idx, cardKeys])
  const goPrev = useCallback(() => navigate((idx - 1 + N) % N), [idx, cardKeys])

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[var(--color-surface)]" />
        <motion.div
          key={idx}
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          style={{ background: values[idx].glow.replace('0.5', '0.07') }}
        />
        <motion.div
          className="absolute left-[-5%] top-[20%] h-[500px] w-[500px] rounded-full blur-[130px]"
          style={{ background: `${values[idx].orb2}0D` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
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
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true }}
          >
            <SectionLabel>Our Values</SectionLabel>
            <SectionHeading className="mt-4">What Drives Us</SectionHeading>
          </motion.div>
        </div>

        {/* ── 3D Fan Carousel ── */}
        <div className="mt-20 flex flex-col items-center">
          {/* Cards stage */}
          <div
            className="relative flex items-start justify-center"
            style={{ height: CARD_H + 80, width: '100%', maxWidth: 920 }}
          >
            {values.map((v, i) => {
              const dist    = getDist(i, idx)
              const slot    = SLOT[dist]
              const initial = initials[i]
              const Icon    = v.icon
              const isCenter = dist === 0

              return (
                <motion.div
                  key={cardKeys[i]}
                  initial={initial ?? false}
                  animate={{
                    x:        slot.x,
                    rotateY:  slot.rotateY,
                    scale:    slot.scale,
                    opacity:  slot.opacity,
                    zIndex:   slot.zIndex,
                  }}
                  style={{
                    transformPerspective: 1100,
                    position:   'absolute',
                    top:        0,
                    left:       '50%',
                    marginLeft: -CARD_W / 2,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  whileHover={!isCenter ? { scale: slot.scale * 1.05 } : undefined}
                  onClick={() => {
                    if (dist === 1 || dist === 2) goNext()
                    if (dist === -1) goPrev()
                  }}
                >
                  {/* Glow beneath center card */}
                  {isCenter && (
                    <div
                      className="pointer-events-none absolute -inset-6 rounded-[44px] blur-[55px]"
                      style={{ background: v.glow, opacity: 0.55 }}
                    />
                  )}

                  <div
                    className="relative overflow-hidden rounded-[28px]"
                    style={{
                      width:  CARD_W,
                      height: CARD_H,
                      background: v.gradient,
                      cursor: isCenter ? 'default' : 'pointer',
                      boxShadow: isCenter
                        ? '0 40px 100px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.10)'
                        : '0 20px 50px rgba(0,0,0,0.26)',
                    }}
                  >
                    {/* Animated orbs — only on center card */}
                    <motion.div
                      className="absolute rounded-full blur-[50px]"
                      style={{ width: 170, height: 170, top: '-5%', left: '-5%', background: v.orb1, opacity: 0.55 }}
                      animate={isCenter ? { x: [0, 22, -12, 0], y: [0, -16, 20, 0] } : {}}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute rounded-full blur-[60px]"
                      style={{ width: 190, height: 190, bottom: '22%', right: '-10%', background: v.orb2, opacity: 0.45 }}
                      animate={isCenter ? { x: [0, -22, 16, 0], y: [0, 20, -12, 0] } : {}}
                      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    />
                    <motion.div
                      className="absolute rounded-full blur-[38px]"
                      style={{ width: 110, height: 110, bottom: '8%', left: '10%', background: v.orb1, opacity: 0.28 }}
                      animate={isCenter ? { scale: [1, 1.35, 1] } : {}}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    />

                    {/* Stat badge */}
                    <div
                      className="absolute right-4 top-4 rounded-full px-4 py-1.5 font-mono text-sm font-bold text-white"
                      style={{
                        background:     'rgba(0,0,0,0.30)',
                        border:         '1px solid rgba(255,255,255,0.20)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {v.stat}
                    </div>

                    {/* Icon */}
                    <div className="absolute left-0 right-0 top-[26%] flex justify-center">
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-3xl"
                        style={{
                          background:     'rgba(255,255,255,0.16)',
                          border:         '1px solid rgba(255,255,255,0.28)',
                          backdropFilter: 'blur(10px)',
                          boxShadow:      '0 8px 32px rgba(0,0,0,0.18)',
                        }}
                      >
                        <Icon className="h-10 w-10 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Content panel */}
                    <div
                      className="absolute inset-x-0 bottom-0 px-6 pb-7 pt-5"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 60%, rgba(0,0,0,0) 100%)',
                      }}
                    >
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">
                        {v.subtitle}
                      </p>
                      <h3 className="text-xl font-bold leading-snug text-white">{v.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/68 line-clamp-3">
                        {v.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* ── Controls: [←] [● ● ● ●] [→] ── */}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={goPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-text-secondary shadow-lg transition-all hover:scale-110 hover:border-accent/50 hover:text-accent"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              {values.map((v, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width:     i === idx ? 32 : 8,
                    background: i === idx ? v.orb1 : 'var(--color-card-border)',
                    boxShadow:  i === idx ? `0 0 12px ${v.orb1}90` : 'none',
                  }}
                  aria-label={`Go to ${values[i].title}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
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
