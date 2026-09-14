'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import QuickActions from './QuickActions'
import { EASE } from '@/components/motion/motion-config'
import { CARD } from '@/data/landing'

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
})

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // Photo drifts down and dims as the hero leaves; copy lifts slightly faster,
  // so the two layers separate on the way out instead of moving as one slab.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} id="top" className="relative overflow-hidden">
      {/* Photograph. Bright daylit desk with code on screen — a light canvas
          needs a light photograph, or the hero reads as a dark slab bolted to
          the top of a white page. */}
      <motion.div
        className="absolute inset-0"
        aria-hidden
        style={reduce ? undefined : { y: photoY, scale: photoScale }}
      >
        <Image
          src="/images/landing/hero-light.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Stacked scrims — this is what keeps the copy readable over photography
          at any viewport. On a white canvas they have to be gentler than on a
          dark one: push them as far as the dark version and the photograph
          disappears into the page entirely. The copy sits bottom-left, so the
          veil is heaviest there and the image is left to breathe top-right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-orbit-canvas/75 via-orbit-canvas/60 to-orbit-canvas md:from-orbit-canvas/55 md:via-orbit-canvas/25"
      />
      {/* Left-weighted veil, desktop only. On mobile the copy runs the full
          width, so there is no clear side to give back to the photograph. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-orbit-canvas via-orbit-canvas/70 to-transparent md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 15% 72%, rgb(var(--canvas-rgb) / 0.92) 0%, rgb(var(--canvas-rgb) / 0.5) 42%, transparent 74%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-orbit-canvas"
      />
      {/* Fourth, top-left only: the photo has UI clutter up there that fights
          the eyebrow at desktop widths. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 0% 20%, rgb(var(--canvas-rgb) / 0.6) 0%, transparent 70%)',
        }}
      />

      {/* Ambient bloom + blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 80% 8%, rgb(var(--acc-rgb) / 0.14) 0%, transparent 58%)',
        }}
      />
      <div aria-hidden className="grid-faint pointer-events-none absolute inset-0 opacity-25" />

      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-end px-5 pb-14 pt-28 sm:px-6 md:min-h-[92vh] md:px-10 md:pb-20 md:pt-44"
      >
        <motion.p {...enter(0)} className="eyebrow accent-rule">
          {/* Location lives in the strip at the foot of this section, so the
              eyebrow carries the name alone and stays on one line on a phone. */}
          Orbit Innovations
        </motion.p>

        <motion.h1
          {...enter(0.15)}
          className="h-hero mt-5 max-w-4xl font-bold text-orbit-ink md:mt-6"
        >
          AI, web and mobile products,{' '}
          <span className="glow-acc text-orbit-accInk">built end to end.</span>
        </motion.h1>

        <motion.p
          {...enter(0.35)}
          className="mt-5 max-w-xl text-base leading-relaxed text-orbit-ink/85 md:mt-8 md:text-lg"
        >
          A software studio in Islamabad. Ten projects, eight countries.
        </motion.p>

        {/* Contact before navigation: this page is reached by pointing a camera
            at a business card, so reaching us is the primary action, not a CTA. */}
        <motion.div {...enter(0.5)} className="mt-7 md:mt-10">
          <p className="eyebrow mb-3">Reach us directly</p>
          <QuickActions />
        </motion.div>

        <motion.div {...enter(0.65)} className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-7">
          <Link href="#contact" className="btn-primary">
            Start a project <span aria-hidden>↗</span>
          </Link>
          <Link href="#work" className="btn-ghost">
            See the work <span aria-hidden>→</span>
          </Link>
        </motion.div>

        <motion.div
          {...enter(0.85)}
          className="mt-10 hidden items-center gap-3 md:flex"
          aria-hidden
        >
          <span className="eyebrow">Scroll</span>
          <motion.span
            className="block h-6 w-px bg-orbit-accInk/60"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Location strip closes the hero and doubles as the first divider */}
      <div className="relative border-t border-orbit-line/[0.07]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-8 gap-y-2 px-5 py-4 sm:px-6 md:px-10">
          <span className="eyebrow">{CARD.hours}</span>
          <span className="eyebrow !text-orbit-ink/60">{CARD.locationDetail}</span>
        </div>
      </div>
    </section>
  )
}
