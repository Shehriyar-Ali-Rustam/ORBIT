import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  className?: string
}

export function StatCard({ icon: Icon, label, value, subtext, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-5', className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-dim">
          <Icon className="h-5 w-5 text-orange" />
        </div>
        <div>
          <p className="text-xs text-text-tertiary">{label}</p>
          <p className="text-xl font-bold text-text-primary">{value}</p>
          {subtext && <p className="text-xs text-text-tertiary">{subtext}</p>}
        </div>
      </div>
    </div>
  )
}
