'use client'

import Link from 'next/link'
import { Bot, Brain, Globe, Smartphone, Palette, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import MotionReveal from './MotionReveal'
import { CAPABILITIES } from '@/data/landing'

const ICONS: Record<string, LucideIcon> = { Bot, Brain, Globe, Smartphone, Palette }

/** Cards light up under the pointer — CSS vars set on mousemove. */
function trackPointer(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Capabilities() {
  return (
    <section id="services" className="relative border-t border-white/5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 0%, rgba(255,117,31,0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 py-24 sm:px-6 md:px-10 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <MotionReveal from="left" className="lg:col-span-4">
            <p className="eyebrow accent-rule">What we build</p>
            <h2 className="h-section mt-5 font-semibold text-orbit-greyLight">
              Five things we do, and{' '}
              <span className="text-orbit-acc">nothing we don&apos;t.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-orbit-greyLight/65">
              We are a small studio, so we stay narrow on purpose. If your project falls outside
              this list we will say so on the first call rather than learn it on your budget.
            </p>
          </MotionReveal>

          <div className="lg:col-span-8">
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {CAPABILITIES.map((cap, i) => {
                const Icon = ICONS[cap.icon] ?? Bot
                return (
                  <li key={cap.title}>
                    <MotionReveal delay={Math.min(i * 0.05, 0.3)} className="h-full">
                      <Link
                        href={cap.href}
                        onMouseMove={trackPointer}
                        className="group relative flex h-full flex-col items-center gap-4 overflow-hidden border border-white/[0.08] bg-white/[0.02] p-4 text-center transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-orbit-acc/60 hover:bg-white/[0.04] sm:gap-5 sm:p-6 md:p-7"
                      >
                        {/* diagonal texture band */}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              'repeating-linear-gradient(125deg, transparent 0 38px, rgba(255,255,255,0.025) 38px 76px)',
                          }}
                        />
                        {/* cursor-tracking glow */}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background:
                              'radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(255,117,31,0.18), transparent 70%)',
                          }}
                        />
                        {/* hazard-stripe corner tick */}
                        <span
                          aria-hidden
                          className="absolute left-4 top-3 h-[3px] w-12 transition-all duration-300 group-hover:w-20"
                          style={{
                            background:
                              'repeating-linear-gradient(135deg, rgba(255,117,31,0.7) 0 6px, transparent 6px 10px)',
                          }}
                        />

                        <Icon
                          className="relative mt-3 h-10 w-10 text-orbit-greyLight/80 transition-colors duration-300 group-hover:text-orbit-acc sm:h-12 sm:w-12 md:h-14 md:w-14"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                        <h3 className="relative font-syne text-sm font-bold uppercase tracking-[0.16em] text-orbit-greyLight sm:text-base">
                          {cap.title}
                        </h3>
                        <p className="relative max-w-[22ch] text-xs leading-relaxed text-orbit-greyLight/60 sm:text-sm">
                          {cap.blurb}
                        </p>
                        <span
                          aria-hidden
                          className="relative mt-auto flex h-9 w-9 items-center justify-center border border-orbit-acc/50 text-orbit-acc transition-colors duration-300 group-hover:bg-orbit-acc group-hover:text-orbit-black"
                        >
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                      </Link>
                    </MotionReveal>
                  </li>
                )
              })}

              {/* Inverted "see all" card closes the grid */}
              <li>
                <MotionReveal delay={0.3} className="h-full">
                  <Link
                    href="/services"
                    className="group relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden border border-orbit-acc/40 bg-orbit-acc/[0.06] p-6 text-center transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-orbit-acc/[0.12]"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(ellipse at 50% 100%, rgba(255,117,31,0.28) 0%, transparent 65%)',
                      }}
                    />
                    <h3 className="relative font-syne text-sm font-bold uppercase tracking-[0.16em] text-orbit-acc sm:text-base">
                      All services
                    </h3>
                    <span
                      aria-hidden
                      className="relative text-orbit-acc transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </MotionReveal>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
