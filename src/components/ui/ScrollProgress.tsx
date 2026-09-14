'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Reading-progress rule pinned to the top of the viewport.
 *
 * Two changes from the original. The fill was a `#FF751F → #FF9A56` gradient,
 * which is a gradient nobody can perceive on a 2px bar and which put a second
 * brand colour on screen for no reason; it is now the flat accent. And the
 * scale is spring-smoothed, so a trackpad flick settles instead of snapping —
 * scroll position is noisy, and binding a transform straight to it shows that
 * noise.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}
