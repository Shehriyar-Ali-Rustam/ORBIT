'use client'

import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { GigForm } from '@/components/forms/GigForm'

export default function CreateGigPage() {
  return (
    <DashboardShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Create New Gig</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Set up your gig with details, pricing, images, and FAQ.
        </p>
      </div>

      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-surface p-6 sm:p-8">
        <GigForm />
      </div>
    </DashboardShell>
  )
}
