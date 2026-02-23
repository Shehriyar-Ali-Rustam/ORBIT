'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'ghost' | 'outline' | 'link'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  className?: string
  children: React.ReactNode
}

const variants = {
  primary:
    'bg-orange text-white hover:bg-orange-hover shadow-orange-glow-sm hover:shadow-orange-glow',
  ghost: 'border border-orange text-orange hover:bg-orange-dim',
  outline: 'border border-border text-white hover:border-orange',
  link: 'text-orange hover:underline underline-offset-4',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { scale: 1.02 }}
        whileTap={disabled || loading ? undefined : { scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded font-bold uppercase tracking-wide transition-colors',
          variants[variant],
          sizes[size],
          (disabled || loading) && 'cursor-not-allowed opacity-40',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
