'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Briefcase, Plus, Edit2, Trash2, Eye, Pause, Play } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getSellerGigs, updateGig, deleteGig } from '@/lib/firebase/firestore'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Gig } from '@/types/marketplace'

const statusColors = {
  active: 'bg-green-500/10 text-green-500',
  draft: 'bg-yellow-500/10 text-yellow-500',
  paused: 'bg-red-500/10 text-red-500',
}

export default function SellerGigsPage() {
  const { user } = useAuthStore()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGigs() {
      if (!user?.uid) return
      try {
        const data = await getSellerGigs(user.uid)
        setGigs(data as Gig[])
      } catch (err) {
        console.error('Failed to fetch gigs:', err)
        toast.error('Failed to load gigs')
      } finally {
        setLoading(false)
      }
    }
    fetchGigs()
  }, [user?.uid])

  const handleToggleStatus = async (gig: Gig) => {
    const newStatus = gig.status === 'active' ? 'paused' : 'active'
    try {
      await updateGig(gig.id, { status: newStatus })
      setGigs((prev) =>
        prev.map((g) => (g.id === gig.id ? { ...g, status: newStatus } : g))
      )
      toast.success(`Gig ${newStatus === 'active' ? 'activated' : 'paused'}`)
    } catch {
      toast.error('Failed to update gig status')
    }
  }

  const handleDelete = async (gig: Gig) => {
    if (!confirm('Are you sure you want to delete this gig?')) return
    try {
      await deleteGig(gig.id)
      setGigs((prev) => prev.filter((g) => g.id !== gig.id))
      toast.success('Gig deleted')
    } catch {
      toast.error('Failed to delete gig')
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
        </div>
      </DashboardShell>
    )
  }

  if (gigs.length === 0) {
    return (
      <DashboardShell>
        <EmptyState
          icon={Briefcase}
          title="You Haven't Created Any Gigs Yet"
          description="Create your first gig to start selling your services on ORBIT."
          action={
            <Link href="/dashboard/seller/gigs/new">
              <Button variant="primary">Create Your First Gig</Button>
            </Link>
          }
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">My Gigs</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {gigs.length} gig{gigs.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/dashboard/seller/gigs/new">
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            New Gig
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {gigs.map((gig) => (
          <div
            key={gig.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center"
          >
            {/* Cover Image */}
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-surface-2">
              {gig.coverImage ? (
                <Image
                  src={gig.coverImage}
                  alt={gig.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Briefcase className="h-6 w-6 text-text-tertiary" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-text-primary">
                {gig.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    statusColors[gig.status]
                  )}
                >
                  {gig.status}
                </span>
                <span className="text-xs text-text-tertiary">
                  From ${gig.pricing.basic.price}
                </span>
                <span className="text-xs text-text-tertiary">
                  {gig.orderCount} order{gig.orderCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/gig/${gig.slug}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-background hover:text-text-primary"
                title="View"
              >
                <Eye className="h-4 w-4" />
              </Link>
              <Link
                href={`/dashboard/seller/gigs/${gig.id}/edit`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-background hover:text-text-primary"
                title="Edit"
              >
                <Edit2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleToggleStatus(gig)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-background hover:text-text-primary"
                title={gig.status === 'active' ? 'Pause' : 'Activate'}
              >
                {gig.status === 'active' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleDelete(gig)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-red-500/10 hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
