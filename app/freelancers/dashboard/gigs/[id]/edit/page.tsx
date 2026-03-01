'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { GigForm } from '@/components/marketplace/forms/GigForm'
import { getGigById } from '@/lib/marketplace/queries'
import { updateGig } from '@/lib/marketplace/mutations'
import type { GigFormData } from '@/lib/validations/gig'
import type { Gig, PricingTier, TierPricing } from '@/types/marketplace'

function parseTier(data: GigFormData[PricingTier]): TierPricing {
  return {
    title: data.title,
    description: data.description,
    price: Number(data.price),
    delivery_days: Number(data.delivery_days),
    revisions: Number(data.revisions),
    features: data.features.split('\n').map((f) => f.trim()).filter(Boolean),
  }
}

function parseFaq(raw?: string): { question: string; answer: string }[] {
  if (!raw?.trim()) return []
  return raw.split('---').map((block) => {
    const [question, answer] = block.split('|||').map((s) => s.trim())
    return { question: question || '', answer: answer || '' }
  }).filter((f) => f.question && f.answer)
}

export default function EditGigPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [gig, setGig] = useState<Gig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGigById(params.id as string)
      .then(setGig)
      .finally(() => setLoading(false))
  }, [params.id])

  async function handleSubmit(data: GigFormData, images: string[]) {
    if (!gig) return

    await updateGig(gig.id, {
      title: data.title,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
      cover_image: images[0] || null,
      images: images.slice(1),
      pricing: {
        basic: parseTier(data.basic),
        standard: parseTier(data.standard),
        premium: parseTier(data.premium),
      },
      faq: parseFaq(data.faq),
    })

    router.push('/freelancers/dashboard/gigs')
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-text-secondary">Gig not found.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Gig</h1>
        <p className="mt-1 text-sm text-text-secondary">Update your service listing.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <GigForm userId={user?.id || ''} gig={gig} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
