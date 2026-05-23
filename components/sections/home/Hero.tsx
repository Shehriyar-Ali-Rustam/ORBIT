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

function CornerBrackets() {
  const corners = [
    'top-0 left-0',
    'top-0 right-0 rotate-90',
    'bottom-0 left-0 -rotate-90',
    'bottom-0 right-0 rotate-180',
  ]
  return (
    <>
      {corners.map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease }}
          className={`pointer-events-none absolute h-8 w-8 ${pos}`}
        >
          <span className="absolute left-0 top-0 h-px w-full bg-[#FF751F]/40" />
          <span className="absolute left-0 top-0 h-full w-px bg-[#FF751F]/40" />
        </motion.div>
      ))}
    </>
  )
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
    <section ref={sectionRef} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Dynamic background — cycles through tech images */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
        <DynamicBackground />
        {/* Dark overlay — heavier so the hero text reads cleanly */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,10,10,0.72)' }} />
        {/* Center darkening spotlight behind the heading */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.55) 0%, transparent 65%)' }} />
        {/* Edge vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, transparent 35%, rgba(10,10,10,1) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.4) 0%, transparent 50%, rgba(10,10,10,0.4) 100%)' }} />
      </motion.div>

      <AnimatedBeams />
      <FloatingOrbs />

      {/* Content — parallax fade on scroll, no card container */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32 lg:px-8"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Radial spotlight glow behind heading */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF751F]/[0.08] blur-[120px]" />

        {/* Editorial corner brackets */}
        <CornerBrackets />

        {/* Side coordinate label — left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 -rotate-90 origin-center md:block"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">
            <span className="text-[#FF751F]">●</span>  v.2026 / orbit.systems
          </span>
        </motion.div>

        {/* Side coordinate label — right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rotate-90 origin-center md:block"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500">
            33.6844°N / 73.0479°E  <span className="text-[#FF751F]">●</span>
          </span>
        </motion.div>

        <div className="relative text-center">
          {/* Top marker */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, ease }}
            className="mx-auto mb-12 flex items-center justify-center gap-3"
          >
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#FF751F]/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF751F] shadow-[0_0_12px_rgba(255,117,31,0.8)] animate-pulse-dot" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#FF751F]/60" />
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.025em] text-white sm:text-5xl md:text-6xl lg:text-[4.5rem]">
            <TextReveal text="We Build Software" delay={0.1} />
            <br />
            <span className="inline-flex flex-wrap items-baseline justify-center gap-x-3">
              <TextReveal text="That Orbits" delay={0.3} />
              <motion.span
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.55, ease }}
                className="text-gradient inline-block"
              >
                the Future
              </motion.span>
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.65, ease }}
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg"
          >
            Full-service technology company specializing in AI chatbots, model training,
            custom software, and design. <span className="text-white">Built to compete globally.</span>
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

          {/* Stats row — vertical separators, no top border */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease }}
            className="mt-16 flex items-center justify-center gap-6 sm:gap-10"
          >
            {[
              { value: '101+', label: 'Projects' },
              { value: '100+', label: 'Clients' },
              { value: '5.0', label: 'Rating' },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <span className="h-10 w-px bg-white/[0.08]" />}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.6, ease }}
                >
                  <p className="font-mono text-2xl font-bold text-[#FF751F]">{stat.value}</p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">{stat.label}</p>
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>

          {/* Orbit AI live pill — minimal, no card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease }}
            className="mx-auto mt-12 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-black/30 px-4 py-2 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF751F] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF751F]" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-300">
              Orbit AI Engine <span className="text-neutral-500">/</span> <span className="text-[#FF751F]">1.2M tok/s</span>
            </span>
          </motion.div>
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
