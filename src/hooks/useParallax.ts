'use client'

import { useRef } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

interface UseParallaxOptions {
  speed?: number
}

export function useParallax(options: UseParallaxOptions = {}): {
  ref: React.RefObject<HTMLDivElement>
  y: MotionValue<number>
} {
  const { speed = 0.3 } = options
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100])

  return { ref, y }
}
