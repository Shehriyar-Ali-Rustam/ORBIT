'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { contactSchema, ContactFormData } from '@/lib/validations'
import { cn } from '@/lib/utils'

const serviceOptions = [
  { value: 'ai-chatbot',         label: 'AI Chatbot' },
  { value: 'model-training',     label: 'Model Training' },
  { value: 'web-development',    label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile App' },
  { value: 'graphic-design',     label: 'Design & Branding' },
  { value: 'freelancer',         label: 'Hire a Freelancer' },
  { value: 'other',              label: 'Something Else' },
]

const budgetOptions = [
  { value: 'under-500',   label: 'Under $500' },
  { value: '500-2000',    label: '$500 – $2k' },
  { value: '2000-10000',  label: '$2k – $10k' },
  { value: '10000-plus',  label: '$10k+' },
  { value: 'not-sure',    label: 'Not sure yet' },
]

// ── Shared field styles ──────────────────────────────────────────────────
const inputBase =
  'w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-text-primary ' +
  'placeholder:text-text-tertiary transition-all duration-200 outline-none ' +
  'border-[var(--color-card-border)] ' +
  'focus:border-accent focus:ring-2 focus:ring-accent/15'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[0.78rem] font-medium text-text-secondary">
      {children}
    </span>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1.5 text-[0.72rem] text-red-500">{msg}</p>
}

// ── Pill selector ─────────────────────────────────────────────────────────
function PillGroup({
  options,
  value,
  onChange,
  cols = 2,
  error,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  cols?: number
  error?: string
}) {
  return (
    <div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(active ? '' : opt.value)}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'border-accent/40 bg-accent/12 text-accent'
                  : 'border-[var(--color-card-border)] bg-[var(--color-surface)] text-text-secondary hover:border-accent/25 hover:text-text-primary'
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      <FieldError msg={error} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export function ContactForm() {
  const [status,       setStatus]       = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [service,      setService]      = useState('')
  const [budget,       setBudget]       = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const res    = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        setErrorMessage(result.error || 'Something went wrong.')
        setStatus('error')
        return
      }
      setStatus('success')
      reset()
      setService('')
      setBudget('')
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  // ── Success state ──
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-8 py-16 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-7 w-7 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary">Message sent!</h3>
        <p className="max-w-xs text-sm text-text-secondary">
          Thanks for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs font-medium text-accent transition-colors hover:text-accent/70"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)]"
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #FF751F 40%, #FF9A5C 60%, transparent)' }}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-7 lg:p-8">

        {/* ── Name + Email ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className={cn(inputBase, errors.name && 'border-red-500/60 focus:border-red-500')}
              {...register('name')}
            />
            <FieldError msg={errors.name?.message} />
          </div>
          <div>
            <Label>Email</Label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className={cn(inputBase, errors.email && 'border-red-500/60 focus:border-red-500')}
              {...register('email')}
            />
            <FieldError msg={errors.email?.message} />
          </div>
        </div>

        {/* ── Phone ── */}
        <div>
          <Label>
            Phone <span className="text-text-tertiary font-normal">— optional</span>
          </Label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 234 567 8900"
            className={inputBase}
            {...register('phone')}
          />
        </div>

        {/* ── Service selector (pill grid) ── */}
        <div>
          <Label>Service</Label>
          <PillGroup
            options={serviceOptions}
            value={service}
            onChange={(v) => {
              setService(v)
              setValue('service', v as ContactFormData['service'], { shouldValidate: true })
            }}
            cols={2}
            error={errors.service?.message}
          />
        </div>

        {/* ── Budget selector (pill grid) ── */}
        <div>
          <Label>Budget</Label>
          <PillGroup
            options={budgetOptions}
            value={budget}
            onChange={(v) => {
              setBudget(v)
              setValue('budget', v as ContactFormData['budget'], { shouldValidate: true })
            }}
            cols={3}
            error={errors.budget?.message}
          />
        </div>

        {/* ── Message ── */}
        <div>
          <Label>Message</Label>
          <textarea
            id="message"
            rows={4}
            placeholder="Tell us about your project…"
            className={cn(inputBase, 'resize-none', errors.message && 'border-red-500/60 focus:border-red-500')}
            {...register('message')}
          />
          <FieldError msg={errors.message?.message} />
        </div>

        {/* ── Error banner ── */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-500"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-60"
          style={{
            background: status === 'loading'
              ? 'var(--color-surface)'
              : 'linear-gradient(135deg, #FF751F 0%, #FF4D00 100%)',
            boxShadow: status === 'loading' ? 'none' : '0 4px 24px rgba(255,117,31,0.30)',
            color: status === 'loading' ? 'var(--color-text-secondary)' : '#fff',
          }}
        >
          {status === 'loading' ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
          ) : (
            <><Send className="h-4 w-4" /> Send Message</>
          )}
        </button>

      </form>
    </motion.div>
  )
}
