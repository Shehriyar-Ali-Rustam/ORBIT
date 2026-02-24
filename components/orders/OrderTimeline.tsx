'use client'

import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types/marketplace'

interface TimelineStep {
  label: string
  statuses: OrderStatus[]
}

const steps: TimelineStep[] = [
  { label: 'Order Placed', statuses: ['pending_payment', 'active', 'in_progress', 'delivered', 'revision_requested', 'completed'] },
  { label: 'In Progress', statuses: ['in_progress', 'delivered', 'revision_requested', 'completed'] },
  { label: 'Delivered', statuses: ['delivered', 'revision_requested', 'completed'] },
  { label: 'Completed', statuses: ['completed'] },
]

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function getStepDate(order: Order, stepIndex: number): string | null {
  switch (stepIndex) {
    case 0:
      return order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : null
    case 3:
      return order.completedAt?.toDate
        ? order.completedAt.toDate().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : null
    default:
      return null
  }
}

interface OrderTimelineProps {
  order: Order
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const isCancelled = order.status === 'cancelled'
  const isDisputed = order.status === 'disputed'

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="mb-6 text-sm font-semibold text-text-primary">Order Timeline</h3>

      {(isCancelled || isDisputed) && (
        <div
          className={cn(
            'mb-4 rounded-lg px-4 py-2 text-xs font-medium',
            isCancelled ? 'bg-red-500/10 text-red-500' : 'bg-red-500/10 text-red-500'
          )}
        >
          This order has been {isCancelled ? 'cancelled' : 'disputed'}.
        </div>
      )}

      <div className="relative space-y-0">
        {steps.map((step, index) => {
          const isCompleted = step.statuses.includes(order.status)
          const isActive =
            !isCompleted &&
            index > 0 &&
            steps[index - 1].statuses.includes(order.status)
          const date = getStepDate(order, index)
          const isLast = index === steps.length - 1

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {/* Vertical line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-[11px] top-6 h-full w-0.5',
                    isCompleted ? 'bg-orange' : 'bg-border'
                  )}
                />
              )}

              {/* Dot */}
              <div className="relative z-10 shrink-0">
                {isCompleted ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border-2',
                      isActive ? 'border-orange bg-orange-dim' : 'border-border bg-surface'
                    )}
                  >
                    <Circle
                      className={cn(
                        'h-2 w-2',
                        isActive ? 'fill-orange text-orange' : 'fill-border text-border'
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="pt-0.5">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCompleted ? 'text-text-primary' : 'text-text-tertiary'
                  )}
                >
                  {step.label}
                </p>
                {date && (
                  <p className="mt-0.5 text-xs text-text-tertiary">{date}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
