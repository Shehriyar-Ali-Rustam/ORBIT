'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  className?: string
  children: React.ReactNode
  hover?: boolean
}

export function Card({ className, children, hover = true, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-xl border border-border bg-surface p-6',
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
