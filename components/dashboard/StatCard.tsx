import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  className?: string
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-dim">
          <Icon className="h-5 w-5 text-orange" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-500">{trend}</span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-text-primary">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </div>
  )
}
