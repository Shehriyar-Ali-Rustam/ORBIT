'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  showValue?: boolean
  count?: number
}

const sizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' }

export function StarRating({
  rating,
  maxStars = 5,
  size = 'sm',
  interactive = false,
  onChange,
  showValue = false,
  count,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const filled = i < Math.floor(rating)
          const partial = !filled && i < rating

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => onChange?.(i + 1)}
              className={cn(
                interactive && 'cursor-pointer transition-transform hover:scale-110',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizes[size],
                  filled && 'fill-orange text-orange',
                  partial && 'fill-orange/50 text-orange',
                  !filled && !partial && 'fill-transparent text-border'
                )}
              />
            </button>
          )
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-text-primary">
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className="text-xs text-text-tertiary">({count})</span>
      )}
    </div>
  )
}
