'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Star, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { reviewSchema } from '@/lib/validations/review'
import type { ReviewFormData } from '@/lib/validations/review'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

interface ReviewFormProps {
  orderId: string
  gigId: string
  sellerId: string
  onSubmitted: () => void
}

export function ReviewForm({ orderId, gigId, sellerId, onSubmitted }: ReviewFormProps) {
  const { user } = useAuthStore()
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  })

  const handleStarClick = (star: number) => {
    setSelectedRating(star)
    setValue('rating', star, { shouldValidate: true })
  }

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast.error('You must be logged in to leave a review.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          gigId,
          sellerId,
          buyerId: user.uid,
          buyerName: user.displayName,
          buyerPhoto: user.photoURL,
          rating: data.rating,
          comment: data.comment,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit review')
      }

      toast.success('Review submitted successfully!')
      onSubmitted()
    } catch (err) {
      console.error('Failed to submit review:', err)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-border bg-surface p-5"
    >
      <h3 className="text-sm font-semibold text-text-primary">Write a Review</h3>

      {/* Star Rating Picker */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          Rating
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => handleStarClick(star)}
              className="rounded p-0.5 transition-transform hover:scale-110"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  'h-7 w-7 transition-colors',
                  (hoveredStar >= star || (!hoveredStar && selectedRating >= star))
                    ? 'fill-orange text-orange'
                    : 'fill-transparent text-border',
                )}
              />
            </button>
          ))}
          {selectedRating > 0 && (
            <span className="ml-2 text-sm text-text-secondary">
              {selectedRating}/5
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>
        )}
        <input type="hidden" {...register('rating', { valueAsNumber: true })} />
      </div>

      {/* Comment Textarea */}
      <div>
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          Your Review
        </label>
        <textarea
          id="review-comment"
          rows={4}
          placeholder="Share your experience working with this seller..."
          className={cn(inputClass, 'resize-none', errors.comment && 'border-red-500')}
          {...register('comment')}
        />
        {errors.comment && (
          <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="md" loading={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </Button>
      </div>
    </motion.form>
  )
}
