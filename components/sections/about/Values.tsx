'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lightbulb, Heart, Award, Rocket, Users } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    subtitle: 'Push Boundaries',
    description: 'We embrace new technologies and bold ideas to solve problems in ways nobody has tried before.',
    stat: '#1',
    gradient: 'linear-gradient(160deg, #7C3AED 0%, #4338CA 55%, #1E1B4B 100%)',
    orb: '#A78BFA',
  },
  {
    icon: Heart,
    title: 'Integrity',
    subtitle: 'Client First',
    description: "We are honest, transparent, and always put our clients' interests first — no shortcuts, ever.",
    stat: '100%',
    gradient: 'linear-gradient(160deg, #E11D48 0%, #9F1239 55%, #4C0519 100%)',
    orb: '#FDA4AF',
  },
  {
    icon: Award,
    title: 'Excellence',
    subtitle: 'Highest Standards',
    description: 'Every line of code, every pixel, every interaction — we hold ourselves to the highest standards.',
    stat: '5.0★',
    gradient: 'linear-gradient(160deg, #D97706 0%, #92400E 55%, #451A03 100%)',
    orb: '#FDE68A',
  },
  {
    icon: Rocket,
    title: 'Impact',
    subtitle: 'Real Results',
    description: 'We build solutions that create measurable, lasting value for our clients and their users.',
    stat: '10×',
    gradient: 'linear-gradient(160deg, #0891B2 0%, #0C4A6E 55%, #082F49 100%)',
    orb: '#67E8F9',
  },
  {
    icon: Users,
    title: 'Collaboration',
    subtitle: 'Better Together',
    description: 'We work as true partners — sharing context, feedback, and ownership at every step of the journey.',
    stat: '∞',
    gradient: 'linear-gradient(160deg, #059669 0%, #064E3B 55%, #022C22 100%)',
    orb: '#6EE7B7',
  },
]

const N        = values.length
const CARD_W   = 242
const CARD_H   = 440

// ── Slot positions: symmetric fan for all 5 cards ──
// dist -2/+2 = far cards (tilted, visible but receded)
// dist -1/+1 = near side cards
// dist 0     = center (hero card)
interface SlotPos { x: number; rotateY: number; scale: number; opacity: number; zIndex: number }

const SLOT: Record<number, SlotPos> = {
  [-2]: { x: -520, rotateY:  54, scale: 0.56, opacity: 0.58, zIndex: 1  },
  [-1]: { x: -278, rotateY:  30, scale: 0.79, opacity: 0.85, zIndex: 4  },
  [ 0]: { x:    0, rotateY:   0, scale: 1.00, opacity: 1.00, zIndex: 10 },
  [ 1]: { x:  278, rotateY: -30, scale: 0.79, opacity: 0.85, zIndex: 4  },
  [ 2]: { x:  520, rotateY: -54, scale: 0.56, opacity: 0.58, zIndex: 1  },
}

// Mobile: single-card view with directional fade
const MOBILE_SLOT: Record<number, SlotPos> = {
  [-2]: { x: -24, rotateY: 0, scale: 0.9,  opacity: 0, zIndex: 1  },
  [-1]: { x: -12, rotateY: 0, scale: 0.95, opacity: 0, zIndex: 4  },
  [ 0]: { x:   0, rotateY: 0, scale: 1.00, opacity: 1, zIndex: 10 },
  [ 1]: { x:  12, rotateY: 0, scale: 0.95, opacity: 0, zIndex: 4  },
  [ 2]: { x:  24, rotateY: 0, scale: 0.9,  opacity: 0, zIndex: 1  },
}

function getDist(cardIdx: number, centerIdx: number): number {
  let d = ((cardIdx - centerIdx) % N + N) % N
  if (d > Math.floor(N / 2)) d -= N
  return d // -2, -1, 0, 1, 2
}

const SPRING = { type: 'spring', stiffness: 280, damping: 32 } as const

export function Values() {
  const [idx,      setIdx]      = useState(0)
  const [cardKeys, setCardKeys] = useState<number[]>(Array.from({ length: N }, () => 0))
  const [initials, setInitials] = useState<(Partial<SlotPos> | null)[]>(Array.from({ length: N }, () => null))
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function navigate(newIdx: number) {
    const diff      = ((newIdx - idx) % N + N) % N
    const direction = diff <= Math.floor(N / 2) ? 1 : -1

    const newKeys     = [...cardKeys]
    const newInitials = Array.from({ length: N }, () => null) as (Partial<SlotPos> | null)[]

    values.forEach((_, i) => {
      const oldDist = getDist(i, idx)
      const newDist = getDist(i, newIdx)
      // wrap = jump of more than 1 slot (only possible when a card cycles around)
      if (Math.abs(newDist - oldDist) > 2) {
        newKeys[i]++
        const target = SLOT[newDist]
        newInitials[i] = {
          ...target,
          x:       direction === 1 ? 720 : -580,
          opacity: 0,
        }
      }
    })

    setCardKeys(newKeys)
    setInitials(newInitials)
    setIdx(newIdx)
  }

  // Clear initials after mount (only used once per remount)
  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      setInitials(Array.from({ length: N }, () => null))
    )
    return () => cancelAnimationFrame(raf)
  }, [cardKeys])

  const goNext = () => navigate((idx + 1) % N)
  const goPrev = () => navigate((idx - 1 + N) % N)

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

  return (
    <section className="section-padding relative overflow-hidden">
      {/* ── Clean background: single centered radial, no color shifts ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[var(--color-surface)]" />
        {/* Subtle center radial — always white/neutral */}
        <div
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
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

        {/* ── Cards stage ── */}
        <div className="mt-20 flex flex-col items-center">
          <div
            className="relative"
            style={{ height: CARD_H + 60, width: '100%', maxWidth: isMobile ? CARD_W + 48 : 1160 }}
          >
            {values.map((v, i) => {
              const dist     = getDist(i, idx)
              const slot     = (isMobile ? MOBILE_SLOT : SLOT)[dist]
              const initial  = initials[i]
              const isCenter = dist === 0
              const Icon     = v.icon

              return (
                <motion.div
                  key={cardKeys[i]}
                  initial={initial ?? false}
                  animate={{
                    x:       slot.x,
                    rotateY: slot.rotateY,
                    scale:   slot.scale,
                    opacity: slot.opacity,
                    zIndex:  slot.zIndex,
                  }}
                  style={{
                    transformPerspective: 1200,
                    position:   'absolute',
                    top:        0,
                    left:       '50%',
                    marginLeft: -CARD_W / 2,
                    cursor:     isCenter ? 'default' : 'pointer',
                  }}
                  transition={SPRING}
                  whileHover={!isCenter && !isMobile ? { scale: slot.scale * 1.04, opacity: Math.min(slot.opacity + 0.12, 1) } : undefined}
                  onClick={() => {
                    if (isMobile) return
                    if (dist > 0) goNext()
                    if (dist < 0) goPrev()
                  }}
                >
                  {/* Soft drop-shadow for center card only */}
                  {isCenter && (
                    <div
                      className="pointer-events-none absolute inset-x-0 -bottom-6 mx-auto h-8 rounded-full blur-xl"
                      style={{ width: '70%', background: `${v.orb}55` }}
                    />
                  )}

                  <div
                    className="relative overflow-hidden rounded-[24px]"
                    style={{
                      width:     CARD_W,
                      height:    CARD_H,
                      background: v.gradient,
                      boxShadow: isCenter
                        ? '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)'
                        : '0 12px 40px rgba(0,0,0,0.22)',
                    }}
                  >
                    {/* Single orb — only animated on center card */}
                    <div
                      className="absolute rounded-full blur-[60px]"
                      style={{
                        width: 180, height: 180,
                        top: '-10%', right: '-10%',
                        background: v.orb,
                        opacity: isCenter ? 0.35 : 0.20,
                      }}
                    />

                    {/* Stat badge — top left */}
                    <div
                      className="absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-xs font-bold text-white"
                      style={{
                        background:     'rgba(0,0,0,0.28)',
                        border:         '1px solid rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      {v.stat}
                    </div>

                    {/* Icon — upper center */}
                    <div className="absolute left-0 right-0 top-[24%] flex justify-center">
                      <div
                        className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl"
                        style={{
                          background:     'rgba(255,255,255,0.14)',
                          border:         '1px solid rgba(255,255,255,0.24)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <Icon className="h-9 w-9 text-white" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Content panel — bottom fade */}
                    <div
                      className="absolute inset-x-0 bottom-0 px-5 pb-6 pt-12"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 55%, transparent 100%)',
                      }}
                    >
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                        {v.subtitle}
                      </p>
                      <h3 className="text-[1.15rem] font-bold text-white">{v.title}</h3>
                      <p className="mt-1.5 text-[0.78rem] leading-relaxed text-white/60 line-clamp-3">
                        {v.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* ── Controls: [←] [● ● ● ● ●] [→] ── */}
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-text-secondary shadow-md transition-all hover:scale-110 hover:border-accent/50 hover:text-accent"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {values.map((v, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width:      i === idx ? 28 : 6,
                    background: i === idx ? v.orb : 'var(--color-card-border)',
                    boxShadow:  i === idx ? `0 0 10px ${v.orb}80` : 'none',
                  }}
                  aria-label={`Go to ${values[i].title}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-text-secondary shadow-md transition-all hover:scale-110 hover:border-accent/50 hover:text-accent"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
