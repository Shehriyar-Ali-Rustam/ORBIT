'use client'

import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types/marketplace'

const statusColors: Record<OrderStatus, string> = {
  pending_payment: 'bg-yellow-500/10 text-yellow-500',
  active: 'bg-blue-500/10 text-blue-500',
  in_progress: 'bg-blue-500/10 text-blue-500',
  delivered: 'bg-purple-500/10 text-purple-500',
  revision_requested: 'bg-orange/10 text-orange',
  completed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
  disputed: 'bg-red-500/10 text-red-500',
}

function formatStatus(status: OrderStatus): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusColors[status],
        className
      )}
    >
      {formatStatus(status)}
    </span>
  )
}
