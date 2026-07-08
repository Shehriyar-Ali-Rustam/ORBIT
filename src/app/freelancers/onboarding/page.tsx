'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { upsertProfile } from '@/lib/marketplace/mutations'
import { cn } from '@/lib/utils'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const STEPS = ['Personal Info', 'Professional', 'About You', 'Confirm']

export default function SellerOnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    tagline: '',
    bio: '',
    skills: '',
    languages: 'English',
    hourly_rate: '',
    response_time: 'Within a few hours',
    country: '',
    portfolio_urls: '',
    github: '',
    linkedin: '',
  })

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!user) return
    setLoading(true)
    setError('')

    try {
      const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean)
      const languages = form.languages.split(',').map((l) => ({
        language: l.trim(),
        level: 'Fluent',
      })).filter((l) => l.language)
      const portfolioUrls = form.portfolio_urls.split('\n').map((u) => u.trim()).filter(Boolean)

      await upsertProfile({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        display_name: user.fullName || 'User',
        photo_url: user.imageUrl || null,
        role: 'seller',
        tagline: form.tagline,
        bio: form.bio,
        skills,
        languages,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
        response_time: form.response_time,
        country: form.country,
        portfolio_urls: portfolioUrls,
        github: form.github || null,
        linkedin: form.linkedin || null,
      })

      router.push('/freelancers/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:py-20">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  i < step
                    ? 'bg-orange text-white'
                    : i === step
                    ? 'border-2 border-orange text-orange'
                    : 'border border-border text-text-tertiary'
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden text-sm text-text-secondary sm:inline">{s}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1 rounded-full bg-border">
          <div
            className="h-full rounded-full bg-orange transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease }}
        >
          {/* Step 1: Personal Info */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary">Personal Info</h2>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Professional Tagline
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="e.g., Expert React Developer | AI Specialist"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Country
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  placeholder="e.g., Pakistan"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Step 2: Professional */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary">Professional Details</h2>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  placeholder="React, Next.js, Python, AI/ML"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Languages (comma separated)
                </label>
                <input
                  type="text"
                  value={form.languages}
                  onChange={(e) => updateField('languages', e.target.value)}
                  placeholder="English, Urdu"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={form.hourly_rate}
                    onChange={(e) => updateField('hourly_rate', e.target.value)}
                    placeholder="25"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Response Time
                  </label>
                  <select
                    value={form.response_time}
                    onChange={(e) => updateField('response_time', e.target.value)}
                    className={inputClass}
                  >
                    <option value="Within 1 hour">Within 1 hour</option>
                    <option value="Within a few hours">Within a few hours</option>
                    <option value="Within 1 day">Within 1 day</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: About You */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary">About You</h2>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Tell buyers about your experience, expertise, and what makes you unique..."
                  rows={5}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-text-tertiary">
                  {form.bio.length}/600 characters
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Portfolio URLs (one per line)
                </label>
                <textarea
                  value={form.portfolio_urls}
                  onChange={(e) => updateField('portfolio_urls', e.target.value)}
                  placeholder="https://myproject1.com&#10;https://myproject2.com"
                  rows={3}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={form.github}
                    onChange={(e) => updateField('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={form.linkedin}
                    onChange={(e) => updateField('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary">Review & Publish</h2>
              <div className="rounded-xl border border-border bg-surface p-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-text-tertiary">Name</span>
                    <p className="text-sm font-medium text-text-primary">{user?.fullName || 'User'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-text-tertiary">Tagline</span>
                    <p className="text-sm text-text-primary">{form.tagline || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-text-tertiary">Skills</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {form.skills.split(',').filter(Boolean).map((s) => (
                        <span key={s} className="rounded-full bg-orange-dim px-2 py-0.5 text-xs text-orange">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-text-tertiary">Country</span>
                    <p className="text-sm text-text-primary">{form.country || '—'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-text-tertiary">Bio</span>
                    <p className="text-sm text-text-primary">{form.bio || '—'}</p>
                  </div>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <Button
            variant="primary"
            onClick={() => setStep((s) => s + 1)}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Publish Profile
          </Button>
        )}
      </div>
    </div>
  )
}
