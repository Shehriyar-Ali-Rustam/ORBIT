'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Loader2, User } from 'lucide-react'
import { getGigReviews } from '@/lib/firebase/firestore'
import type { Review } from '@/types/marketplace'
import type { Timestamp } from 'firebase/firestore'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface GigReviewsProps {
  gigId: string
}

function formatReviewDate(timestamp: Timestamp): string {
  try {
    const date = timestamp.toDate()
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'fill-orange text-orange' : 'text-border'
          }`}
        />
      ))}
    </div>
  )
}

export function GigReviews({ gigId }: GigReviewsProps) {
  const [reviews, setReviews] = useState<(Review & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchReviews() {
      try {
        setLoading(true)
        setError(null)
        const data = await getGigReviews(gigId)
        if (!cancelled) {
          setReviews(data as (Review & { id: string })[])
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load reviews.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchReviews()

    return () => {
      cancelled = true
    }
  }, [gigId])

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary">Reviews</h2>

      {loading && (
        <div className="mt-6 flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange" />
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-text-secondary">{error}</p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="mt-4 text-sm text-text-secondary">No reviews yet.</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="mt-4 space-y-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start gap-3">
                {/* Reviewer avatar */}
                {review.buyerPhoto ? (
                  <Image
                    src={review.buyerPhoto}
                    alt={review.buyerName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-dim">
                    <User className="h-4 w-4 text-orange" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-text-primary">{review.buyerName}</h4>
                    <span className="text-xs text-text-tertiary">
                      {formatReviewDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {review.comment}
                  </p>

                  {/* Seller response */}
                  {review.sellerResponse && (
                    <div className="mt-3 rounded-lg bg-orange-dim p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-orange">
                        Seller Response
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {review.sellerResponse}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
