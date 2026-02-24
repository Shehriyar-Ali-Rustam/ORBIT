'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

const DELIVERY_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Any', value: null },
  { label: '1 day', value: 1 },
  { label: '3 days', value: 3 },
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
]

interface MarketplaceFiltersProps {
  priceRange: [number, number]
  deliveryDays: number | null
  rating: number | null
  onPriceRangeChange: (range: [number, number]) => void
  onDeliveryDaysChange: (days: number | null) => void
  onRatingChange: (rating: number | null) => void
  onClearAll: () => void
}

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border pb-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-text-primary transition-colors hover:text-orange"
      >
        {title}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-text-tertiary transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function MarketplaceFilters({
  priceRange,
  deliveryDays,
  rating,
  onPriceRangeChange,
  onDeliveryDaysChange,
  onRatingChange,
  onClearAll,
}: MarketplaceFiltersProps) {
  return (
    <aside className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-text-primary">Filters</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="flex items-center gap-1 text-xs text-text-tertiary transition-colors hover:text-orange"
        >
          <X className="h-3 w-3" />
          Clear all
        </button>
      </div>

      {/* Price Range */}
      <CollapsibleSection title="Price Range">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label
              htmlFor="price-min"
              className="mb-1 block text-xs text-text-tertiary"
            >
              Min ($)
            </label>
            <input
              id="price-min"
              type="number"
              min={0}
              value={priceRange[0]}
              onChange={(e) =>
                onPriceRangeChange([
                  Number(e.target.value),
                  priceRange[1],
                ])
              }
              placeholder="0"
              className={inputClass}
            />
          </div>
          <span className="mt-5 text-text-tertiary">-</span>
          <div className="flex-1">
            <label
              htmlFor="price-max"
              className="mb-1 block text-xs text-text-tertiary"
            >
              Max ($)
            </label>
            <input
              id="price-max"
              type="number"
              min={0}
              value={priceRange[1]}
              onChange={(e) =>
                onPriceRangeChange([
                  priceRange[0],
                  Number(e.target.value),
                ])
              }
              placeholder="1000"
              className={inputClass}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Delivery Time */}
      <CollapsibleSection title="Delivery Time">
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((option) => (
            <label
              key={option.label}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-orange-dim"
            >
              <input
                type="radio"
                name="delivery-days"
                checked={deliveryDays === option.value}
                onChange={() => onDeliveryDaysChange(option.value)}
                className="h-4 w-4 border-border text-orange accent-orange"
              />
              <span
                className={cn(
                  'text-sm',
                  deliveryDays === option.value
                    ? 'font-medium text-text-primary'
                    : 'text-text-secondary'
                )}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* Minimum Rating */}
      <CollapsibleSection title="Minimum Rating">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(rating === star ? null : star)}
              className="rounded p-1 transition-colors hover:bg-orange-dim"
              aria-label={`${star} star${star > 1 ? 's' : ''} and above`}
            >
              <Star
                className={cn(
                  'h-5 w-5 transition-colors',
                  rating !== null && star <= rating
                    ? 'fill-orange text-orange'
                    : 'text-text-tertiary'
                )}
              />
            </button>
          ))}
          {rating !== null && (
            <span className="ml-2 text-xs text-text-secondary">
              {rating}+ stars
            </span>
          )}
        </div>
      </CollapsibleSection>

      {/* Clear All Button */}
      <div className="pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={onClearAll}
        >
          Clear All Filters
        </Button>
      </div>
    </aside>
  )
}
