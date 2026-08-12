'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import QuickActions from './QuickActions'
import { DS_EASE } from './MotionReveal'
import { CARD } from '@/data/landing'

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: DS_EASE, delay },
})

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Photograph. Dark desk, warm ambient light — chosen because it already
          carries the brand orange rather than having it tinted on afterwards. */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/fotis-fotopoulos-6sAl6aQ4OWI-unsplash.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Three stacked scrims — this is what keeps the copy readable over
          photography at any viewport. Do not remove one and keep the others. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-orbit-black/80 via-orbit-black/70 to-orbit-black"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 15% 72%, rgba(13,13,13,0.94) 0%, rgba(13,13,13,0.62) 40%, transparent 74%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-orbit-black"
      />
      {/* Fourth, top-left only: the photo has UI clutter up there that fights
          the eyebrow at desktop widths. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 0% 20%, rgba(13,13,13,0.85) 0%, transparent 70%)',
        }}
      />

      {/* Ambient bloom + blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 80% 8%, rgba(255,117,31,0.18) 0%, transparent 58%)',
        }}
      />
      <div aria-hidden className="grid-faint pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-end px-5 pb-14 pt-28 sm:px-6 md:min-h-[92vh] md:px-10 md:pb-20 md:pt-44">
        <motion.p {...enter(0)} className="eyebrow accent-rule">
          Orbit — Islamabad, Pakistan
        </motion.p>

        <motion.h1
          {...enter(0.15)}
          className="h-hero mt-5 max-w-4xl font-bold text-orbit-greyLight md:mt-6"
        >
          AI, web and mobile products,{' '}
          <span className="glow-acc text-orbit-acc">built end to end.</span>
        </motion.h1>

        <motion.p
          {...enter(0.35)}
          className="mt-5 max-w-xl text-base leading-relaxed text-orbit-greyLight/85 md:mt-8 md:text-lg"
        >
          A software studio in Islamabad. Ten projects shipped for clients across eight countries —
          chatbots, trained models, web platforms and mobile apps.
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
            className="block h-6 w-px bg-orbit-acc/60"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* Location strip closes the hero and doubles as the first divider */}
      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-8 gap-y-2 px-5 py-4 sm:px-6 md:px-10">
          <span className="eyebrow">{CARD.hours}</span>
          <span className="eyebrow !text-orbit-greyLight/35">{CARD.locationDetail}</span>
        </div>
      </div>
    </section>
  )
}
