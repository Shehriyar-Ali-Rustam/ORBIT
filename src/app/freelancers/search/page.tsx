'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { GigCard } from '@/components/marketplace/GigCard'
import { FilterSidebar } from '@/components/marketplace/FilterSidebar'
import { SortDropdown } from '@/components/marketplace/SortDropdown'
import { EmptyState } from '@/components/marketplace/EmptyState'
import { searchGigs } from '@/lib/marketplace/queries'
import type { Gig, GigCategory, SellerLevel } from '@/types/marketplace'

function SearchContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const categoryParam = (searchParams.get('category') || '') as GigCategory | ''

  const [gigs, setGigs] = useState<Gig[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Filters
  const [category, setCategory] = useState<GigCategory | ''>(categoryParam)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(50000)
  const [minRating, setMinRating] = useState(0)
  const [deliveryDays, setDeliveryDays] = useState<number | null>(null)
  const [sellerLevel, setSellerLevel] = useState<SellerLevel | ''>('')
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'rating' | 'price_low' | 'price_high'>('relevant')

  const fetchGigs = useCallback(async () => {
    setLoading(true)
    try {
      const { gigs: results, count } = await searchGigs({
        query: queryParam,
        category,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        page,
        limit: 20,
      })
      setGigs(results)
      setTotalCount(count)
    } catch {
      // Silent fail if not configured
    } finally {
      setLoading(false)
    }
  }, [queryParam, category, minPrice, maxPrice, minRating, sortBy, page])

  useEffect(() => {
    fetchGigs()
  }, [fetchGigs])

  function clearAllFilters() {
    setCategory('')
    setMinPrice(0)
    setMaxPrice(50000)
    setMinRating(0)
    setDeliveryDays(null)
    setSellerLevel('')
  }

  return (
    <>
      {/* Search bar */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <SearchBar defaultQuery={queryParam} />
        </div>
      </section>

      {/* Results */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-text-primary">
              {loading ? (
                <span className="inline-block h-5 w-32 animate-pulse rounded bg-border" />
              ) : (
                <>
                  {totalCount.toLocaleString()}{' '}
                  <span className="font-normal text-text-secondary">
                    {totalCount === 1 ? 'service' : 'services'}
                    {queryParam && ` for "${queryParam}"`}
                  </span>
                </>
              )}
            </h2>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Two-column layout */}
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <div className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24">
                <FilterSidebar
                  category={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  minRating={minRating}
                  deliveryDays={deliveryDays}
                  sellerLevel={sellerLevel}
                  onCategoryChange={setCategory}
                  onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max) }}
                  onRatingChange={setMinRating}
                  onDeliveryChange={setDeliveryDays}
                  onLevelChange={setSellerLevel}
                  onClearAll={clearAllFilters}
                />
              </div>
            </div>

            {/* Grid */}
            <div className="min-w-0 flex-1">
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-surface" />
                  ))}
                </div>
              ) : gigs.length === 0 ? (
                <EmptyState
                  title="No services found"
                  description="Try adjusting your filters or search for something different."
                  action={
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-sm font-medium text-orange hover:underline"
                    >
                      Clear all filters
                    </button>
                  }
                />
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {gigs.map((gig) => (
                      <GigCard key={gig.id} gig={gig} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalCount > 20 && (
                    <div className="mt-8 flex justify-center gap-2">
                      <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-orange disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="flex items-center px-4 text-sm text-text-tertiary">
                        Page {page} of {Math.ceil(totalCount / 20)}
                      </span>
                      <button
                        type="button"
                        disabled={page >= Math.ceil(totalCount / 20)}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-orange disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
