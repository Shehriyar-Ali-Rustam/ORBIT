'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Package, DollarSign, Star, Briefcase, Plus, MessageSquare, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/marketplace/dashboard/StatCard'
import { OrderStatusBadge } from '@/components/marketplace/dashboard/OrderStatusBadge'
import { getProfile, getUserOrders, getSellerGigs } from '@/lib/marketplace/queries'
import type { Profile, Order, Gig } from '@/types/marketplace'

export default function SellerDashboardPage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    async function load() {
      try {
        const [p, o, g] = await Promise.all([
          getProfile(user!.id),
          getUserOrders(user!.id, 'seller'),
          getSellerGigs(user!.id, true),
        ])
        setProfile(p)
        setOrders(o)
        setGigs(g)
      } catch {}
      setLoading(false)
    }
    load()
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  const activeOrders = orders.filter((o) => ['active', 'in_progress'].includes(o.status))
  const completedOrders = orders.filter((o) => o.status === 'completed')
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.price, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.firstName || 'Seller'}
        </h1>
        <p className="mt-1 text-text-secondary">Here&apos;s an overview of your marketplace activity.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Active Orders" value={activeOrders.length} />
        <StatCard icon={DollarSign} label="Total Earnings" value={`$${totalEarnings.toLocaleString()}`} />
        <StatCard icon={Star} label="Rating" value={profile?.rating?.toFixed(1) || '0.0'} subtext={`${profile?.review_count || 0} reviews`} />
        <StatCard icon={Briefcase} label="Active Gigs" value={gigs.filter((g) => g.status === 'active').length} />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/freelancers/dashboard/gigs/new">
          <Button variant="primary" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Create New Gig
          </Button>
        </Link>
        <Link href="/freelancers/dashboard/messages">
          <Button variant="ghost" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" /> Messages
          </Button>
        </Link>
        <Link href="/freelancers/dashboard/profile">
          <Button variant="ghost" size="sm">
            <User className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-text-primary">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-text-tertiary">No orders yet. Create a gig to start receiving orders.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-surface text-left text-xs text-text-tertiary">
                <tr>
                  <th className="px-4 py-3">Gig</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="px-4 py-3">
                      <Link href={`/freelancers/dashboard/orders/${order.id}`} className="font-medium text-text-primary hover:text-orange">
                        {order.gig_title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-primary">${order.price}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-text-tertiary">
                      {new Date(order.created_at).toLocaleDateString()}
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
