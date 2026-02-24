'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Heart, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Gig } from '@/types/marketplace'

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI & ML',
  web: 'Web Dev',
  mobile: 'Mobile',
  design: 'Design',
  marketing: 'Marketing',
  other: 'Other',
}

interface GigCardProps {
  gig: Gig
}

export function GigCard({ gig }: GigCardProps) {
  const startingPrice = Math.min(
    gig.pricing.basic.price,
    gig.pricing.standard.price,
    gig.pricing.premium.price
  )

  return (
    <Link href={`/gig/${gig.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-50px' }}
        className="card-hover overflow-hidden rounded-xl border border-border bg-surface"
      >
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden bg-surface">
          {gig.coverImage ? (
            <Image
              src={gig.coverImage}
              alt={gig.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-orange-dim">
              <Briefcase className="h-10 w-10 text-orange" />
            </div>
          )}

          {/* Seller info overlay */}
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-background/70 px-2 py-1 backdrop-blur-sm">
            {gig.sellerPhoto ? (
              <Image
                src={gig.sellerPhoto}
                alt={gig.sellerName}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-dim text-[10px] font-bold text-orange">
                {gig.sellerName.charAt(0)}
              </div>
            )}
            <span className="text-xs font-medium text-text-primary">
              {gig.sellerName}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary">
            {gig.title}
          </h3>

          {/* Category badge */}
          <div className="mt-2">
            <Badge variant="orange">
              {CATEGORY_LABELS[gig.category] ?? gig.category}
            </Badge>
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-orange text-orange" />
            <span className="text-sm font-medium text-text-primary">
              {gig.rating.toFixed(1)}
            </span>
            <span className="text-xs text-text-tertiary">
              ({gig.reviewCount})
            </span>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div>
              <span className="text-xs text-text-tertiary">Starting at</span>
              <span className="ml-1 text-base font-bold text-text-primary">
                ${startingPrice}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                'text-text-tertiary transition-colors hover:bg-orange-dim hover:text-orange'
              )}
              aria-label="Save gig"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
