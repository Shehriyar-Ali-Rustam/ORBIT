'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ChevronLeft, Upload, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OrderStatusBadge } from '@/components/marketplace/dashboard/OrderStatusBadge'
import { getOrder } from '@/lib/marketplace/queries'
import { updateOrder, updateOrderStatus } from '@/lib/marketplace/mutations'
import { uploadFile, generateFilePath } from '@/lib/supabase/storage'
import type { Order, OrderDeliverable } from '@/types/marketplace'

export default function OrderDetailPage() {
  const params = useParams()
  const { user } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [delivering, setDelivering] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    getOrder(params.id as string)
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [params.id])

  async function handleDeliver() {
    if (!order || !user?.id) return
    setDelivering(true)

    try {
      // Upload files
      const uploaded: OrderDeliverable[] = await Promise.all(
        files.map(async (file) => {
          const path = generateFilePath(user.id, file.name)
          const url = await uploadFile('deliverables', path, file)
          return { url, name: file.name, uploaded_at: new Date().toISOString() }
        })
      )

      const deliverables = [...(order.deliverables || []), ...uploaded]
      await updateOrder(order.id, { deliverables })
      await updateOrderStatus(order.id, 'delivered')
      setOrder({ ...order, deliverables, status: 'delivered' })
      setFiles([])
    } catch (err) {
      console.error('Delivery failed:', err)
    }
    setDelivering(false)
  }

  async function handleStartWork() {
    if (!order) return
    try {
      await updateOrderStatus(order.id, 'in_progress')
      setOrder({ ...order, status: 'in_progress' })
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-text-secondary">Order not found.</p>
      </div>
    )
  }

  const daysLeft = order.delivery_deadline
    ? Math.max(0, Math.ceil((new Date(order.delivery_deadline).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div>
      <Link href="/freelancers/dashboard/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-text-tertiary hover:text-text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{order.gig_title}</h1>
          <p className="mt-1 text-sm capitalize text-text-secondary">{order.tier} package</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requirements */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-bold text-text-primary">Buyer Requirements</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">
              {order.requirements || 'No requirements provided.'}
            </p>
          </div>

          {/* Deliverables */}
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-3 text-sm font-bold text-text-primary">Deliverables</h2>
            {order.deliverables?.length > 0 ? (
              <div className="space-y-2">
                {order.deliverables.map((d, i) => (
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm text-text-secondary hover:border-orange hover:text-text-primary"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-orange" />
                    <span className="flex-1 truncate">{d.name}</span>
                    <span className="text-xs text-text-tertiary">
                      {new Date(d.uploaded_at).toLocaleDateString()}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-tertiary">No deliverables uploaded yet.</p>
            )}
          </div>

          {/* Deliver Work */}
          {['active', 'in_progress', 'revision_requested'].includes(order.status) && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-3 text-sm font-bold text-text-primary">Deliver Work</h2>

              {order.status === 'active' && (
                <div className="mb-4">
                  <Button variant="primary" size="sm" onClick={handleStartWork}>
                    Start Working
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-text-tertiary">Attach Files</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm text-text-secondary hover:border-orange"
                    >
                      <Upload className="h-4 w-4" /> Choose Files
                    </button>
                    <span className="text-xs text-text-tertiary">{files.length} file(s) selected</span>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  loading={delivering}
                  onClick={handleDeliver}
                  disabled={files.length === 0}
                >
                  Deliver Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-text-primary">Order Details</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-tertiary">Price</dt>
                <dd className="font-medium text-text-primary">${order.price}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-tertiary">Service Fee</dt>
                <dd className="text-text-secondary">${order.service_fee}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="text-text-tertiary">You Receive</dt>
                <dd className="font-bold text-orange">${order.price - order.service_fee}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-tertiary">Delivery</dt>
                <dd className="text-text-secondary">{order.delivery_days} days</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-tertiary">Revisions</dt>
                <dd className="text-text-secondary">{order.revision_count}/{order.max_revisions}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-tertiary">Ordered</dt>
                <dd className="text-text-secondary">{new Date(order.created_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {daysLeft !== null && order.status !== 'completed' && order.status !== 'cancelled' && (
            <div className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
              daysLeft <= 1
                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                : daysLeft <= 3
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
                  : 'border-border bg-surface text-text-secondary'
            }`}>
              <Clock className="h-4 w-4 shrink-0" />
              {daysLeft === 0 ? 'Deadline is today!' : `${daysLeft} day(s) remaining`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
