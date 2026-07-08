'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, RefreshCw, Check, ChevronRight, MessageSquare, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/marketplace/StarRating'
import { SellerBadge } from '@/components/marketplace/SellerBadge'
import { EmptyState } from '@/components/marketplace/EmptyState'
import { getGigBySlug, getGigReviews } from '@/lib/marketplace/queries'
import { CATEGORY_LABELS } from '@/lib/marketplace/constants'
import { cn } from '@/lib/utils'
import type { Gig, Review, PricingTier } from '@/types/marketplace'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
const TIERS: PricingTier[] = ['basic', 'standard', 'premium']
const TIER_LABELS: Record<PricingTier, string> = { basic: 'Basic', standard: 'Standard', premium: 'Premium' }

export default function GigDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [gig, setGig] = useState<Gig | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<PricingTier>('basic')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const gigData = await getGigBySlug(slug)
        setGig(gigData)
        if (gigData) {
          const revs = await getGigReviews(gigData.id)
          setReviews(revs)
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="py-24">
        <EmptyState title="Gig not found" description="This service may have been removed or is no longer available." />
      </div>
    )
  }

  const pricing = gig.pricing[selectedTier]
  const allImages = [gig.cover_image, ...gig.images].filter(Boolean) as string[]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/freelancers" className="hover:text-text-primary">Freelancers</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/freelancers/search?category=${gig.category}`} className="hover:text-text-primary">
          {CATEGORY_LABELS[gig.category]}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-text-secondary">{gig.title}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Column */}
        <div className="min-w-0 flex-1">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-2xl font-bold text-text-primary lg:text-3xl"
          >
            {gig.title}
          </motion.h1>

          {/* Seller bar */}
          {gig.seller && (
            <div className="mt-4 flex items-center gap-3">
              <Link href={`/freelancers/seller/${gig.seller.id}`} className="flex items-center gap-3">
                {gig.seller.photo_url ? (
                  <Image src={gig.seller.photo_url} alt={gig.seller.display_name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-dim font-bold text-orange">
                    {gig.seller.display_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{gig.seller.display_name}</span>
                    <SellerBadge level={gig.seller.level} />
                  </div>
                  <StarRating rating={gig.rating} showValue count={gig.review_count} size="sm" />
                </div>
              </Link>
            </div>
          )}

          {/* Gallery */}
          {allImages.length > 0 && (
            <div className="mt-6">
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                <Image
                  src={allImages[activeImage]}
                  alt={gig.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              </div>
              {allImages.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                        activeImage === i ? 'border-orange' : 'border-border'
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-text-primary">About This Gig</h2>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {gig.description}
            </div>
          </div>

          {/* Tags */}
          {gig.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {gig.tags.map((tag) => (
                <Badge key={tag} variant="default">{tag}</Badge>
              ))}
            </div>
          )}

          {/* FAQ */}
          {gig.faq.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-text-primary">FAQ</h2>
              <div className="mt-4 space-y-3">
                {gig.faq.map((item, i) => (
                  <details key={i} className="group rounded-xl border border-border bg-surface">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">
                      {item.question}
                    </summary>
                    <div className="border-t border-border px-4 py-3 text-sm text-text-secondary">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-text-primary">
              Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-text-tertiary">No reviews yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-3">
                      {review.buyer?.photo_url ? (
                        <Image src={review.buyer.photo_url} alt="" width={32} height={32} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-dim text-xs font-bold text-orange">
                          {review.buyer?.display_name?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-text-primary">
                          {review.buyer?.display_name || 'Buyer'}
                        </span>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{review.comment}</p>
                    {review.seller_response && (
                      <div className="mt-3 rounded-lg bg-background p-3">
                        <p className="text-xs font-medium text-text-tertiary">Seller response</p>
                        <p className="mt-1 text-sm text-text-secondary">{review.seller_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Pricing */}
        <div className="w-full shrink-0 lg:w-[380px]">
          <div className="sticky top-24">
            <div className="rounded-2xl border border-border bg-surface">
              {/* Tier tabs */}
              <div className="flex border-b border-border">
                {TIERS.map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={cn(
                      'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                      selectedTier === tier
                        ? 'border-b-2 border-orange text-orange'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {TIER_LABELS[tier]}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-text-primary">{pricing.title}</h3>
                  <span className="text-2xl font-bold text-orange">${pricing.price}</span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{pricing.description}</p>

                <div className="mt-4 flex items-center gap-4 text-sm text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {pricing.delivery_days} day delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" /> {pricing.revisions} revisions
                  </span>
                </div>

                {pricing.features.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {pricing.features.filter(Boolean).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <Button variant="primary" size="lg" className="mt-6 w-full">
                  Order Now — ${pricing.price}
                </Button>

                <Link href={`/freelancers/dashboard/messages`}>
                  <Button variant="ghost" size="lg" className="mt-2 w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Seller
                  </Button>
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-tertiary">
                  <Shield className="h-3.5 w-3.5" />
                  Orbit guarantees satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
