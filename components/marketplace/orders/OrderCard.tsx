'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { OrderStatusBadge } from '@/components/marketplace/dashboard/OrderStatusBadge'
import type { Order } from '@/types/marketplace'

interface OrderCardProps {
  order: Order
  role: 'buyer' | 'seller'
}

export function OrderCard({ order, role }: OrderCardProps) {
  const href = role === 'buyer'
    ? `/freelancers/dashboard/buyer/orders/${order.id}`
    : `/freelancers/dashboard/orders/${order.id}`

  const daysLeft = order.delivery_deadline
    ? Math.max(0, Math.ceil((new Date(order.delivery_deadline).getTime() - Date.now()) / 86400000))
    : null

  return (
    <Link href={href} className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-orange/40">
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-background">
          {order.gig_cover_image ? (
            <Image src={order.gig_cover_image} alt="" fill className="object-cover" sizes="80px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-text-tertiary">No img</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-medium text-text-primary">{order.gig_title}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-0.5 text-xs capitalize text-text-tertiary">{order.tier} package</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-text-tertiary">
            <span className="font-medium text-text-primary">${order.price}</span>
            {daysLeft !== null && !['completed', 'cancelled'].includes(order.status) && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
              </span>
            )}
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
