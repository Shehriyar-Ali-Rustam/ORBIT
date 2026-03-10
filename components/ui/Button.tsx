'use client'

import { forwardRef, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'ghost' | 'outline' | 'link' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  magnetic?: boolean
  className?: string
  children: React.ReactNode
}

const variants = {
  primary:
    'bg-accent text-[#0a0a0a] font-bold hover:bg-accent-hover shadow-accent-glow-sm hover:shadow-accent-glow',
  ghost: 'border border-accent/30 text-accent hover:bg-accent-dim hover:border-accent/50',
  outline: 'border border-border text-text-primary hover:border-accent/50 hover:text-accent',
  link: 'text-accent hover:underline underline-offset-4',
  glow: 'bg-gradient-brand text-white font-bold shadow-[0_0_40px_rgba(255,117,31,0.3)] hover:shadow-[0_0_60px_rgba(255,117,31,0.4)] hover:scale-105 active:scale-95',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      magnetic = false,
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null)
    const translateX = useMotionValue(0)
    const translateY = useMotionValue(0)
    const springX = useSpring(translateX, { stiffness: 200, damping: 20 })
    const springY = useSpring(translateY, { stiffness: 200, damping: 20 })

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!magnetic || !internalRef.current) return
        const rect = internalRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        translateX.set((e.clientX - centerX) * 0.2)
        translateY.set((e.clientY - centerY) * 0.2)
      },
      [magnetic, translateX, translateY]
    )

    const handleMouseLeave = useCallback(() => {
      translateX.set(0)
      translateY.set(0)
    }, [translateX, translateY])

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (internalRef.current) {
          const rect = internalRef.current.getBoundingClientRect()
          const ripple = document.createElement('span')
          const size = Math.max(rect.width, rect.height)
          ripple.style.width = ripple.style.height = `${size}px`
          ripple.style.left = `${e.clientX - rect.left - size / 2}px`
          ripple.style.top = `${e.clientY - rect.top - size / 2}px`
          ripple.className = 'ripple'
          internalRef.current.appendChild(ripple)
          setTimeout(() => ripple.remove(), 600)
        }
        onClick?.(e as Parameters<NonNullable<typeof onClick>>[0])
      },
      [onClick]
    )

    return (
      <motion.button
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={disabled || loading ? undefined : { scale: 1.02 }}
        whileTap={disabled || loading ? undefined : { scale: 0.98 }}
        style={magnetic ? { x: springX, y: springY } : undefined}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide transition-all duration-300',
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
