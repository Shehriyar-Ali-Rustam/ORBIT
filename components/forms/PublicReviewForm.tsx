'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, Star, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

const PROJECT_OPTIONS = [
  { value: 'ai-chatbot',     label: 'AI Chatbot' },
  { value: 'model-training', label: 'Model Training' },
  { value: 'web',            label: 'Web Development' },
  { value: 'mobile',         label: 'Mobile App' },
  { value: 'design',         label: 'Design & Branding' },
  { value: 'other',          label: 'Something Else' },
] as const

type ProjectType = (typeof PROJECT_OPTIONS)[number]['value']

const inputBase =
  'w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-text-primary ' +
  'placeholder:text-text-tertiary transition-all duration-200 outline-none ' +
  'border-[var(--color-card-border)] ' +
  'focus:border-accent focus:ring-2 focus:ring-accent/15'

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <span className="mb-2 block text-[0.78rem] font-medium text-text-secondary">
      {children}
      {optional && <span className="ml-1.5 text-[0.7rem] text-text-tertiary">(optional)</span>}
    </span>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1.5 text-[0.72rem] text-red-500">{msg}</p>
}

export function PublicReviewForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [projectType, setProjectType] = useState<ProjectType | ''>('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)

  function validate() {
    const next: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) next.name = 'Please enter your name'
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Please enter a valid email'
    if (!rating) next.rating = 'Please pick a rating'
    if (comment.trim().length < 20) next.comment = 'Tell us a bit more (20+ characters)'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          role: role.trim() || undefined,
          project_type: projectType || undefined,
          rating,
          comment: comment.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setServerError(data?.error || 'Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setServerError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="rounded-2xl border border-accent/20 bg-accent/5 p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10"
            >
              <Sparkles className="h-8 w-8 text-accent" />
            </motion.div>
            <h3 className="text-2xl font-bold text-text-primary">
              Thank you, {name.split(' ')[0]}! ✨
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
              Your review just made our day. Means a lot that you took the time to share it.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
              Stars, words, and good vibes — received with love 💛
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Your name</Label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={inputBase}
                  autoComplete="name"
                />
                <FieldError msg={errors.name} />
              </div>
              <div>
                <Label optional>Email</Label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className={inputBase}
                  autoComplete="email"
                />
                <FieldError msg={errors.email} />
              </div>
            </div>

            <div>
              <Label optional>Role / Company</Label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="CTO at Acme Inc."
                className={inputBase}
              />
            </div>

            <div>
              <Label optional>What did we build for you?</Label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_OPTIONS.map((opt) => {
                  const active = projectType === opt.value
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setProjectType(active ? '' : opt.value)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150',
                        active
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-[var(--color-card-border)] text-text-secondary hover:border-accent/40 hover:text-text-primary'
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= (hoveredRating || rating)
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          'h-7 w-7 transition-colors duration-150',
                          filled ? 'fill-accent text-accent' : 'text-text-tertiary'
                        )}
                      />
                    </button>
                  )
                })}
                {rating > 0 && (
                  <span className="ml-2 font-mono text-xs text-text-tertiary">{rating}/5</span>
                )}
              </div>
              <FieldError msg={errors.rating} />
            </div>

            <div>
              <Label>Your review</Label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                maxLength={2000}
                placeholder="What did you hire us for? How did the team do? What stood out?"
                className={cn(inputBase, 'resize-none')}
              />
              <div className="mt-1.5 flex items-center justify-between">
                <FieldError msg={errors.comment} />
                <span className="ml-auto font-mono text-[0.7rem] text-text-tertiary">
                  {comment.length}/2000
                </span>
              </div>
            </div>

            {serverError && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-accent-glow transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  Submit Review
                  <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
