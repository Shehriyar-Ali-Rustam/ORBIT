'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  CheckCircle,
  Clock,
  Star,
  Calendar,
} from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { StatCard } from '@/components/dashboard/StatCard'
import { OrderStatusBadge } from '@/components/dashboard/OrderStatusBadge'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useOrders } from '@/hooks/useOrders'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function SellerEarningsPage() {
  const { user } = useAuthStore()
  const { orders, loading, error } = useOrders(user?.uid, 'seller')

  const stats = useMemo(() => {
    const completedOrders = orders.filter((o) => o.status === 'completed')
    const pendingOrders = orders.filter(
      (o) =>
        o.status === 'active' ||
        o.status === 'in_progress' ||
        o.status === 'delivered' ||
        o.status === 'revision_requested'
    )

    const totalEarnings = completedOrders.reduce(
      (sum, o) => sum + (o.totalAmount - o.serviceFee),
      0
    )
    const pendingEarnings = pendingOrders.reduce(
      (sum, o) => sum + (o.totalAmount - o.serviceFee),
      0
    )

    const avgRating = user?.sellerProfile?.rating ?? 0

    return {
      totalEarnings,
      completedCount: completedOrders.length,
      pendingEarnings,
      avgRating,
      completedOrders,
    }
  }, [orders, user?.sellerProfile?.rating])

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
          icon={DollarSign}
          title="No Earnings Yet"
          description="Complete your first order to start earning on ORBIT."
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Earnings</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Track your revenue and completed orders.
        </p>
      </div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Total Earnings"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatCard
          label="Completed Orders"
          value={stats.completedCount}
          icon={CheckCircle}
        />
        <StatCard
          label="Pending Earnings"
          value={`$${stats.pendingEarnings.toFixed(2)}`}
          icon={Clock}
        />
        <StatCard
          label="Average Rating"
          value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
          icon={Star}
        />
      </motion.div>

      {/* Completed Orders List */}
      {stats.completedOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Completed Orders
          </h3>
          <div className="rounded-xl border border-border bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                      Gig
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                      Buyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">
                      Earned
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.completedOrders.map((order) => {
                    const completedDate = order.completedAt?.toDate
                      ? order.completedAt.toDate().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : order.createdAt?.toDate
                        ? order.createdAt.toDate().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : ''

                    return (
                      <tr key={order.id} className="transition-colors hover:bg-background">
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-sm font-medium text-text-primary">
                            {order.gigTitle.length > 40
                              ? order.gigTitle.slice(0, 40) + '...'
                              : order.gigTitle}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-sm text-text-secondary">
                            {order.buyerName}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                            <Calendar className="h-3.5 w-3.5" />
                            {completedDate}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <span className="text-sm font-semibold text-orange">
                            ${(order.totalAmount - order.serviceFee).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardShell>
  )
}
