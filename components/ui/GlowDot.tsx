import { cn } from '@/lib/utils'

interface GlowDotProps {
  className?: string
  color?: 'green' | 'orange' | 'red'
}

const colors = {
  green: { ping: 'bg-green-400', dot: 'bg-green-500' },
  orange: { ping: 'bg-orange', dot: 'bg-orange' },
  red: { ping: 'bg-red-400', dot: 'bg-red-500' },
}

export function GlowDot({ className, color = 'green' }: GlowDotProps) {
  const c = colors[color]
  return (
    <span className={cn('relative flex h-2 w-2', className)}>
      <span
        className={cn(
          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
          c.ping
        )}
      />
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', c.dot)} />
    </span>
  )
}
