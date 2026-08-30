'use client'

import { forwardRef, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SNAP } from '@/components/motion/motion-config'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'ghost' | 'outline' | 'link' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  magnetic?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Three things came out of this component.
 *
 * The orange bloom (`shadow-accent-glow`) is gone. An outer glow behind a
 * saturated fill is the clearest single tell of a generated interface; weight
 * now comes from the fill itself and from a hairline on the quiet variants.
 *
 * The click ripple is gone. It appended a DOM node on every click and removed
 * it 600ms later, which is a lot of machinery for a Material Design flourish
 * that does not belong to this brand. Press feedback is a 1px drop instead —
 * felt rather than watched.
 *
 * `variant="glow"` still resolves so existing call sites keep working, but it
 * renders as `primary`. There is one accent on this site and it does not
 * gradient.
 */
const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-[#0a0a0a] font-semibold hover:bg-accent-hover',
  glow: 'bg-accent text-[#0a0a0a] font-semibold hover:bg-accent-hover',
  ghost: 'border border-accent/40 text-accent hover:border-accent hover:bg-accent/[0.07]',
  outline: 'border border-border text-text-primary hover:border-accent/60 hover:text-accent',
  link: 'text-accent underline-offset-4 hover:underline px-0 py-0',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-[15px]',
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
      ...props
    },
    forwardedRef
  ) => {
    const innerRef = useRef<HTMLButtonElement>(null)
    const reduce = useReducedMotion()
    const active = magnetic && !reduce && !disabled && !loading

    // Motion values, not state: a magnetic pull driven through `useState`
    // re-renders the tree on every mousemove and stutters on contact.
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.5 })
    const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.5 })

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!active || !innerRef.current) return
      const rect = innerRef.current.getBoundingClientRect()
      // 0.12, down from 0.2. The old pull was strong enough that the button
      // visibly chased the cursor; this reads as give, not as a magnet.
      x.set((e.clientX - rect.left - rect.width / 2) * 0.12)
      y.set((e.clientY - rect.top - rect.height / 2) * 0.12)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    return (
      <motion.button
        ref={(node) => {
          ;(innerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef)
            (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={active ? { x: springX, y: springY } : undefined}
        whileTap={disabled || loading || reduce ? undefined : { y: 1 }}
        transition={SNAP}
        disabled={disabled || loading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-full tracking-[-0.01em]',
          'transition-colors duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          variants[variant],
          variant !== 'link' && sizes[size],
          (disabled || loading) && 'pointer-events-none opacity-45',
          className
        )}
        {...props}
      >
        {loading && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
