import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        'text-xs font-semibold uppercase tracking-widest text-orange',
        className
      )}
    >
      {children}
    </span>
  )
}
