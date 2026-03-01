'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { StarRating } from '@/components/marketplace/StarRating'
import { EmptyState } from '@/components/marketplace/EmptyState'
import { getSupabase } from '@/lib/supabase/client'
import type { Review } from '@/types/marketplace'

export default function BuyerReviewsPage() {
  const { user } = useUser()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    async function load() {
      const supabase = getSupabase()
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('buyer_id', user!.id)
        .order('created_at', { ascending: false })

      setReviews((data || []) as Review[])
      setLoading(false)
    }
    load()
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">My Reviews</h1>
        <p className="mt-1 text-sm text-text-secondary">Reviews you&apos;ve left for sellers.</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Complete an order to leave a review." />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-text-tertiary">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{review.comment}</p>
              {review.seller_response && (
                <div className="mt-3 rounded-lg bg-background p-3">
                  <p className="text-xs font-medium text-text-tertiary">Seller Response</p>
                  <p className="mt-1 text-sm text-text-secondary">{review.seller_response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
