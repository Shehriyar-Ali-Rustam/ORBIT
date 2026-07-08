'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/marketplace/StarRating'
import { EmptyState } from '@/components/marketplace/EmptyState'
import { getSellerReviews, getProfile } from '@/lib/marketplace/queries'
import { addSellerResponse } from '@/lib/marketplace/mutations'
import type { Review, Profile } from '@/types/marketplace'

export default function ReviewsPage() {
  const { user } = useUser()
  const [reviews, setReviews] = useState<Review[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      getSellerReviews(user.id),
      getProfile(user.id),
    ])
      .then(([r, p]) => {
        setReviews(r)
        setProfile(p)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  async function handleRespond(reviewId: string) {
    if (!response.trim()) return
    setSaving(true)
    try {
      await addSellerResponse(reviewId, response.trim())
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, seller_response: response.trim() } : r))
      )
      setRespondingTo(null)
      setResponse('')
    } catch (err) {
      console.error('Response failed:', err)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  // Rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Reviews</h1>
        <p className="mt-1 text-sm text-text-secondary">{reviews.length} reviews received</p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="mb-8 flex items-start gap-8 rounded-xl border border-border bg-surface p-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-text-primary">{profile?.rating.toFixed(1) || '0.0'}</p>
            <StarRating rating={profile?.rating || 0} size="sm" />
            <p className="mt-1 text-xs text-text-tertiary">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right text-text-tertiary">{star}</span>
                <Star className="h-3 w-3 fill-orange text-orange" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-orange"
                    style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs text-text-tertiary">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Complete orders to start receiving reviews." />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-dim text-xs font-bold text-orange">
                    {review.buyer?.display_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">
                      {review.buyer?.display_name || 'Buyer'}
                    </span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                </div>
                <span className="text-xs text-text-tertiary">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="mt-3 text-sm text-text-secondary">{review.comment}</p>

              {review.seller_response ? (
                <div className="mt-3 rounded-lg bg-background p-3">
                  <p className="text-xs font-medium text-text-tertiary">Your Response</p>
                  <p className="mt-1 text-sm text-text-secondary">{review.seller_response}</p>
                </div>
              ) : respondingTo === review.id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:border-orange focus:outline-none"
                    placeholder="Write your response..."
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" loading={saving} onClick={() => handleRespond(review.id)}>
                      Submit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setRespondingTo(null); setResponse('') }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setRespondingTo(review.id)}
                  className="mt-3 text-xs font-medium text-orange hover:underline"
                >
                  Reply to this review
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
