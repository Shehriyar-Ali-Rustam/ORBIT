'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { contactSchema } from '@/lib/validations'
import { BUDGET_LABELS, SERVICE_LABELS } from '@/data/orbie-contact'
import { CARD } from '@/data/landing'
import { useConversationalContact } from '../contact/useConversationalContact'
import { EASE } from '@/components/motion/motion-config'


/** Read off the schema, so an invalid value cannot be offered in the first place. */
const SERVICE_OPTIONS = contactSchema.shape.service.options
const BUDGET_OPTIONS = contactSchema.shape.budget.options

/**
 * The brief, one question at a time.
 *
 * Two things keep this from being a slower form:
 *
 * `service` and `budget` render as chips because they are `z.enum`s — one tap,
 * always valid, and nobody types a budget range. Only three fields are ever
 * actually typed.
 *
 * And the way out is always visible. A link to the full form at `/contact`
 * sits under every step, and every failure surfaces WhatsApp, because a brief
 * that vanishes into an error is worse than no form at all.
 */
export function ContactView({ onDone }: { onDone?: () => void }) {
  const reduce = useReducedMotion()
  const c = useConversationalContact()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isChips = c.step === 'service' || c.step === 'budget'
  const isLong = c.step === 'message'

  // Clear the field between questions, and put the cursor where it belongs.
  useEffect(() => {
    setValue('')
    if (!isChips) inputRef.current?.focus()
  }, [c.step, isChips])

  useEffect(() => {
    if (c.status === 'sent') onDone?.()
  }, [c.status, onDone])

  if (c.status === 'sent' || c.status === 'sending' || c.status === 'error') {
    return (
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      >
        <p className="font-grotesk text-lg font-medium text-orbit-ink">{c.outcome}</p>

        {c.status === 'error' && (
          <div className="flex flex-wrap justify-center gap-3">
            <a href={CARD.whatsappHref} className="btn-primary" target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>
            <a href={CARD.emailHref} className="btn-ghost">
              Email instead
            </a>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      {/* Which question, out of how many. A conversation with no visible end
          is the main way this shape annoys people. */}
      <div className="flex gap-1.5">
        {Array.from({ length: c.stepCount }).map((_, i) => (
          <span
            key={i}
            className={`h-[3px] w-6 ${i <= c.stepIndex ? 'bg-orbit-accInk' : 'bg-orbit-ink/15'}`}
          />
        ))}
      </div>

      <motion.p
        key={c.prompt}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className={`text-balance text-center font-grotesk text-lg font-medium md:text-xl ${
          c.error ? 'text-orbit-accInk' : 'text-orbit-ink'
        }`}
      >
        {c.prompt}
      </motion.p>

      {isChips ? (
        <div className="flex flex-wrap justify-center gap-2">
          {(c.step === 'service' ? SERVICE_OPTIONS : BUDGET_OPTIONS).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => c.submit(opt)}
              className="border border-orbit-ink/20 px-3.5 py-2 font-spacemono text-[10px] uppercase tracking-[0.14em] text-orbit-ink/70 transition-colors hover:border-orbit-accInk/60 hover:text-orbit-accInk"
            >
              {c.step === 'service'
                ? SERVICE_LABELS[opt as keyof typeof SERVICE_LABELS]
                : BUDGET_LABELS[opt as keyof typeof BUDGET_LABELS]}
            </button>
          ))}
        </div>
      ) : (
        <form
          className="flex w-full flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            c.submit(value)
          }}
        >
          <label htmlFor="orbie-field" className="sr-only">
            {c.prompt}
          </label>
          <div className="flex items-center gap-2 border border-orbit-ink/20 px-4 py-3 focus-within:border-orbit-accInk/60">
            <input
              id="orbie-field"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={c.hint}
              type={c.step === 'email' ? 'email' : 'text'}
              inputMode={c.step === 'email' ? 'email' : 'text'}
              autoComplete={c.step === 'email' ? 'email' : c.step === 'name' ? 'name' : 'off'}
              aria-invalid={Boolean(c.error)}
              aria-describedby={c.error ? 'orbie-field-error' : undefined}
              className="w-full bg-transparent font-grotesk text-base text-orbit-ink outline-none placeholder:text-orbit-ink/35"
            />
            <button
              type="submit"
              disabled={!value.trim()}
              aria-label="Continue"
              className="shrink-0 text-orbit-ink/45 transition-colors hover:text-orbit-accInk disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
          {c.error && (
            <span id="orbie-field-error" className="sr-only">
              {c.error}
            </span>
          )}
          {isLong && (
            <span className="font-spacemono text-[9px] uppercase tracking-[0.14em] text-orbit-ink/40">
              A sentence or two
            </span>
          )}
        </form>
      )}

      <div className="flex items-center gap-4">
        {c.stepIndex > 0 && (
          <button
            type="button"
            onClick={c.back}
            className="inline-flex items-center gap-1.5 font-spacemono text-[10px] uppercase tracking-[0.16em] text-orbit-ink/45 transition-colors hover:text-orbit-accInk"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
            Back
          </button>
        )}
        {/* Always available. A guided brief should never be the only way in. */}
        <Link
          href="/contact"
          className="font-spacemono text-[10px] uppercase tracking-[0.16em] text-orbit-ink/45 underline-offset-4 transition-colors hover:text-orbit-accInk hover:underline"
        >
          Use the full form
        </Link>
      </div>
    </div>
  )
}
