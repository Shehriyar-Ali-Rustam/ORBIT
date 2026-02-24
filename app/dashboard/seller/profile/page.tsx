'use client'

import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { SellerProfileForm } from '@/components/forms/SellerProfileForm'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function SellerProfilePage() {
  const { user } = useAuthStore()

  return (
    <DashboardShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Seller Profile</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Set up your seller profile to start offering your services on ORBIT.
        </p>
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-surface p-6 sm:p-8">
        <SellerProfileForm initialData={user?.sellerProfile} />
      </div>
    </DashboardShell>
  )
}
