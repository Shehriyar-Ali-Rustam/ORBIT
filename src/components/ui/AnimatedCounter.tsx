'use client'

import { useCounter } from '@/hooks/useCounter'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const { ref, inView } = useInView({ threshold: 0.3 })
  const count = useCounter(target, duration, inView)

  return (
    <div ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {count}
      {suffix}
    </div>
  )
}
