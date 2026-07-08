import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'orange' | 'outline' | 'accent' | 'primary'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wider',
        variant === 'default' && 'bg-surface-2 text-text-secondary',
        variant === 'orange' && 'bg-accent-dim text-accent',
        variant === 'accent' && 'bg-accent-dim text-accent',
        variant === 'primary' && 'bg-primary-dim text-primary',
        variant === 'outline' && 'border border-border text-text-secondary',
        className
      )}
    >
      {children}
    </span>
  )
}
