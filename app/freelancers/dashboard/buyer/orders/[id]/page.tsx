'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ChevronLeft, FileText, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OrderStatusBadge } from '@/components/marketplace/dashboard/OrderStatusBadge'
import { OrderTimeline } from '@/components/marketplace/orders/OrderTimeline'
import { OrderActions } from '@/components/marketplace/orders/OrderActions'
import { ReviewForm } from '@/components/marketplace/forms/ReviewForm'
import { getOrder } from '@/lib/marketplace/queries'
import type { Order } from '@/types/marketplace'

export default function BuyerOrderDetailPage() {
  const params = useParams()
  const { user } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReview, setShowReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    getOrder(params.id as string)
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [params.id])

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

  return (
    <div>
      <Link href="/freelancers/dashboard/buyer/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-text-tertiary hover:text-text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{order.gig_title}</h1>
          <p className="mt-1 text-sm capitalize text-text-secondary">{order.tier} package</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Timeline */}
      <div className="mb-8 rounded-xl border border-border bg-surface p-5">
        <OrderTimeline
          currentStatus={order.status}
          createdAt={order.created_at}
          completedAt={order.completed_at}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Actions (accept / request revision) */}
          {order.status === 'delivered' && (
            <div className="rounded-xl border border-orange/30 bg-orange-dim p-5">
              <h2 className="mb-2 text-sm font-bold text-text-primary">Work Delivered</h2>
              <OrderActions order={order} onUpdate={setOrder} />
            </div>
          )}

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
              <p className="text-sm text-text-tertiary">No deliverables yet. The seller is working on your order.</p>
            )}
          </div>

          {/* Review */}
          {order.status === 'completed' && !reviewSubmitted && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-3 text-sm font-bold text-text-primary">Leave a Review</h2>
              {showReview ? (
                <ReviewForm
                  order={order}
                  userId={user?.id || ''}
                  onReviewSubmitted={() => {
                    setShowReview(false)
                    setReviewSubmitted(true)
                  }}
                />
              ) : (
                <Button variant="primary" size="sm" onClick={() => setShowReview(true)}>
                  Write a Review
                </Button>
              )}
            </div>
          )}

          {reviewSubmitted && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
              Thank you for your review!
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
                <dt className="text-text-tertiary">Total</dt>
                <dd className="font-bold text-orange">${order.total_amount}</dd>
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

          <Link href="/freelancers/dashboard/messages">
            <Button variant="ghost" size="sm" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" /> Message Seller
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
