'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, EyeOff, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/marketplace/EmptyState'
import { getSellerGigs } from '@/lib/marketplace/queries'
import { deleteGig, updateGigStatus } from '@/lib/marketplace/mutations'
import { CATEGORY_LABELS } from '@/lib/marketplace/constants'
import type { Gig, GigStatus } from '@/types/marketplace'

export default function GigsPage() {
  const { user } = useUser()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMenu, setActionMenu] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    getSellerGigs(user.id, true)
      .then(setGigs)
      .finally(() => setLoading(false))
  }, [user?.id])

  async function handleStatusToggle(gig: Gig) {
    const newStatus: GigStatus = gig.status === 'active' ? 'paused' : 'active'
    try {
      await updateGigStatus(gig.id, newStatus)
      setGigs((prev) => prev.map((g) => (g.id === gig.id ? { ...g, status: newStatus } : g)))
    } catch (err) {
      console.error('Status update failed:', err)
    }
    setActionMenu(null)
  }

  async function handleDelete(gigId: string) {
    if (!confirm('Are you sure you want to delete this gig?')) return
    try {
      await deleteGig(gigId)
      setGigs((prev) => prev.filter((g) => g.id !== gigId))
    } catch (err) {
      console.error('Delete failed:', err)
    }
    setActionMenu(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Gigs</h1>
          <p className="mt-1 text-sm text-text-secondary">{gigs.length} gig(s) total</p>
        </div>
        <Link href="/freelancers/dashboard/gigs/new">
          <Button variant="primary" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Create Gig
          </Button>
        </Link>
      </div>

      {gigs.length === 0 ? (
        <EmptyState
          title="No gigs yet"
          description="Create your first gig to start receiving orders."
          action={
            <Link href="/freelancers/dashboard/gigs/new">
              <Button variant="primary" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Gig
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {gigs.map((gig) => (
            <div key={gig.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
              {/* Cover */}
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-background">
                {gig.cover_image ? (
                  <Image src={gig.cover_image} alt="" fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-text-tertiary">No img</div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link href={`/freelancers/gig/${gig.slug}`} className="truncate text-sm font-medium text-text-primary hover:text-orange">
                    {gig.title}
                  </Link>
                  <Badge variant={gig.status === 'active' ? 'outline' : gig.status === 'paused' ? 'default' : 'orange'}>
                    {gig.status}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-text-tertiary">
                  <span>{CATEGORY_LABELS[gig.category]}</span>
                  <span>From ${gig.pricing.basic.price}</span>
                  <span>{gig.order_count} orders</span>
                  <span>{gig.rating.toFixed(1)} rating</span>
                </div>
              </div>

              {/* Actions */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActionMenu(actionMenu === gig.id ? null : gig.id)}
                  className="rounded-lg p-2 text-text-tertiary hover:bg-background hover:text-text-primary"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {actionMenu === gig.id && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-border bg-surface py-1 shadow-lg">
                    <Link
                      href={`/freelancers/dashboard/gigs/${gig.id}/edit`}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
                      onClick={() => setActionMenu(null)}
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(gig)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
                    >
                      {gig.status === 'active' ? (
                        <><EyeOff className="h-3.5 w-3.5" /> Pause</>
                      ) : (
                        <><Eye className="h-3.5 w-3.5" /> Activate</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(gig.id)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-background"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
