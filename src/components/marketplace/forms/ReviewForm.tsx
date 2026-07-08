'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createReview } from '@/lib/marketplace/mutations'
import type { Order } from '@/types/marketplace'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
  order: Order
  userId: string
  onReviewSubmitted: () => void
}

export function ReviewForm({ order, userId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await createReview({
        order_id: order.id,
        gig_id: order.gig_id,
        seller_id: order.seller_id,
        buyer_id: userId,
        rating,
        comment: comment.trim(),
        seller_response: null,
      })
      onReviewSubmitted()
    } catch {
      setError('Failed to submit review. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  star <= (hoveredRating || rating)
                    ? 'fill-orange text-orange'
                    : 'text-border'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
          placeholder="Share your experience with this seller..."
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <Button type="submit" variant="primary" size="sm" loading={submitting}>
        Submit Review
      </Button>
    </form>
  )
}
