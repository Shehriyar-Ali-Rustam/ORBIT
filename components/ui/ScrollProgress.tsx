'use client'

import { motion, useScroll } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[9999] h-[2px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #FF751F, #FF9A56)',
      }}
    />
  )
}
