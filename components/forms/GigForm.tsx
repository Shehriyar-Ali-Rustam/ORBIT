'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { gigSchema } from '@/lib/validations/gig'
import type { GigFormData } from '@/lib/validations/gig'
import { Button } from '@/components/ui/Button'
import { cn, slugify } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { createGig, updateGig } from '@/lib/firebase/firestore'
import { ImageUploader } from '@/components/forms/ImageUploader'
import type { Gig, GigStatus } from '@/types/marketplace'

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

const STEPS = [
  { label: 'Overview', number: 1 },
  { label: 'Pricing', number: 2 },
  { label: 'Gallery', number: 3 },
  { label: 'FAQ & Publish', number: 4 },
] as const

const categoryOptions = [
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
]

const TIER_NAMES = ['basic', 'standard', 'premium'] as const

interface FAQEntry {
  question: string
  answer: string
}

interface GigFormProps {
  initialGig?: Gig
}

export function GigForm({ initialGig }: GigFormProps) {
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(initialGig?.images ?? [])
  const [gigStatus, setGigStatus] = useState<GigStatus>(
    initialGig?.status ?? 'draft'
  )
  const [faqEntries, setFaqEntries] = useState<FAQEntry[]>(
    initialGig?.faq ?? [{ question: '', answer: '' }]
  )
  const [gigId] = useState<string>(
    initialGig?.id ?? `temp-${Date.now()}`
  )

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<GigFormData>({
    resolver: zodResolver(gigSchema) as Resolver<GigFormData>,
    defaultValues: initialGig
      ? {
          title: initialGig.title,
          description: initialGig.description,
          category: initialGig.category,
          subcategory: initialGig.subcategory,
          tags: initialGig.tags.join(', '),
          basic: {
            title: initialGig.pricing.basic.title,
            description: initialGig.pricing.basic.description,
            price: initialGig.pricing.basic.price,
            deliveryDays: initialGig.pricing.basic.deliveryDays,
            revisions: initialGig.pricing.basic.revisions,
            features: initialGig.pricing.basic.features.join(', '),
          },
          standard: {
            title: initialGig.pricing.standard.title,
            description: initialGig.pricing.standard.description,
            price: initialGig.pricing.standard.price,
            deliveryDays: initialGig.pricing.standard.deliveryDays,
            revisions: initialGig.pricing.standard.revisions,
            features: initialGig.pricing.standard.features.join(', '),
          },
          premium: {
            title: initialGig.pricing.premium.title,
            description: initialGig.pricing.premium.description,
            price: initialGig.pricing.premium.price,
            deliveryDays: initialGig.pricing.premium.deliveryDays,
            revisions: initialGig.pricing.premium.revisions,
            features: initialGig.pricing.premium.features.join(', '),
          },
          faq: initialGig.faq ? JSON.stringify(initialGig.faq) : '',
        }
      : {
          basic: { title: 'Basic', features: '' },
          standard: { title: 'Standard', features: '' },
          premium: { title: 'Premium', features: '' },
        },
  })

  // Validate step-specific fields before moving forward
  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return trigger([
          'title',
          'description',
          'category',
          'subcategory',
          'tags',
        ])
      case 2:
        return trigger([
          'basic.title',
          'basic.description',
          'basic.price',
          'basic.deliveryDays',
          'basic.revisions',
          'standard.title',
          'standard.description',
          'standard.price',
          'standard.deliveryDays',
          'standard.revisions',
          'premium.title',
          'premium.description',
          'premium.price',
          'premium.deliveryDays',
          'premium.revisions',
        ])
      default:
        return true
    }
  }

  const goToStep = async (step: number) => {
    // Allow going back without validation
    if (step < currentStep) {
      setCurrentStep(step)
      return
    }

    // Validate before going forward
    const isValid = await validateStep(currentStep)
    if (isValid) {
      setCurrentStep(step)
    }
  }

  const nextStep = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // FAQ management
  const addFaqEntry = () => {
    setFaqEntries((prev) => [...prev, { question: '', answer: '' }])
  }

  const removeFaqEntry = (index: number) => {
    setFaqEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const updateFaqEntry = (
    index: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    setFaqEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    )
  }

  const onSubmit = async (data: GigFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a gig.')
      return
    }

    setIsSubmitting(true)

    try {
      const parseTier = (tier: GigFormData['basic']) => ({
        title: tier.title,
        description: tier.description,
        price: tier.price,
        deliveryDays: tier.deliveryDays,
        revisions: tier.revisions,
        features: tier.features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
      })

      const tags = data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const validFaq = faqEntries.filter(
        (f) => f.question.trim() && f.answer.trim()
      )

      const slug = slugify(data.title)

      const gigData = {
        sellerId: user.uid,
        sellerName: user.displayName,
        sellerPhoto: user.photoURL,
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        tags,
        images,
        coverImage: images[0] ?? '',
        pricing: {
          basic: parseTier(data.basic),
          standard: parseTier(data.standard),
          premium: parseTier(data.premium),
        },
        faq: validFaq,
        status: gigStatus,
        rating: initialGig?.rating ?? 0,
        reviewCount: initialGig?.reviewCount ?? 0,
        orderCount: initialGig?.orderCount ?? 0,
      }

      if (initialGig) {
        await updateGig(initialGig.id, gigData)
        toast.success('Gig updated successfully!')
      } else {
        const newId = await createGig(gigData)
        toast.success(`Gig created successfully! ID: ${newId}`)
      }
    } catch (err) {
      console.error('Failed to save gig:', err)
      toast.error('Failed to save gig. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <div className="space-y-8">
      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step) => (
          <button
            key={step.number}
            type="button"
            onClick={() => goToStep(step.number)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              currentStep === step.number
                ? 'bg-orange text-white shadow-orange-glow-sm'
                : step.number < currentStep
                  ? 'bg-orange/10 text-orange'
                  : 'bg-surface text-text-tertiary hover:text-text-secondary'
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                currentStep === step.number
                  ? 'bg-white/20 text-white'
                  : step.number < currentStep
                    ? 'bg-orange/20 text-orange'
                    : 'bg-border text-text-tertiary'
              )}
            >
              {step.number < currentStep ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                step.number
              )}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1 - Overview */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">
                Gig Overview
              </h2>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="I will build a custom AI chatbot for your business"
                  className={cn(
                    inputClass,
                    errors.title && 'border-red-500'
                  )}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category & Subcategory */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    className={cn(
                      inputClass,
                      errors.category && 'border-red-500'
                    )}
                    {...register('category')}
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="subcategory"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Subcategory *
                  </label>
                  <input
                    id="subcategory"
                    type="text"
                    placeholder="e.g. Chatbot Development"
                    className={cn(
                      inputClass,
                      errors.subcategory && 'border-red-500'
                    )}
                    {...register('subcategory')}
                  />
                  {errors.subcategory && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.subcategory.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Tags *{' '}
                  <span className="text-text-tertiary">(comma-separated)</span>
                </label>
                <input
                  id="tags"
                  type="text"
                  placeholder="e.g. chatbot, AI, GPT, automation"
                  className={cn(
                    inputClass,
                    errors.tags && 'border-red-500'
                  )}
                  {...register('tags')}
                />
                {errors.tags && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.tags.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={8}
                  placeholder="Describe what you offer, your process, and what the client will receive..."
                  className={cn(
                    inputClass,
                    'resize-none',
                    errors.description && 'border-red-500'
                  )}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2 - Pricing */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">
                Pricing Tiers
              </h2>

              <div className="grid gap-6 lg:grid-cols-3">
                {TIER_NAMES.map((tier) => {
                  const tierErrors =
                    errors[tier as keyof typeof errors] as
                      | Record<string, { message?: string }>
                      | undefined

                  return (
                    <div
                      key={tier}
                      className="rounded-xl border border-border bg-surface/50 p-5 space-y-4"
                    >
                      <h3 className="text-center text-sm font-bold uppercase tracking-wide text-orange">
                        {tier}
                      </h3>

                      {/* Tier Title */}
                      <div>
                        <label
                          htmlFor={`${tier}.title`}
                          className="mb-1 block text-xs font-medium text-text-primary"
                        >
                          Package Title *
                        </label>
                        <input
                          id={`${tier}.title`}
                          type="text"
                          placeholder={`e.g. ${tier.charAt(0).toUpperCase() + tier.slice(1)} Package`}
                          className={cn(
                            inputClass,
                            tierErrors?.title && 'border-red-500'
                          )}
                          {...register(`${tier}.title` as const)}
                        />
                        {tierErrors?.title && (
                          <p className="mt-1 text-xs text-red-500">
                            {tierErrors.title.message}
                          </p>
                        )}
                      </div>

                      {/* Tier Description */}
                      <div>
                        <label
                          htmlFor={`${tier}.description`}
                          className="mb-1 block text-xs font-medium text-text-primary"
                        >
                          Description *
                        </label>
                        <textarea
                          id={`${tier}.description`}
                          rows={3}
                          placeholder="What's included in this tier..."
                          className={cn(
                            inputClass,
                            'resize-none',
                            tierErrors?.description && 'border-red-500'
                          )}
                          {...register(`${tier}.description` as const)}
                        />
                        {tierErrors?.description && (
                          <p className="mt-1 text-xs text-red-500">
                            {tierErrors.description.message}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <label
                          htmlFor={`${tier}.price`}
                          className="mb-1 block text-xs font-medium text-text-primary"
                        >
                          Price (USD) *
                        </label>
                        <input
                          id={`${tier}.price`}
                          type="number"
                          min={5}
                          placeholder="50"
                          className={cn(
                            inputClass,
                            tierErrors?.price && 'border-red-500'
                          )}
                          {...register(`${tier}.price` as const)}
                        />
                        {tierErrors?.price && (
                          <p className="mt-1 text-xs text-red-500">
                            {tierErrors.price.message}
                          </p>
                        )}
                      </div>

                      {/* Delivery Days */}
                      <div>
                        <label
                          htmlFor={`${tier}.deliveryDays`}
                          className="mb-1 block text-xs font-medium text-text-primary"
                        >
                          Delivery (days) *
                        </label>
                        <input
                          id={`${tier}.deliveryDays`}
                          type="number"
                          min={1}
                          placeholder="7"
                          className={cn(
                            inputClass,
                            tierErrors?.deliveryDays && 'border-red-500'
                          )}
                          {...register(`${tier}.deliveryDays` as const)}
                        />
                        {tierErrors?.deliveryDays && (
                          <p className="mt-1 text-xs text-red-500">
                            {tierErrors.deliveryDays.message}
                          </p>
                        )}
                      </div>

                      {/* Revisions */}
                      <div>
                        <label
                          htmlFor={`${tier}.revisions`}
                          className="mb-1 block text-xs font-medium text-text-primary"
                        >
                          Revisions *
                        </label>
                        <input
                          id={`${tier}.revisions`}
                          type="number"
                          min={0}
                          placeholder="2"
                          className={cn(
                            inputClass,
                            tierErrors?.revisions && 'border-red-500'
                          )}
                          {...register(`${tier}.revisions` as const)}
                        />
                        {tierErrors?.revisions && (
                          <p className="mt-1 text-xs text-red-500">
                            {tierErrors.revisions.message}
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div>
                        <label
                          htmlFor={`${tier}.features`}
                          className="mb-1 block text-xs font-medium text-text-primary"
                        >
                          Features{' '}
                          <span className="text-text-tertiary">
                            (comma-separated)
                          </span>
                        </label>
                        <input
                          id={`${tier}.features`}
                          type="text"
                          placeholder="e.g. Source code, Documentation"
                          className={inputClass}
                          {...register(`${tier}.features` as const)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3 - Gallery */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">
                Gig Gallery
              </h2>
              <p className="text-sm text-text-secondary">
                Upload images showcasing your work. The first image will be used
                as the cover image.
              </p>

              <ImageUploader
                images={images}
                onImagesChange={setImages}
                maxImages={5}
                sellerId={user?.uid ?? ''}
                gigId={gigId}
              />
            </motion.div>
          )}

          {/* Step 4 - FAQ & Publish */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">
                FAQ &amp; Publish
              </h2>

              {/* FAQ Entries */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary">
                    Frequently Asked Questions{' '}
                    <span className="text-text-tertiary">(optional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={addFaqEntry}
                    className="flex items-center gap-1 text-xs font-medium text-orange transition-colors hover:text-orange-hover"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Question
                  </button>
                </div>

                {faqEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border bg-surface/50 p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          placeholder="Question"
                          value={entry.question}
                          onChange={(e) =>
                            updateFaqEntry(index, 'question', e.target.value)
                          }
                          className={inputClass}
                        />
                        <textarea
                          rows={2}
                          placeholder="Answer"
                          value={entry.answer}
                          onChange={(e) =>
                            updateFaqEntry(index, 'answer', e.target.value)
                          }
                          className={cn(inputClass, 'resize-none')}
                        />
                      </div>
                      {faqEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaqEntry(index)}
                          className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-red-500/10 hover:text-red-500"
                          aria-label="Remove question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Toggle */}
              <div className="rounded-lg border border-border bg-surface/50 p-5">
                <label className="mb-3 block text-sm font-medium text-text-primary">
                  Gig Status
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setGigStatus('draft')}
                    className={cn(
                      'flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                      gigStatus === 'draft'
                        ? 'border-orange bg-orange/10 text-orange'
                        : 'border-border text-text-tertiary hover:border-orange/50'
                    )}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setGigStatus('active')}
                    className={cn(
                      'flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                      gigStatus === 'active'
                        ? 'border-green-500 bg-green-500/10 text-green-500'
                        : 'border-border text-text-tertiary hover:border-green-500/50'
                    )}
                  >
                    Active
                  </button>
                </div>
                <p className="mt-2 text-xs text-text-tertiary">
                  {gigStatus === 'draft'
                    ? 'Your gig will be saved but not visible to buyers.'
                    : 'Your gig will be published and visible to buyers.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(currentStep === 1 && 'invisible')}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-text-tertiary">
            Step {currentStep} of {STEPS.length}
          </span>

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={nextStep}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : initialGig ? (
                'Update Gig'
              ) : (
                'Publish Gig'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
