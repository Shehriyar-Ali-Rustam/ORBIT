'use client'

import { DollarSign, Package, CheckCircle, Star } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function SellerOverviewPage() {
  const { user } = useAuthStore()
  const profile = user?.sellerProfile

  return (
    <DashboardShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">
          Welcome back, {user?.displayName?.split(' ')[0] || 'Seller'}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Here&apos;s what&apos;s happening with your business
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Earnings"
          value={`$${profile?.totalEarnings || 0}`}
          icon={DollarSign}
        />
        <StatCard
          label="Active Orders"
          value={0}
          icon={Package}
        />
        <StatCard
          label="Completed"
          value={profile?.completedOrders || 0}
          icon={CheckCircle}
        />
        <StatCard
          label="Average Rating"
          value={profile?.rating?.toFixed(1) || '0.0'}
          icon={Star}
        />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-text-secondary">
          Set up your seller profile and create your first gig to start receiving orders.
        </p>
      </div>
    </DashboardShell>
  )
}
