import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="h-px w-8 bg-accent/50" />
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
        {children}
      </span>
      <span className="h-px w-8 bg-accent/50" />
    </div>
  )
}
