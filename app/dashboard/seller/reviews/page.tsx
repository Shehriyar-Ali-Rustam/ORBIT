'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Send, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getSellerReviews } from '@/lib/firebase/firestore'
import type { Review } from '@/types/marketplace'
import type { Timestamp } from 'firebase/firestore'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

function formatTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts) return ''
  try {
    const date = ts.toDate()
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function SellerReviewsPage() {
  const { user } = useAuthStore()
  const [reviews, setReviews] = useState<(Review & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submittingResponse, setSubmittingResponse] = useState(false)

  const fetchReviews = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getSellerReviews(user.uid)
      setReviews(data as (Review & { id: string })[])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reviews.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error('Please enter a response.')
      return
    }

    setSubmittingResponse(true)

    try {
      const res = await fetch(`/api/reviews/${reviewId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerResponse: responseText.trim() }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit response')
      }

      toast.success('Response submitted successfully!')
      setRespondingTo(null)
      setResponseText('')
      fetchReviews()
    } catch (err) {
      console.error('Failed to submit response:', err)
      toast.error('Failed to submit response. Please try again.')
    } finally {
      setSubmittingResponse(false)
    }
  }

  // Compute average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

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
  if (reviews.length === 0) {
    return (
      <DashboardShell>
        <EmptyState
          icon={Star}
          title="No Reviews Yet"
          description="Reviews from your buyers will appear here once you complete orders."
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Reviews</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} from buyers
        </p>
      </div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="mb-8 rounded-xl border border-border bg-surface p-6"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Average Rating */}
          <div className="text-center sm:text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-text-primary">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-text-tertiary">/ 5</span>
            </div>
            <div className="mt-1 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-5 w-5',
                    star <= Math.round(averageRating)
                      ? 'fill-orange text-orange'
                      : 'fill-transparent text-border',
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-text-tertiary">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Divider */}
          <div className="hidden h-16 w-px bg-border sm:block" />

          {/* Rating Distribution */}
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map(({ star, count }) => {
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-3 text-xs text-text-secondary">{star}</span>
                  <Star className="h-3 w-3 fill-orange text-orange" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease }}
                      className="h-full rounded-full bg-orange"
                    />
                  </div>
                  <span className="w-6 text-right text-xs text-text-tertiary">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease, delay: index * 0.05 }}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-start gap-4">
              {/* Buyer Photo */}
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-orange-dim">
                {review.buyerPhoto ? (
                  <Image
                    src={review.buyerPhoto}
                    alt={review.buyerName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-orange">
                    {review.buyerName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-text-primary">
                    {review.buyerName}
                  </h4>
                  <span className="text-xs text-text-tertiary">
                    {formatTimestamp(review.createdAt)}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="mt-1 flex items-center gap-0.5">
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
                </div>

                {/* Comment */}
                <p className="mt-2 text-sm text-text-secondary">{review.comment}</p>

                {/* Seller Response */}
                {review.sellerResponse && (
                  <div className="mt-3 rounded-lg border border-border bg-orange-dim/30 p-3">
                    <p className="text-xs font-medium text-text-primary">Your Response:</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {review.sellerResponse}
                    </p>
                  </div>
                )}

                {/* Respond Button / Form */}
                {!review.sellerResponse && (
                  <div className="mt-3">
                    {respondingTo === review.id ? (
                      <div className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          placeholder="Write your response..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          className={cn(inputClass, 'resize-none text-xs')}
                        />
                        <div className="flex shrink-0 flex-col gap-1">
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            loading={submittingResponse}
                            onClick={() => handleSubmitResponse(review.id)}
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                          <button
                            type="button"
                            onClick={() => {
                              setRespondingTo(null)
                              setResponseText('')
                            }}
                            className="px-2 py-1 text-xs text-text-tertiary transition-colors hover:text-text-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setRespondingTo(review.id)
                          setResponseText('')
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-orange transition-colors hover:text-orange/80"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Respond
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardShell>
  )
}
