'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ShoppingBag, DollarSign, Star, Clock } from 'lucide-react'
import { StatCard } from '@/components/marketplace/dashboard/StatCard'
import { OrderCard } from '@/components/marketplace/orders/OrderCard'
import { EmptyState } from '@/components/marketplace/EmptyState'
import { getUserOrders } from '@/lib/marketplace/queries'
import type { Order } from '@/types/marketplace'

export default function BuyerDashboardPage() {
  const { user } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    getUserOrders(user.id, 'buyer')
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  const activeOrders = orders.filter((o) => ['active', 'in_progress', 'delivered'].includes(o.status))
  const completedOrders = orders.filter((o) => o.status === 'completed')
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.total_amount, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.firstName || 'Buyer'}
        </h1>
        <p className="mt-1 text-text-secondary">Here&apos;s your order activity overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Active Orders" value={activeOrders.length} />
        <StatCard icon={DollarSign} label="Total Spent" value={`$${totalSpent.toLocaleString()}`} />
        <StatCard icon={Star} label="Completed" value={completedOrders.length} />
        <StatCard icon={Clock} label="Total Orders" value={orders.length} />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-text-primary">Active Orders</h2>
        {activeOrders.length === 0 ? (
          <EmptyState title="No active orders" description="Browse gigs to find a service you need." />
        ) : (
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} role="buyer" />
            ))}
          </div>
        )}
      </div>

      {completedOrders.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-text-primary">Recent Completed</h2>
          <div className="space-y-3">
            {completedOrders.slice(0, 5).map((order) => (
              <OrderCard key={order.id} order={order} role="buyer" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
