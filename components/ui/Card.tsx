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
}

export function Card({
  className,
  children,
  hover = true,
  tilt = false,
  gradientBorder = false,
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
        'rounded-xl border border-border bg-surface p-6',
        hover && 'card-hover',
        gradientBorder && 'gradient-border-animated',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
