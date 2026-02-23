import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'orange' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold tracking-wider',
        variant === 'default' && 'bg-surface-2 text-text-secondary',
        variant === 'orange' && 'bg-orange-dim text-orange',
        variant === 'outline' && 'border border-border text-text-secondary',
        className
      )}
    >
      {children}
    </span>
  )
}
