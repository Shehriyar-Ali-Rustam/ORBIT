'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const heroImages = [
  '/fotis-fotopoulos-6sAl6aQ4OWI-unsplash.jpg',
  '/kier-in-sight-archives-3Nwt6w-KU3E-unsplash.jpg',
  '/markus-spiske-iar-afB0QQw-unsplash.jpg',
  '/minh-pham-HI6gy-p-WBI-unsplash.jpg',
  '/onur-binay-_yC2htzMYnI-unsplash.jpg',
]

function DynamicBackground() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {heroImages.map((src, i) => (
        <motion.div
          key={src}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === currentIndex ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
          />
        </motion.div>
      ))}
    </>
  )
}

function AnimatedBeams() {
  return null
}

function FloatingOrbs() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [mouseX, mouseY])

  const spring = { stiffness: 100, damping: 30 }
  const orb1X = useSpring(useTransform(mouseX, [-1, 1], [-40, 40]), spring)
  const orb1Y = useSpring(useTransform(mouseY, [-1, 1], [-30, 30]), spring)
  const orb2X = useSpring(useTransform(mouseX, [-1, 1], [25, -25]), { stiffness: 80, damping: 40 })
  const orb2Y = useSpring(useTransform(mouseY, [-1, 1], [20, -20]), { stiffness: 80, damping: 40 })

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute right-[8%] top-[20%] h-32 w-32 rounded-full bg-[#FF751F]/15 blur-[80px]"
        style={{ x: orb1X, y: orb1Y }}
      />
      <motion.div
        className="absolute left-[10%] top-[60%] h-24 w-24 rounded-full bg-[#FF9A56]/10 blur-[60px]"
        style={{ x: orb2X, y: orb2Y }}
      />
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -80])

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Dynamic background — cycles through tech images */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
        <DynamicBackground />
        {/* Dark overlay — always dark regardless of theme */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,10,10,0.55)' }} />
        {/* Edge vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.65) 0%, transparent 40%, rgba(10,10,10,1) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.25) 0%, transparent 50%, rgba(10,10,10,0.25) 100%)' }} />
      </motion.div>

      <AnimatedBeams />
      <FloatingOrbs />

      {/* Content — parallax fade on scroll */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 py-32 lg:px-8"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="rounded-3xl border border-white/[0.12] p-8 shadow-[0_8px_64px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-12 md:p-16" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          {/* Subtle orange glow on edges */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-[#FF751F]/[0.06] via-transparent to-[#FF751F]/[0.03]" />

          <div className="relative text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#FF751F]/20 bg-[#FF751F]/5 px-4 py-2 backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-[#FF751F] animate-pulse-dot" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF751F]">
                AI-Powered Software Company
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl font-black leading-[0.92] tracking-tighter text-white md:text-6xl lg:text-7xl">
              <TextReveal text="We Build Software" delay={0.1} />
              <br />
              <TextReveal text="That Orbits" delay={0.3} />
              {' '}
              <motion.span
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.55, ease }}
                className="text-gradient inline-block"
              >
                the Future
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.65, ease }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300"
            >
              Full-service technology company specializing in AI chatbots, model training,
              custom software, and design. Built to compete globally.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <Link href="/contact">
                <Button variant="glow" size="lg" magnetic>
                  Start a Project
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="ghost" size="lg">
                  View Our Work
                </Button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8, ease }}
              className="mt-12 flex justify-center gap-6 border-t border-white/[0.08] pt-8 sm:gap-12"
            >
              {[
                { value: '101+', label: 'Projects' },
                { value: '100+', label: 'Clients' },
                { value: '5.0', label: 'Rating' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.6, ease }}
                >
                  <p className="font-mono text-2xl font-bold text-[#FF751F]">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-neutral-500">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Orbit AI card */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8, ease }}
              className="mx-auto mt-8 max-w-xs rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-md transition-all duration-500 hover:border-[#FF751F]/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand">
                  <span className="text-sm font-bold text-white">O</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Orbit AI Engine</p>
                  <p className="text-xs text-neutral-500">Processing 1.2M tokens/sec</p>
                </div>
                <div className="ml-auto flex h-8 items-center rounded-full bg-[#FF751F]/10 px-3">
                  <span className="h-2 w-2 rounded-full bg-[#FF751F] animate-pulse-dot" />
                  <span className="ml-2 font-mono text-xs font-bold text-[#FF751F]">LIVE</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Image indicators */}
      <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, i) => (
          <div key={i} className="h-1 w-8 overflow-hidden rounded-full bg-white/20">
            <motion.div
              className="h-full bg-[#FF751F]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 6, ease: 'linear' }}
            />
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6 text-neutral-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
