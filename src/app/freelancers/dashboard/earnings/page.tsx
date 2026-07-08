'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { StatCard } from '@/components/marketplace/dashboard/StatCard'
import { getUserOrders } from '@/lib/marketplace/queries'
import type { Order } from '@/types/marketplace'

export default function EarningsPage() {
  const { user } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    getUserOrders(user.id, 'seller')
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

  const completedOrders = orders.filter((o) => o.status === 'completed')
  const pendingOrders = orders.filter((o) => ['active', 'in_progress', 'delivered'].includes(o.status))
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.price - o.service_fee), 0)
  const pendingEarnings = pendingOrders.reduce((sum, o) => sum + (o.price - o.service_fee), 0)
  const avgOrderValue = completedOrders.length > 0 ? totalEarnings / completedOrders.length : 0

  // Group earnings by month
  const monthlyEarnings: Record<string, number> = {}
  completedOrders.forEach((o) => {
    const month = new Date(o.completed_at || o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    monthlyEarnings[month] = (monthlyEarnings[month] || 0) + (o.price - o.service_fee)
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Earnings</h1>
        <p className="mt-1 text-sm text-text-secondary">Track your revenue and payment history.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Earnings" value={`$${totalEarnings.toLocaleString()}`} />
        <StatCard icon={Clock} label="Pending" value={`$${pendingEarnings.toLocaleString()}`} />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={`$${avgOrderValue.toFixed(0)}`} />
        <StatCard icon={CheckCircle} label="Completed Orders" value={completedOrders.length} />
      </div>

      {/* Monthly Breakdown */}
      {Object.keys(monthlyEarnings).length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-text-primary">Monthly Breakdown</h2>
          <div className="rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-surface text-left text-xs text-text-tertiary">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3 text-right">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Object.entries(monthlyEarnings)
                  .reverse()
                  .map(([month, amount]) => (
                    <tr key={month} className="text-sm">
                      <td className="px-4 py-3 text-text-primary">{month}</td>
                      <td className="px-4 py-3 text-right font-medium text-orange">${amount.toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Completed Orders */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-text-primary">Recent Completed Orders</h2>
        {completedOrders.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-text-tertiary">No completed orders yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-surface text-left text-xs text-text-tertiary">
                <tr>
                  <th className="px-4 py-3">Gig</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Net</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {completedOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="px-4 py-3 text-text-primary">{order.gig_title}</td>
                    <td className="px-4 py-3 capitalize text-text-secondary">{order.tier}</td>
                    <td className="px-4 py-3 text-text-secondary">${order.price}</td>
                    <td className="px-4 py-3 text-text-tertiary">-${order.service_fee}</td>
                    <td className="px-4 py-3 font-medium text-orange">${order.price - order.service_fee}</td>
                    <td className="px-4 py-3 text-text-tertiary">
                      {new Date(order.completed_at || order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
