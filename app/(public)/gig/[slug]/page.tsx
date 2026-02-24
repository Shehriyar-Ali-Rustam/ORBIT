'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Star, ShoppingBag } from 'lucide-react'
import { getGigBySlug } from '@/lib/firebase/firestore'
import { Badge } from '@/components/ui/Badge'
import { GigGallery } from '@/components/sections/gig/GigGallery'
import { PricingTabs } from '@/components/sections/gig/PricingTabs'
import { SellerSidebar } from '@/components/sections/gig/SellerSidebar'
import { GigFAQ } from '@/components/sections/gig/GigFAQ'
import { GigReviews } from '@/components/sections/gig/GigReviews'
import type { Gig, PricingTier } from '@/types/marketplace'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function GigDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [gig, setGig] = useState<(Gig & { id: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchGig() {
      try {
        setLoading(true)
        setNotFound(false)
        const data = await getGigBySlug(slug)
        if (!cancelled) {
          if (data) {
            setGig(data)
          } else {
            setNotFound(true)
          }
        }
      } catch {
        if (!cancelled) {
          setNotFound(true)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchGig()

    return () => {
      cancelled = true
    }
  }, [slug])

  const handleOrder = (tier: PricingTier) => {
    // TODO: Implement order flow (redirect to checkout)
    console.log(`Order tier: ${tier} for gig: ${gig?.id}`)
  }

  // Loading state
  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-orange" />
      </section>
    )
  }

  // Not found state
  if (notFound || !gig) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-text-primary">Gig Not Found</h1>
          <p className="mt-3 text-text-secondary">
            The gig you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm text-orange transition-colors hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </motion.div>

        {/* Two-column layout */}
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          {/* Left column - Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <GigGallery images={gig.images.length > 0 ? gig.images : [gig.coverImage]} />
            </motion.div>

            {/* Title & meta */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="orange">{gig.category.toUpperCase()}</Badge>
                {gig.subcategory && (
                  <Badge variant="outline">{gig.subcategory}</Badge>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                {gig.title}
              </h1>

              {/* Stats row */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-orange text-orange" />
                  <span className="font-semibold text-text-primary">{gig.rating.toFixed(1)}</span>
                  <span>({gig.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4 text-text-tertiary" />
                  <span>{gig.orderCount} orders</span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              <h2 className="text-xl font-bold text-text-primary">About This Gig</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-text-secondary">
                {gig.description}
              </p>

              {/* Tags */}
              {gig.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {gig.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>

            {/* FAQ */}
            {gig.faq.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true }}
              >
                <GigFAQ faq={gig.faq} />
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              viewport={{ once: true }}
            >
              <GigReviews gigId={gig.id} />
            </motion.div>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            <PricingTabs pricing={gig.pricing} onOrder={handleOrder} />
            <SellerSidebar
              sellerId={gig.sellerId}
              sellerName={gig.sellerName}
              sellerPhoto={gig.sellerPhoto}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
