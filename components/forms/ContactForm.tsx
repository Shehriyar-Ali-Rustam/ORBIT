'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, ContactFormData } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const serviceOptions = [
  { value: 'ai-chatbot', label: 'AI Chatbot Development' },
  { value: 'model-training', label: 'AI Model Training' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile App Development' },
  { value: 'graphic-design', label: 'Graphic Design & Branding' },
  { value: 'freelancer', label: 'Hire a Freelancer' },
  { value: 'other', label: 'Other' },
]

const budgetOptions = [
  { value: 'under-500', label: 'Under $500' },
  { value: '500-2000', label: '$500 - $2,000' },
  { value: '2000-10000', label: '$2,000 - $10,000' },
  { value: '10000-plus', label: '$10,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
]

const inputClass = 'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
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
        <h3 className="text-xl font-semibold text-green-500">Message Sent!</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-orange transition-colors hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-primary">
            Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className={cn(inputClass, errors.name && 'border-red-500')}
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary">
            Email *
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            className={cn(inputClass, errors.email && 'border-red-500')}
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-text-primary">
          Phone <span className="text-text-tertiary">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          className={inputClass}
          {...register('phone')}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className="mb-2 block text-sm font-medium text-text-primary">
            Service *
          </label>
          <select
            id="service"
            className={cn(inputClass, errors.service && 'border-red-500')}
            {...register('service')}
          >
            <option value="">Select a service</option>
            {serviceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service.message}</p>}
        </div>

        <div>
          <label htmlFor="budget" className="mb-2 block text-sm font-medium text-text-primary">
            Budget *
          </label>
          <select
            id="budget"
            className={cn(inputClass, errors.budget && 'border-red-500')}
            {...register('budget')}
          >
            <option value="">Select budget range</option>
            {budgetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-primary">
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell us about your project..."
          className={cn(inputClass, 'resize-none', errors.message && 'border-red-500')}
          {...register('message')}
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={status === 'loading'} className="w-full">
        Send Message &rarr;
      </Button>
    </form>
  )
}
