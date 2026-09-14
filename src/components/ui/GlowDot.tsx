import { cn } from '@/lib/utils'

interface GlowDotProps {
  className?: string
  color?: 'green' | 'orange' | 'red'
}

const colors = {
  green: 'bg-emerald-500',
  orange: 'bg-accent',
  red: 'bg-red-500',
}

/**
 * A status dot.
 *
 * The `animate-ping` halo is gone. Ping is a notification pattern — it says
 * "something just changed, look here" — and this dot marks a standing fact
 * ("currently accepting projects") that has not changed and will not change
 * while anyone is on the page. A permanent pulse for a permanent state is
 * motion with nothing behind it, and it ran forever on a page where the
 * visitor is trying to fill in a form.
 *
 * A hairline ring gives it presence instead.
 */
export function GlowDot({ className, color = 'green' }: GlowDotProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block h-1.5 w-1.5 shrink-0 rounded-full ring-4 ring-current/10',
        colors[color],
        className
      )}
    />
  )
}
