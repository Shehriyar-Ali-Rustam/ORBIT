'use client'

import { CheckCircle, Circle } from 'lucide-react'
import type { OrderStatus } from '@/types/marketplace'
import { cn } from '@/lib/utils'

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'active', label: 'Order Placed' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'completed', label: 'Completed' },
]

interface OrderTimelineProps {
  currentStatus: OrderStatus
  createdAt: string
  completedAt?: string | null
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const statusIndex = TIMELINE_STEPS.findIndex((s) => s.status === currentStatus)
  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'disputed'

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        <Circle className="h-4 w-4" />
        Order {currentStatus}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {TIMELINE_STEPS.map((step, i) => {
        const isPast = i <= statusIndex
        const isCurrent = i === statusIndex

        return (
          <div key={step.status} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full',
                isPast ? 'bg-orange text-white' : 'bg-surface text-text-tertiary border border-border'
              )}>
                {isPast ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              <span className={cn(
                'mt-1 text-[10px] whitespace-nowrap',
                isCurrent ? 'text-orange font-medium' : isPast ? 'text-text-secondary' : 'text-text-tertiary'
              )}>
                {step.label}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={cn(
                'mb-4 h-0.5 w-8 sm:w-12',
                i < statusIndex ? 'bg-orange' : 'bg-border'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
