'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Hairline accent bar across the top, tracking read position. Sits directly
 * under the fixed nav so the two read as one edge rather than two bars.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.25 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-[67px] z-50 h-[2px] origin-left bg-orbit-acc md:top-[79px]"
    />
  )
}
