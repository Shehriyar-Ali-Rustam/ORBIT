'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { OrderCard } from '@/components/marketplace/orders/OrderCard'
import { EmptyState } from '@/components/marketplace/EmptyState'
import { getUserOrders } from '@/lib/marketplace/queries'
import type { Order, OrderStatus } from '@/types/marketplace'

const STATUS_TABS: { value: '' | OrderStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function BuyerOrdersPage() {
  const { user } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'' | OrderStatus>('')

  useEffect(() => {
    if (!user?.id) return
    getUserOrders(user.id, 'buyer')
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [user?.id])

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">My Orders</h1>
        <p className="mt-1 text-sm text-text-secondary">{orders.length} total orders</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === tab.value
                ? 'bg-orange text-white'
                : 'bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={filter ? 'No orders with this status.' : 'You haven\'t placed any orders yet.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} role="buyer" />
          ))}
        </div>
      )}
    </div>
  )
}
