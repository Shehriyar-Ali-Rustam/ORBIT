'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Heart, Briefcase, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/lib/marketplace/constants'
import type { Gig } from '@/types/marketplace'

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  ai:         { color: '#A78BFA', bg: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)' },
  web:        { color: '#60A5FA', bg: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)' },
  mobile:     { color: '#34D399', bg: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)' },
  design:     { color: '#F472B6', bg: 'linear-gradient(135deg, #831843 0%, #BE185D 100%)' },
  marketing:  { color: '#FB923C', bg: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)' },
  other:      { color: '#94A3B8', bg: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)' },
}

interface GigCardProps {
  gig: Gig
  onSave?: (gigId: string) => void
  isSaved?: boolean
}

export function GigCard({ gig, onSave, isSaved = false }: GigCardProps) {
  const startingPrice = Math.min(
    gig.pricing.basic.price,
    gig.pricing.standard.price,
    gig.pricing.premium.price
  )
  const catStyle = CATEGORY_COLORS[gig.category] ?? CATEGORY_COLORS.other
  const deliveryDays = gig.pricing.basic.delivery_days

  return (
    <Link href={`/freelancers/gig/${gig.slug}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-50px' }}
        className="overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* ── Cover image ── */}
        <div className="relative aspect-video overflow-hidden">
          {gig.cover_image ? (
            <Image
              src={gig.cover_image}
              alt={gig.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center" style={{ background: catStyle.bg }}>
              <Briefcase className="h-10 w-10 text-white/50" />
            </div>
          )}

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category badge */}
          <div
            className="absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: `${catStyle.color}22`,
              border: `1px solid ${catStyle.color}50`,
              color: catStyle.color,
              backdropFilter: 'blur(4px)',
            }}
          >
            {CATEGORY_LABELS[gig.category] ?? gig.category}
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onSave?.(gig.id)
            }}
            className={cn(
              'absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200',
              isSaved
                ? 'bg-accent text-white'
                : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
            )}
            aria-label="Save gig"
          >
            <Heart className={cn('h-3.5 w-3.5', isSaved && 'fill-white')} />
          </button>

          {/* Seller info */}
          {gig.seller && (
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
              {gig.seller.photo_url ? (
                <Image
                  src={gig.seller.photo_url}
                  alt={gig.seller.display_name}
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ background: catStyle.color }}
                >
                  {gig.seller.display_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="max-w-[90px] truncate text-[11px] font-medium text-white/90">
                {gig.seller.display_name}
              </span>
            </div>
          )}
        </div>

        {/* ── Card body ── */}
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary transition-colors duration-200 group-hover:text-accent">
            {gig.title}
          </h3>

          <div className="mt-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-text-primary">{gig.rating.toFixed(1)}</span>
              <span className="text-xs text-text-tertiary">({gig.review_count})</span>
            </div>
            {deliveryDays > 0 && (
              <div className="flex items-center gap-1 text-xs text-text-tertiary">
                <Clock className="h-3 w-3" />
                <span>{deliveryDays}d delivery</span>
              </div>
            )}
          </div>

          <div
            className="mt-3 flex items-center justify-between border-t pt-3"
            style={{ borderColor: 'var(--color-card-border)' }}
          >
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-text-tertiary">From</span>
              <span className="text-base font-bold text-text-primary">${startingPrice}</span>
            </div>
            <div
              className="rounded-lg px-2.5 py-1 text-xs font-semibold"
              style={{ background: `${catStyle.color}14`, color: catStyle.color }}
            >
              Order Now
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
