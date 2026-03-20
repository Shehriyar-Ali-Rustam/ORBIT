import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent',
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </span>
  )
}
