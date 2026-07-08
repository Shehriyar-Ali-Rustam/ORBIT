'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { GigForm } from '@/components/marketplace/forms/GigForm'
import { createGig } from '@/lib/marketplace/mutations'
import type { GigFormData } from '@/lib/validations/gig'
import type { PricingTier, TierPricing } from '@/types/marketplace'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

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

export default function NewGigPage() {
  const { user } = useUser()
  const router = useRouter()

  async function handleSubmit(data: GigFormData, images: string[]) {
    if (!user?.id) return

    const slug = slugify(data.title) + '-' + Date.now().toString(36)

    await createGig({
      seller_id: user.id,
      title: data.title,
      slug,
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
      status: 'active',
    })

    router.push('/freelancers/dashboard/gigs')
  }

  if (!user?.id) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Create New Gig</h1>
        <p className="mt-1 text-sm text-text-secondary">Set up your service listing step by step.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <GigForm userId={user.id} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
