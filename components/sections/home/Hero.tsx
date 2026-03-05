'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextReveal } from '@/components/ui/TextReveal'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

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

  const orb1X = useSpring(useTransform(mouseX, [-1, 1], [-30, 30]), { stiffness: 100, damping: 30 })
  const orb1Y = useSpring(useTransform(mouseY, [-1, 1], [-20, 20]), { stiffness: 100, damping: 30 })
  const orb2X = useSpring(useTransform(mouseX, [-1, 1], [20, -20]), { stiffness: 80, damping: 40 })
  const orb2Y = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), { stiffness: 80, damping: 40 })
  const orb3X = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), { stiffness: 60, damping: 50 })
  const orb3Y = useSpring(useTransform(mouseY, [-1, 1], [-8, 8]), { stiffness: 60, damping: 50 })

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute right-[10%] top-[15%] h-16 w-16 rounded-full border border-orange/20 bg-orange/10 shadow-[0_0_40px_rgba(255,117,31,0.15)]"
        style={{ x: orb1X, y: orb1Y }}
      />
      <motion.div
        className="absolute left-[15%] top-[60%] h-10 w-10 rounded-full border border-orange/15 bg-orange/5 shadow-[0_0_30px_rgba(255,117,31,0.1)]"
        style={{ x: orb2X, y: orb2Y }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[60%] h-6 w-6 rounded-full bg-orange/20 shadow-[0_0_20px_rgba(255,117,31,0.2)]"
        style={{ x: orb3X, y: orb3Y }}
      />
    </div>
  )
}

function MouseGlow() {
  const glowX = useMotionValue(0)
  const glowY = useMotionValue(0)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    const handler = (e: MouseEvent) => {
      glowX.set(e.clientX)
      glowY.set(e.clientY)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [glowX, glowY])

  const springX = useSpring(glowX, { stiffness: 200, damping: 30 })
  const springY = useSpring(glowY, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 hidden md:block"
      style={{
        background: useTransform(
          [springX, springY],
          ([x, y]: number[]) =>
            `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,117,31,0.04), transparent 70%)`
        ),
      }}
    />
  )
}

export function Hero() {
  return (
    <section className="dot-grid relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] animate-float-slow rounded-full bg-orange opacity-[0.07] blur-[120px] dark:opacity-[0.1]" />
        <div className="absolute -bottom-32 -left-32 h-[600px] w-[600px] animate-float-slower rounded-full bg-[#ffb347] opacity-[0.05] blur-[140px] dark:opacity-[0.08]" />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 animate-float rounded-full bg-orange opacity-[0.04] blur-[100px] dark:opacity-[0.06]" />
      </div>

      {/* Mouse-following dot-grid highlight */}
      <MouseGlow />

      {/* Floating parallax orbs */}
      <FloatingOrbs />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-border px-4 py-2"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-orange">
            AI-Powered Software Company
          </span>
        </motion.div>

        {/* Heading with text reveal */}
        <h1 className="mx-auto max-w-5xl text-6xl font-black leading-none tracking-tighter text-text-primary md:text-7xl lg:text-8xl">
          <TextReveal text="We Build Software" delay={0.1} />
          <br />
          <TextReveal text="That Orbits" delay={0.3} />
          {' '}
          <motion.span
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.55, ease }}
            className="text-gradient inline-block"
          >
            the Future
          </motion.span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl"
        >
          Orbit is a full-service technology company specializing in AI chatbots, model training,
          custom software, and design, built to compete globally.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/contact">
            <Button variant="primary" size="lg" magnetic>
              Start a Project &rarr;
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button variant="ghost" size="lg">
              View Our Work
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6 text-text-tertiary" />
        </motion.div>
      </motion.div>
    </section>
  )
}
