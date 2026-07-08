'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease,
    },
  },
}

export function TextReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.04,
}: TextRevealProps) {
  const words = text.split(' ')

  return (
    <motion.span
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className={cn('inline-flex flex-wrap', className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          className="mr-[0.3em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
