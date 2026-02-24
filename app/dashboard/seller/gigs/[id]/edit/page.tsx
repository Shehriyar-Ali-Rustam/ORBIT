'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { GigForm } from '@/components/forms/GigForm'
import { getGig } from '@/lib/firebase/firestore'
import type { Gig } from '@/types/marketplace'

export default function EditGigPage() {
  const params = useParams()
  const gigId = params.id as string
  const [gig, setGig] = useState<Gig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchGig() {
      try {
        const data = await getGig(gigId)
        if (!data) {
          setError('Gig not found')
        } else {
          setGig(data as Gig)
        }
      } catch (err) {
        console.error('Failed to fetch gig:', err)
        setError('Failed to load gig')
      } finally {
        setLoading(false)
      }
    }
    fetchGig()
  }, [gigId])

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
        </div>
      </DashboardShell>
    )
  }

  if (error || !gig) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-text-secondary">{error || 'Gig not found'}</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Edit Gig</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Update your gig details, pricing, and images.
        </p>
      </div>

      <div className="mx-auto max-w-4xl rounded-xl border border-border bg-surface p-6 sm:p-8">
        <GigForm initialGig={gig} />
      </div>
    </DashboardShell>
  )
}
