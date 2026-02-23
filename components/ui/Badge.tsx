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
        variant === 'default' && 'bg-surface-2 text-gray-1',
        variant === 'orange' && 'bg-orange-dim text-orange',
        variant === 'outline' && 'border border-border text-gray-1',
        className
      )}
    >
      {children}
    </span>
  )
}
