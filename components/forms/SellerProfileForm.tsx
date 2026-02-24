'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { sellerProfileSchema } from '@/lib/validations/profile'
import type { SellerProfileFormData } from '@/lib/validations/profile'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { updateUserDoc } from '@/lib/firebase/firestore'
import type { SellerProfile } from '@/types/marketplace'

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

interface SellerProfileFormProps {
  initialData?: SellerProfile
}

export function SellerProfileForm({ initialData }: SellerProfileFormProps) {
  const { user, setUser } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [available, setAvailable] = useState(initialData?.available ?? true)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerProfileFormData>({
    resolver: zodResolver(sellerProfileSchema) as Resolver<SellerProfileFormData>,
    defaultValues: initialData
      ? {
          tagline: initialData.tagline,
          bio: initialData.bio,
          skills: initialData.skills.join(', '),
          languages: initialData.languages
            .map((l) => `${l.language} (${l.level})`)
            .join(', '),
          hourlyRate: initialData.hourlyRate,
          country: initialData.country,
          github: initialData.github ?? '',
          linkedin: initialData.linkedin ?? '',
          fiverr: initialData.fiverr ?? '',
        }
      : undefined,
  })

  const onSubmit = async (data: SellerProfileFormData) => {
    if (!user) {
      toast.error('You must be logged in to update your profile.')
      return
    }

    setIsSubmitting(true)

    try {
      const skills = data.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const languages = data.languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const match = l.match(/^(.+?)\s*\((.+?)\)$/)
          if (match) {
            return { language: match[1].trim(), level: match[2].trim() }
          }
          return { language: l, level: 'conversational' }
        })

      const profileData: Partial<SellerProfile> = {
        tagline: data.tagline,
        bio: data.bio,
        skills,
        languages,
        hourlyRate: data.hourlyRate,
        country: data.country,
        available,
        ...(data.github ? { github: data.github } : {}),
        ...(data.linkedin ? { linkedin: data.linkedin } : {}),
        ...(data.fiverr ? { fiverr: data.fiverr } : {}),
      }

      await updateUserDoc(user.uid, {
        sellerProfile: {
          ...(user.sellerProfile ?? {}),
          ...profileData,
        },
      })

      // Update local store
      setUser({
        ...user,
        sellerProfile: {
          ...(user.sellerProfile as SellerProfile),
          ...profileData,
        } as SellerProfile,
      })

      toast.success('Profile updated successfully!')
    } catch (err) {
      console.error('Failed to update profile:', err)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tagline */}
      <div>
        <label
          htmlFor="tagline"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          Tagline *
        </label>
        <input
          id="tagline"
          type="text"
          placeholder="e.g. Full-Stack Developer specializing in AI solutions"
          className={cn(inputClass, errors.tagline && 'border-red-500')}
          {...register('tagline')}
        />
        {errors.tagline && (
          <p className="mt-1 text-xs text-red-500">{errors.tagline.message}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          Bio *
        </label>
        <textarea
          id="bio"
          rows={5}
          placeholder="Tell clients about your experience, expertise, and what makes you unique..."
          className={cn(
            inputClass,
            'resize-none',
            errors.bio && 'border-red-500'
          )}
          {...register('bio')}
        />
        {errors.bio && (
          <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
        )}
      </div>

      {/* Skills & Languages */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="skills"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Skills *{' '}
            <span className="text-text-tertiary">(comma-separated)</span>
          </label>
          <input
            id="skills"
            type="text"
            placeholder="e.g. React, TypeScript, Node.js, Python"
            className={cn(inputClass, errors.skills && 'border-red-500')}
            {...register('skills')}
          />
          {errors.skills && (
            <p className="mt-1 text-xs text-red-500">
              {errors.skills.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="languages"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Languages *{' '}
            <span className="text-text-tertiary">(comma-separated)</span>
          </label>
          <input
            id="languages"
            type="text"
            placeholder="e.g. English (fluent), Spanish (conversational)"
            className={cn(inputClass, errors.languages && 'border-red-500')}
            {...register('languages')}
          />
          {errors.languages && (
            <p className="mt-1 text-xs text-red-500">
              {errors.languages.message}
            </p>
          )}
        </div>
      </div>

      {/* Hourly Rate & Country */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="hourlyRate"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Hourly Rate (USD) *
          </label>
          <input
            id="hourlyRate"
            type="number"
            min={5}
            max={1000}
            placeholder="25"
            className={cn(inputClass, errors.hourlyRate && 'border-red-500')}
            {...register('hourlyRate')}
          />
          {errors.hourlyRate && (
            <p className="mt-1 text-xs text-red-500">
              {errors.hourlyRate.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Country *
          </label>
          <input
            id="country"
            type="text"
            placeholder="e.g. United States"
            className={cn(inputClass, errors.country && 'border-red-500')}
            {...register('country')}
          />
          {errors.country && (
            <p className="mt-1 text-xs text-red-500">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label
            htmlFor="github"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            GitHub <span className="text-text-tertiary">(optional)</span>
          </label>
          <input
            id="github"
            type="url"
            placeholder="https://github.com/username"
            className={cn(inputClass, errors.github && 'border-red-500')}
            {...register('github')}
          />
          {errors.github && (
            <p className="mt-1 text-xs text-red-500">
              {errors.github.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="linkedin"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            LinkedIn <span className="text-text-tertiary">(optional)</span>
          </label>
          <input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/username"
            className={cn(inputClass, errors.linkedin && 'border-red-500')}
            {...register('linkedin')}
          />
          {errors.linkedin && (
            <p className="mt-1 text-xs text-red-500">
              {errors.linkedin.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="fiverr"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Fiverr <span className="text-text-tertiary">(optional)</span>
          </label>
          <input
            id="fiverr"
            type="url"
            placeholder="https://fiverr.com/username"
            className={cn(inputClass, errors.fiverr && 'border-red-500')}
            {...register('fiverr')}
          />
          {errors.fiverr && (
            <p className="mt-1 text-xs text-red-500">
              {errors.fiverr.message}
            </p>
          )}
        </div>
      </div>

      {/* Available Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={available}
          onClick={() => setAvailable((prev) => !prev)}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
            available ? 'bg-orange' : 'bg-border'
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
              available ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
        <label className="text-sm font-medium text-text-primary">
          Available for work
        </label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : initialData ? (
          'Update Profile'
        ) : (
          'Create Profile'
        )}
      </Button>
    </form>
  )
}
