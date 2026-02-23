'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { freelancerApplySchema, FreelancerApplyData } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const experienceOptions = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-plus', label: '5+ years' },
]

const inputClass = 'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

export function FreelancerApplyForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FreelancerApplyData>({
    resolver: zodResolver(freelancerApplySchema),
  })

  const onSubmit = async (data: FreelancerApplyData) => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/freelancer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setErrorMessage(result.error || 'Something went wrong.')
        setStatus('error')
        return
      }

      setStatus('success')
      reset()
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
        <h3 className="text-xl font-semibold text-green-500">Application Submitted!</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Thank you for your interest. We&apos;ll review your application within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-primary">Name *</label>
          <input id="name" type="text" placeholder="Your full name" className={cn(inputClass, errors.name && 'border-red-500')} {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary">Email *</label>
          <input id="email" type="email" placeholder="you@example.com" className={cn(inputClass, errors.email && 'border-red-500')} {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className="mb-2 block text-sm font-medium text-text-primary">Role *</label>
          <input id="role" type="text" placeholder="e.g. React Developer" className={cn(inputClass, errors.role && 'border-red-500')} {...register('role')} />
          {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
        </div>
        <div>
          <label htmlFor="experience" className="mb-2 block text-sm font-medium text-text-primary">Experience *</label>
          <select id="experience" className={cn(inputClass, errors.experience && 'border-red-500')} {...register('experience')}>
            <option value="">Select experience</option>
            {experienceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="skills" className="mb-2 block text-sm font-medium text-text-primary">Skills *</label>
        <input id="skills" type="text" placeholder="e.g. React, TypeScript, Node.js" className={cn(inputClass, errors.skills && 'border-red-500')} {...register('skills')} />
        {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="portfolioUrl" className="mb-2 block text-sm font-medium text-text-primary">Portfolio URL *</label>
          <input id="portfolioUrl" type="url" placeholder="https://yourportfolio.com" className={cn(inputClass, errors.portfolioUrl && 'border-red-500')} {...register('portfolioUrl')} />
          {errors.portfolioUrl && <p className="mt-1 text-xs text-red-500">{errors.portfolioUrl.message}</p>}
        </div>
        <div>
          <label htmlFor="hourlyRate" className="mb-2 block text-sm font-medium text-text-primary">Hourly Rate *</label>
          <input id="hourlyRate" type="text" placeholder="e.g. $25/hr" className={cn(inputClass, errors.hourlyRate && 'border-red-500')} {...register('hourlyRate')} />
          {errors.hourlyRate && <p className="mt-1 text-xs text-red-500">{errors.hourlyRate.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="githubUrl" className="mb-2 block text-sm font-medium text-text-primary">GitHub <span className="text-text-tertiary">(optional)</span></label>
          <input id="githubUrl" type="url" placeholder="https://github.com/..." className={inputClass} {...register('githubUrl')} />
        </div>
        <div>
          <label htmlFor="linkedinUrl" className="mb-2 block text-sm font-medium text-text-primary">LinkedIn <span className="text-text-tertiary">(optional)</span></label>
          <input id="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." className={inputClass} {...register('linkedinUrl')} />
        </div>
        <div>
          <label htmlFor="fiverrUrl" className="mb-2 block text-sm font-medium text-text-primary">Fiverr <span className="text-text-tertiary">(optional)</span></label>
          <input id="fiverrUrl" type="url" placeholder="https://fiverr.com/..." className={inputClass} {...register('fiverrUrl')} />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="mb-2 block text-sm font-medium text-text-primary">Bio *</label>
        <textarea id="bio" rows={4} placeholder="Tell us about yourself and your expertise (50-300 characters)" className={cn(inputClass, 'resize-none', errors.bio && 'border-red-500')} {...register('bio')} />
        {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
      </div>

      <div>
        <label htmlFor="hearAbout" className="mb-2 block text-sm font-medium text-text-primary">How did you hear about us? <span className="text-text-tertiary">(optional)</span></label>
        <input id="hearAbout" type="text" placeholder="e.g. LinkedIn, friend referral" className={inputClass} {...register('hearAbout')} />
      </div>

      {status === 'error' && <p className="text-sm text-red-500">{errorMessage}</p>}

      <Button type="submit" variant="primary" size="lg" loading={status === 'loading'} className="w-full">
        Submit Application &rarr;
      </Button>
    </form>
  )
}
