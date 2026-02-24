'use client'

import { Settings } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { EmptyState } from '@/components/dashboard/EmptyState'

export default function SettingsPage() {
  return (
    <DashboardShell>
      <EmptyState
        icon={Settings}
        title="Account Settings"
        description="Coming soon — manage your account preferences and profile here."
      />
    </DashboardShell>
  )
}
