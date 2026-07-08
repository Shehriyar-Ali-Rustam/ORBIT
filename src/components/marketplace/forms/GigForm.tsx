'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from './ImageUploader'
import { gigSchema, type GigFormData } from '@/lib/validations/gig'
import { GIG_CATEGORIES } from '@/lib/marketplace/constants'
import { cn } from '@/lib/utils'
import type { Gig, PricingTier } from '@/types/marketplace'

const STEPS = ['Overview', 'Pricing', 'Gallery & FAQ', 'Review']
const TIERS: PricingTier[] = ['basic', 'standard', 'premium']

interface GigFormProps {
  userId: string
  gig?: Gig | null
  onSubmit: (data: GigFormData, images: string[]) => Promise<void>
}

export function GigForm({ userId, gig, onSubmit }: GigFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [images, setImages] = useState<string[]>(gig ? [gig.cover_image, ...gig.images].filter(Boolean) as string[] : [])
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<GigFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(gigSchema) as any,
    defaultValues: gig
      ? {
          title: gig.title,
          description: gig.description,
          category: gig.category,
          subcategory: gig.subcategory,
          tags: gig.tags.join(', '),
          basic: { ...gig.pricing.basic, features: gig.pricing.basic.features.join('\n') },
          standard: { ...gig.pricing.standard, features: gig.pricing.standard.features.join('\n') },
          premium: { ...gig.pricing.premium, features: gig.pricing.premium.features.join('\n') },
          faq: gig.faq.map((f) => `${f.question}|||${f.answer}`).join('\n---\n'),
        }
      : {
          basic: { title: 'Basic', description: '', price: 5, delivery_days: 7, revisions: 1, features: '' },
          standard: { title: 'Standard', description: '', price: 25, delivery_days: 5, revisions: 3, features: '' },
          premium: { title: 'Premium', description: '', price: 100, delivery_days: 3, revisions: 5, features: '' },
        },
  })

  const values = watch()

  async function goNext() {
    let valid = true
    if (step === 0) {
      valid = await trigger(['title', 'description', 'category', 'subcategory', 'tags'])
    } else if (step === 1) {
      valid = await trigger(['basic', 'standard', 'premium'])
    }
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  async function handleFormSubmit(data: GigFormData) {
    setSubmitting(true)
    try {
      await onSubmit(data, images)
    } catch (err) {
      console.error('Submit failed:', err)
    }
    setSubmitting(false)
  }

  const inputClass = 'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange'

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                i === step
                  ? 'bg-orange text-white'
                  : i < step
                    ? 'bg-orange-dim text-orange cursor-pointer'
                    : 'bg-surface text-text-tertiary'
              )}
            >
              {i + 1}
            </button>
            <span className={cn('hidden text-sm sm:block', i === step ? 'text-text-primary font-medium' : 'text-text-tertiary')}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-1 h-px w-6 bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 0: Overview */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Gig Title</label>
            <input {...register('title')} className={inputClass} placeholder="I will build a ..." />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Category</label>
            <select {...register('category')} className={inputClass}>
              <option value="">Select a category</option>
              {GIG_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Subcategory</label>
            <input {...register('subcategory')} className={inputClass} placeholder="e.g. React Development" />
            {errors.subcategory && <p className="mt-1 text-xs text-red-400">{errors.subcategory.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Description</label>
            <textarea {...register('description')} rows={6} className={cn(inputClass, 'resize-none')} placeholder="Describe your service in detail..." />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Tags (comma separated)</label>
            <input {...register('tags')} className={inputClass} placeholder="react, nextjs, typescript" />
            {errors.tags && <p className="mt-1 text-xs text-red-400">{errors.tags.message}</p>}
          </div>
        </div>
      )}

      {/* Step 1: Pricing */}
      {step === 1 && (
        <div className="space-y-6">
          {TIERS.map((tier) => (
            <div key={tier} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-4 text-sm font-bold capitalize text-text-primary">{tier} Package</h3>
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-text-tertiary">Package Title</label>
                    <input {...register(`${tier}.title`)} className={inputClass} />
                    {errors[tier]?.title && <p className="mt-1 text-xs text-red-400">{errors[tier].title?.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-tertiary">Price ($)</label>
                    <input {...register(`${tier}.price`)} type="number" className={inputClass} />
                    {errors[tier]?.price && <p className="mt-1 text-xs text-red-400">{errors[tier].price?.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-tertiary">Description</label>
                  <input {...register(`${tier}.description`)} className={inputClass} />
                  {errors[tier]?.description && <p className="mt-1 text-xs text-red-400">{errors[tier].description?.message}</p>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-text-tertiary">Delivery (days)</label>
                    <input {...register(`${tier}.delivery_days`)} type="number" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-tertiary">Revisions</label>
                    <input {...register(`${tier}.revisions`)} type="number" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-tertiary">Features (one per line)</label>
                  <textarea {...register(`${tier}.features`)} rows={3} className={cn(inputClass, 'resize-none')} placeholder="Feature 1&#10;Feature 2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Gallery & FAQ */}
      {step === 2 && (
        <div className="space-y-6">
          <ImageUploader
            bucket="gig-images"
            userId={userId}
            value={images}
            onChange={setImages}
            maxImages={5}
            label="Gig Images"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">FAQ (optional)</label>
            <p className="mb-2 text-xs text-text-tertiary">Separate question and answer with ||| and entries with ---</p>
            <textarea
              {...register('faq')}
              rows={6}
              className={cn(inputClass, 'resize-none')}
              placeholder={'What is included?|||Everything listed in the package features.\n---\nDo you offer support?|||Yes, 30 days of support after delivery.'}
            />
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-text-primary">Overview</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-tertiary">Title</dt>
                <dd className="text-text-primary">{values.title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-tertiary">Category</dt>
                <dd className="text-text-primary capitalize">{values.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-tertiary">Tags</dt>
                <dd className="text-text-primary">{values.tags}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-text-primary">Pricing</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {TIERS.map((tier) => (
                <div key={tier} className="rounded-lg border border-border p-3">
                  <p className="text-xs font-medium capitalize text-text-tertiary">{tier}</p>
                  <p className="mt-1 text-lg font-bold text-orange">${values[tier]?.price || 0}</p>
                  <p className="text-xs text-text-tertiary">{values[tier]?.delivery_days || 0} day delivery</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="text-sm font-bold text-text-primary">Images</h3>
            <p className="mt-1 text-sm text-text-secondary">{images.length} image(s) uploaded</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => step === 0 ? router.back() : setStep((s) => s - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" variant="primary" size="sm" onClick={goNext}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" variant="primary" size="sm" loading={submitting}>
            {gig ? 'Update Gig' : 'Publish Gig'}
          </Button>
        )}
      </div>
    </form>
  )
}
