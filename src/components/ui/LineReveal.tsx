'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LineRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function LineReveal({ children, className, delay = 0 }: LineRevealProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        transition={{
          duration: 0.7,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true, margin: '-50px' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
