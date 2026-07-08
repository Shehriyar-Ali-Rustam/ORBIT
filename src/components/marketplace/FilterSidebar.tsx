'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GIG_CATEGORIES, SELLER_LEVELS } from '@/lib/marketplace/constants'
import type { GigCategory, SellerLevel } from '@/types/marketplace'

interface FilterSidebarProps {
  category: GigCategory | ''
  minPrice: number
  maxPrice: number
  minRating: number
  deliveryDays: number | null
  sellerLevel: SellerLevel | ''
  onCategoryChange: (category: GigCategory | '') => void
  onPriceChange: (min: number, max: number) => void
  onRatingChange: (rating: number) => void
  onDeliveryChange: (days: number | null) => void
  onLevelChange: (level: SellerLevel | '') => void
  onClearAll: () => void
}

const DELIVERY_OPTIONS = [
  { label: 'Any', value: null },
  { label: '1 day', value: 1 },
  { label: '3 days', value: 3 },
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
]

export function FilterSidebar({
  category,
  minPrice,
  maxPrice,
  minRating,
  deliveryDays,
  sellerLevel,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onDeliveryChange,
  onLevelChange,
  onClearAll,
}: FilterSidebarProps) {
  const [localMin, setLocalMin] = useState(minPrice.toString())
  const [localMax, setLocalMax] = useState(maxPrice.toString())

  function applyPrice() {
    onPriceChange(Number(localMin) || 0, Number(localMax) || 50000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary">Filters</h3>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-text-tertiary transition-colors hover:text-orange"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Category
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className={cn(
              'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
              !category ? 'bg-orange-dim font-medium text-orange' : 'text-text-secondary hover:bg-surface'
            )}
          >
            All Categories
          </button>
          {GIG_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                category === cat.value
                  ? 'bg-orange-dim font-medium text-orange'
                  : 'text-text-secondary hover:bg-surface'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Price Range
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={applyPrice}
            placeholder="$0"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-orange focus:outline-none"
          />
          <span className="text-text-tertiary">—</span>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={applyPrice}
            placeholder="$50000"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-orange focus:outline-none"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Minimum Rating
        </h4>
        <div className="space-y-1">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRatingChange(r)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                minRating === r
                  ? 'bg-orange-dim font-medium text-orange'
                  : 'text-text-secondary hover:bg-surface'
              )}
            >
              {r === 0 ? (
                'Any rating'
              ) : (
                <>
                  <Star className="h-3.5 w-3.5 fill-orange text-orange" />
                  {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Time */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Delivery Time
        </h4>
        <div className="space-y-1">
          {DELIVERY_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onDeliveryChange(opt.value)}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                deliveryDays === opt.value
                  ? 'bg-orange-dim font-medium text-orange'
                  : 'text-text-secondary hover:bg-surface'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seller Level */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Seller Level
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onLevelChange('')}
            className={cn(
              'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
              !sellerLevel ? 'bg-orange-dim font-medium text-orange' : 'text-text-secondary hover:bg-surface'
            )}
          >
            Any Level
          </button>
          {SELLER_LEVELS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => onLevelChange(l.value)}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                sellerLevel === l.value
                  ? 'bg-orange-dim font-medium text-orange'
                  : 'text-text-secondary hover:bg-surface'
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
