'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

interface ScrollProgressProps {
  /**
   * Position, thickness and colour. These are the only things the two mounts
   * ever disagreed on: the landing page sits its bar under a fixed nav and
   * paints with the `.ds` token, the marketing pages pin theirs to the top
   * edge with the app token. Everything else — the scroll binding, the spring,
   * the transform — was identical and duplicated.
   */
  className?: string
}

/**
 * Reading-progress rule.
 *
 * Spring-smoothed rather than bound straight to scroll position: a trackpad
 * flick produces noisy input, and a transform driven directly off it shows
 * that noise as jitter.
 */
export function ScrollProgress({
  className = 'fixed inset-x-0 top-0 z-[60] h-px bg-accent',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  return <motion.div aria-hidden style={{ scaleX }} className={`origin-left ${className}`} />
}
