'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Package } from 'lucide-react'
import { OrderStatusBadge } from '@/components/dashboard/OrderStatusBadge'
import type { Order } from '@/types/marketplace'

interface OrderCardProps {
  order: Order
  role: 'buyer' | 'seller'
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function OrderCard({ order, role }: OrderCardProps) {
  const otherPartyName = role === 'buyer' ? order.sellerName : order.buyerName
  const detailHref =
    role === 'buyer'
      ? `/dashboard/orders/${order.id}`
      : `/dashboard/seller/orders/${order.id}`

  const createdDate = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      <Link href={detailHref} className="block">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-orange/30 sm:flex-row sm:items-center">
          {/* Cover Image */}
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
            {order.gigCoverImage ? (
              <Image
                src={order.gigCoverImage}
                alt={order.gigTitle}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-5 w-5 text-text-tertiary" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-text-primary">
              {order.gigTitle}
            </h3>
            <p className="mt-0.5 text-xs text-text-secondary">
              {role === 'buyer' ? 'Seller' : 'Buyer'}: {otherPartyName}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
                <DollarSign className="h-3 w-3" />
                ${order.totalAmount.toFixed(2)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
                <Calendar className="h-3 w-3" />
                {createdDate}
              </span>
            </div>
          </div>

          {/* Tier */}
          <div className="shrink-0 text-right">
            <span className="rounded-full bg-orange-dim px-2.5 py-0.5 text-xs font-medium capitalize text-orange">
              {order.tier}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
