'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  className?: string
  children: React.ReactNode
  hover?: boolean
  tilt?: boolean
  gradientBorder?: boolean
  glass?: boolean
}

export function Card({
  className,
  children,
  hover = true,
  tilt = false,
  gradientBorder = false,
  glass = false,
  ...props
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      style={tilt ? { rotateX, rotateY, perspective: 800 } : undefined}
      className={cn(
        'rounded-2xl border p-6 transition-all duration-300',
        glass
          ? 'glass-card backdrop-blur-sm'
          : 'border-[var(--color-card-border)] bg-[var(--color-card-bg)]',
        hover && 'card-hover',
        gradientBorder && 'gradient-border-animated',
        'group relative overflow-hidden',
        className
      )}
      {...props}
    >
      {/* Hover gradient overlay */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
