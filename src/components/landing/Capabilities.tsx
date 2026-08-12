'use client'

import Link from 'next/link'
import { Bot, Brain, Globe, Smartphone, Palette, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import MotionReveal from './MotionReveal'
import ParallaxImage from './ParallaxImage'
import { CAPABILITIES } from '@/data/landing'

const ICONS: Record<string, LucideIcon> = { Bot, Brain, Globe, Smartphone, Palette }

/** Cards light up under the pointer. CSS vars set on mousemove. */
function trackPointer(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Capabilities() {
  return (
    <section id="services" className="relative border-t border-orbit-line/[0.07]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 20% 0%, rgb(var(--acc-rgb) / 0.045) 0%, transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 py-24 sm:px-6 md:px-10 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <MotionReveal from="left" className="lg:col-span-4">
            <p className="eyebrow accent-rule">What we build</p>
            <h2 className="h-section mt-5 font-semibold text-orbit-ink">
              Five things we do, and{' '}
              <span className="text-orbit-accInk">nothing we don&apos;t.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-orbit-ink/65">
              We are a small studio, so we stay narrow on purpose. If your project falls outside
              this list we will say so on the first call rather than learn it on your budget.
            </p>
          </MotionReveal>

          <div className="lg:col-span-8">
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {CAPABILITIES.map((cap, i) => {
                const Icon = ICONS[cap.icon] ?? Bot
                return (
                  <li key={cap.title}>
                    <MotionReveal delay={Math.min(i * 0.07, 0.3)} className="h-full">
                      <Link
                        href={cap.href}
                        onMouseMove={trackPointer}
                        className="group relative flex h-full flex-col overflow-hidden border border-orbit-line/[0.1] bg-orbit-line/[0.015] transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1.5 hover:border-orbit-accInk/50 hover:bg-orbit-line/[0.035]"
                      >
                        {/* The badge straddles the frame's bottom edge, so it
                            has to live OUTSIDE ParallaxImage — that clips its
                            children to contain the parallax drift, which would
                            slice the badge in half. */}
                        <div className="relative">
                          <ParallaxImage
                            src={cap.image}
                            alt={cap.imageAlt}
                            distance={26}
                            dim
                            wipe
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                            className="aspect-[5/4] w-full"
                          >
                            {/* keeps the mono label legible whatever the photo does */}
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-orbit-canvas/70 via-transparent to-orbit-canvas/35"
                            />
                            <span className="eyebrow absolute left-4 top-3 !text-orbit-accInk">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          </ParallaxImage>

                          <span
                            aria-hidden
                            className="absolute bottom-0 left-3.5 z-10 flex h-9 w-9 translate-y-1/2 items-center justify-center border border-orbit-line/[0.18] bg-orbit-canvas text-orbit-accInk transition-colors duration-300 group-hover:border-orbit-accInk group-hover:bg-orbit-acc group-hover:text-orbit-onAcc sm:left-4 sm:h-11 sm:w-11"
                          >
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.4} />
                          </span>
                        </div>

                        <div className="relative flex flex-1 flex-col gap-2 px-3.5 pb-4 pt-8 sm:gap-2.5 sm:px-4 sm:pb-5 sm:pt-9">
                          {/* cursor-tracking glow */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                              background:
                                'radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgb(var(--acc-rgb) / 0.14), transparent 70%)',
                            }}
                          />
                          <h3 className="relative font-syne text-[13px] font-bold uppercase tracking-[0.12em] text-orbit-ink sm:text-sm">
                            {cap.title}
                          </h3>
                          <p className="relative text-[11px] leading-relaxed text-orbit-ink/65 sm:text-[13px]">
                            {cap.blurb}
                          </p>
                          <span
                            aria-hidden
                            className="relative mt-auto flex items-center gap-2 pt-3 font-spacemono text-[9px] font-bold uppercase tracking-[0.2em] text-orbit-ink/60 transition-colors duration-300 group-hover:text-orbit-accInk"
                          >
                            Explore
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>
                        </div>

                        {/* hazard-stripe tick grows on hover */}
                        <span
                          aria-hidden
                          className="absolute right-0 top-0 h-[3px] w-10 transition-all duration-300 group-hover:w-20"
                          style={{
                            background:
                              'repeating-linear-gradient(135deg, rgb(var(--acc-ink-rgb) / 0.75) 0 6px, transparent 6px 10px)',
                          }}
                        />
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
                    className="group relative flex h-full min-h-[200px] flex-col items-center justify-center gap-4 overflow-hidden border border-orbit-accInk/40 bg-orbit-acc/[0.06] p-6 text-center transition-[transform,background-color] duration-300 hover:-translate-y-1.5 hover:bg-orbit-acc/[0.14]"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
                      style={{
                        background:
                          'radial-gradient(ellipse at 50% 100%, rgb(var(--acc-rgb) / 0.16) 0%, transparent 65%)',
                      }}
                    />
                    <h3 className="relative font-syne text-sm font-bold uppercase tracking-[0.16em] text-orbit-accInk sm:text-base">
                      All services
                    </h3>
                    <span
                      aria-hidden
                      className="relative flex h-9 w-9 items-center justify-center border border-orbit-accInk/50 text-orbit-accInk transition-all duration-300 group-hover:translate-x-1 group-hover:bg-orbit-acc group-hover:text-orbit-onAcc"
                    >
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
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
