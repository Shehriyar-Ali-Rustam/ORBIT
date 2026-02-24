'use client'

import { ShoppingBag } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { OrderCard } from '@/components/orders/OrderCard'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useOrders } from '@/hooks/useOrders'

export default function BuyerOrdersPage() {
  const { user } = useAuthStore()
  const { orders, loading, error } = useOrders(user?.uid, 'buyer')

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
        </div>
      </DashboardShell>
    )
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </DashboardShell>
    )
  }

  if (orders.length === 0) {
    return (
      <DashboardShell>
        <EmptyState
          icon={ShoppingBag}
          title="You Haven't Placed Any Orders Yet"
          description="Browse gigs and place your first order to get started."
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">My Orders</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {orders.length} order{orders.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} role="buyer" />
        ))}
      </div>
    </DashboardShell>
  )
}
