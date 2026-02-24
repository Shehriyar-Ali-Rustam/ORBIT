'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageSquarePlus, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { ReviewForm } from '@/components/forms/ReviewForm'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getUserOrders, getReviewByOrderId } from '@/lib/firebase/firestore'
import type { Order, Review } from '@/types/marketplace'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface OrderWithReview {
  order: Order & { id: string }
  review: (Review & { id: string }) | null
}

export default function BuyerReviewsPage() {
  const { user } = useAuthStore()
  const [items, setItems] = useState<OrderWithReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const orders = (await getUserOrders(user.uid, 'buyer')) as (Order & { id: string })[]
      const completedOrders = orders.filter((o) => o.status === 'completed')

      const withReviews = await Promise.all(
        completedOrders.map(async (order) => {
          const review = await getReviewByOrderId(order.id)
          return {
            order,
            review: review as (Review & { id: string }) | null,
          }
        }),
      )

      setItems(withReviews)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reviews.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleReviewSubmitted = () => {
    setExpandedOrderId(null)
    fetchData()
  }

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId))
  }

  // Loading state
  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
        </div>
      </DashboardShell>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </DashboardShell>
    )
  }

  // Empty state
  if (items.length === 0) {
    return (
      <DashboardShell>
        <EmptyState
          icon={Star}
          title="No Reviews Yet"
          description="Complete an order first, then you can leave a review for the seller."
        />
      </DashboardShell>
    )
  }

  const pendingReviews = items.filter((i) => !i.review)
  const submittedReviews = items.filter((i) => i.review)

  return (
    <DashboardShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">My Reviews</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {items.length} completed order{items.length !== 1 ? 's' : ''} &middot;{' '}
          {pendingReviews.length} awaiting review
        </p>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-orange">
            Awaiting Your Review
          </h3>
          <div className="space-y-4">
            {pendingReviews.map(({ order }) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease }}
                className="rounded-xl border border-border bg-surface overflow-hidden"
              >
                <div className="flex items-center gap-4 p-5">
                  {/* Gig Cover */}
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {order.gigCoverImage ? (
                      <Image
                        src={order.gigCoverImage}
                        alt={order.gigTitle}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-dim">
                        <Star className="h-5 w-5 text-orange" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-text-primary">
                      {order.gigTitle}
                    </h4>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Seller: {order.sellerName} &middot; ${order.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Write Review Button */}
                  <Button
                    type="button"
                    variant={expandedOrderId === order.id ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {expandedOrderId === order.id ? (
                      <>
                        Cancel
                        <ChevronUp className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        <MessageSquarePlus className="h-3.5 w-3.5" />
                        Write Review
                      </>
                    )}
                  </Button>
                </div>

                {/* Expandable Review Form */}
                <AnimatePresence>
                  {expandedOrderId === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="p-5">
                        <ReviewForm
                          orderId={order.id}
                          gigId={order.gigId}
                          sellerId={order.sellerId}
                          onSubmitted={handleReviewSubmitted}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Reviews */}
      {submittedReviews.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-text-secondary">
            Your Reviews
          </h3>
          <div className="space-y-4">
            {submittedReviews.map(({ order, review }) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease }}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Gig Cover */}
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {order.gigCoverImage ? (
                      <Image
                        src={order.gigCoverImage}
                        alt={order.gigTitle}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-dim">
                        <Star className="h-5 w-5 text-orange" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-text-primary">
                      {order.gigTitle}
                    </h4>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Seller: {order.sellerName}
                    </p>

                    {/* Star Rating Display */}
                    {review && (
                      <>
                        <div className="mt-2 flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'h-4 w-4',
                                star <= review.rating
                                  ? 'fill-orange text-orange'
                                  : 'fill-transparent text-border',
                              )}
                            />
                          ))}
                          <span className="ml-1 text-xs text-text-secondary">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary">
                          {review.comment}
                        </p>
                        {review.sellerResponse && (
                          <div className="mt-3 rounded-lg border border-border bg-orange-dim/30 p-3">
                            <p className="text-xs font-medium text-text-primary">
                              Seller Response:
                            </p>
                            <p className="mt-1 text-xs text-text-secondary">
                              {review.sellerResponse}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
