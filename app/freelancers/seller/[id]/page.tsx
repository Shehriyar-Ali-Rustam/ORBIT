'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, Star, MessageSquare, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { GigCard } from '@/components/marketplace/GigCard'
import { StarRating } from '@/components/marketplace/StarRating'
import { SellerBadge } from '@/components/marketplace/SellerBadge'
import { EmptyState } from '@/components/marketplace/EmptyState'
import { getProfile, getSellerGigs, getSellerReviews } from '@/lib/marketplace/queries'
import type { Profile, Gig, Review } from '@/types/marketplace'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function SellerProfilePage() {
  const params = useParams()
  const id = params.id as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [gigs, setGigs] = useState<Gig[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'gigs' | 'about' | 'reviews'>('gigs')

  useEffect(() => {
    async function load() {
      try {
        const [p, g, r] = await Promise.all([
          getProfile(id),
          getSellerGigs(id),
          getSellerReviews(id),
        ])
        setProfile(p)
        setGigs(g)
        setReviews(r)
      } catch {}
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="py-24">
        <EmptyState title="Seller not found" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-col items-start gap-6 sm:flex-row"
      >
        {profile.photo_url ? (
          <Image src={profile.photo_url} alt={profile.display_name} width={96} height={96} className="h-24 w-24 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-orange-dim text-2xl font-bold text-orange">
            {profile.display_name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">{profile.display_name}</h1>
            <SellerBadge level={profile.level} />
          </div>
          {profile.tagline && (
            <p className="mt-1 text-text-secondary">{profile.tagline}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-tertiary">
            {profile.country && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {profile.country}
              </span>
            )}
            {profile.response_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {profile.response_time}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-orange text-orange" />
              {profile.rating.toFixed(1)} ({profile.review_count} reviews)
            </span>
          </div>
        </div>
        <Link href="/freelancers/dashboard/messages">
          <Button variant="primary">
            <MessageSquare className="mr-2 h-4 w-4" /> Contact
          </Button>
        </Link>
      </motion.div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 border-b border-border">
        {(['gigs', 'about', 'reviews'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'border-b-2 border-orange text-orange'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {t} {t === 'gigs' && `(${gigs.length})`} {t === 'reviews' && `(${reviews.length})`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tab === 'gigs' && (
          gigs.length === 0 ? (
            <EmptyState title="No gigs yet" description="This seller hasn't posted any services yet." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gigs.map((gig) => <GigCard key={gig.id} gig={{ ...gig, seller: profile }} />)}
            </div>
          )
        )}

        {tab === 'about' && (
          <div className="space-y-6">
            {profile.bio && (
              <div>
                <h3 className="text-sm font-bold text-text-primary">About</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">{profile.bio}</p>
              </div>
            )}
            {profile.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-text-primary">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="orange">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {(profile.github || profile.linkedin) && (
              <div>
                <h3 className="text-sm font-bold text-text-primary">Social</h3>
                <div className="mt-2 flex gap-3">
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-text-secondary hover:text-orange">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-text-secondary hover:text-orange">
                      <ExternalLink className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          reviews.length === 0 ? (
            <EmptyState title="No reviews yet" />
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-dim text-xs font-bold text-orange">
                      {review.buyer?.display_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-text-primary">{review.buyer?.display_name || 'Buyer'}</span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{review.comment}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
