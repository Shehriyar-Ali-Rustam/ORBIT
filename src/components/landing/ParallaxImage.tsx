'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { DS_EASE } from './MotionReveal'

type Props = {
  src: string
  alt: string
  /** Travel in pixels across the whole scroll pass. Keep under ~70 or the crop shows. */
  distance?: number
  sizes?: string
  priority?: boolean
  className?: string
  /** Desaturate until hover. Set by the parent's `group` hover state. */
  dim?: boolean
  /** Wipe the image in the first time it enters view. */
  wipe?: boolean
  children?: React.ReactNode
}

/**
 * An image that drifts against the scroll inside a fixed frame.
 *
 * The inner layer is deliberately taller than the frame (-top-[12%] h-[124%])
 * so the drift never exposes an edge. Motion is disabled outright under
 * prefers-reduced-motion rather than merely shortened.
 */
export default function ParallaxImage({
  src,
  alt,
  distance = 44,
  sizes = '100vw',
  priority = false,
  className = '',
  dim = false,
  wipe = false,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Spring keeps the drift from feeling pinned to the scrollbar.
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.3 })
  const y = useTransform(smooth, [0, 1], [distance, -distance])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0 -top-[12%] h-[124%]" style={reduce ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          sizes={sizes}
          className={`object-cover transition-[transform,filter] duration-700 ${
            dim
              ? 'saturate-[0.6] group-hover:saturate-100 group-hover:scale-[1.05]'
              : 'group-hover:scale-[1.04]'
          }`}
        />
      </motion.div>

      {/* One-time wipe as the frame enters view */}
      {wipe && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-bottom bg-orbit-canvas"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: DS_EASE }}
        />
      )}

      {children}
    </div>
  )
}
