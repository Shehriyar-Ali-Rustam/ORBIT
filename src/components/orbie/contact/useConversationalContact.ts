'use client'

import { useCallback, useMemo, useState } from 'react'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import {
  CONTACT_OUTCOMES,
  CONTACT_SCRIPT,
  CONTACT_STEPS,
  type ContactStep,
} from '@/data/orbie-contact'

type Status = 'asking' | 'sending' | 'sent' | 'error'

export interface ConversationalContact {
  step: ContactStep
  stepIndex: number
  stepCount: number
  /** The current field's script line, or the retry line after a bad value. */
  prompt: string
  hint?: string
  error: string | null
  status: Status
  /** Set when the submit failed, so the view can offer WhatsApp instead. */
  outcome: string | null
  answers: Partial<ContactFormData>
  submit(value: string): void
  back(): void
  reset(): void
}

/**
 * A brief, collected one question at a time.
 *
 * The thing that makes this safe rather than a second, looser front door is
 * that it validates with the server's own schema, field by field:
 *
 *     contactSchema.shape[step].safeParse(value)
 *
 * Not a copy of the rules, not a relaxed version for conversation — the exact
 * validator `POST /api/contact` enforces. Drift between the two is impossible
 * by construction, and `service` and `budget` being `z.enum`s means their
 * options are read off the schema too, so nobody can type an invalid budget.
 *
 * The failure path is the part worth caring about. A brief that disappears
 * into an error is worse than no form, so every outcome surfaces a way to
 * reach a human that does not depend on the thing that just broke.
 */
export function useConversationalContact(): ConversationalContact {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<ContactFormData>>({})
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('asking')
  const [outcome, setOutcome] = useState<string | null>(null)

  const step = CONTACT_STEPS[Math.min(stepIndex, CONTACT_STEPS.length - 1)]
  const script = CONTACT_SCRIPT[step]

  const send = useCallback(async (payload: Partial<ContactFormData>) => {
    // The whole object, through the same schema the route runs. If this fails
    // something upstream let a bad value through, and sending anyway would
    // just move the failure to the server.
    const parsed = contactSchema.safeParse(payload)
    if (!parsed.success) {
      setStatus('error')
      setOutcome(CONTACT_OUTCOMES.failed)
      return
    }

    setStatus('sending')
    setOutcome(CONTACT_OUTCOMES.sending)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (res.ok) {
        setStatus('sent')
        setOutcome(CONTACT_OUTCOMES.sent)
        return
      }

      setStatus('error')
      // 429 is the existing per-IP limiter (three in ten minutes); 503 is the
      // route telling us email is not configured. Both are worth naming,
      // because "something went wrong" makes a visitor retry into the same wall.
      if (res.status === 429) setOutcome(CONTACT_OUTCOMES.rateLimited)
      else if (res.status === 503) setOutcome(CONTACT_OUTCOMES.unavailable)
      else setOutcome(CONTACT_OUTCOMES.failed)
    } catch {
      setStatus('error')
      setOutcome(CONTACT_OUTCOMES.failed)
    }
  }, [])

  const submit = useCallback(
    (value: string) => {
      const field = contactSchema.shape[step]
      const result = field.safeParse(value.trim())

      if (!result.success) {
        // Orbie's line, not Zod's. "Message must be at least 20 characters" is
        // accurate and reads like a form rejecting you.
        setError(script.retry)
        return
      }

      setError(null)
      const next = { ...answers, [step]: result.data }
      setAnswers(next)

      if (stepIndex >= CONTACT_STEPS.length - 1) {
        void send(next)
        return
      }
      setStepIndex((i) => i + 1)
    },
    [step, script.retry, answers, stepIndex, send]
  )

  const back = useCallback(() => {
    setError(null)
    setStepIndex((i) => Math.max(0, i - 1))
  }, [])

  const reset = useCallback(() => {
    setStepIndex(0)
    setAnswers({})
    setError(null)
    setStatus('asking')
    setOutcome(null)
  }, [])

  const prompt = useMemo(() => error ?? script.ask, [error, script.ask])

  return {
    step,
    stepIndex,
    stepCount: CONTACT_STEPS.length,
    prompt,
    hint: script.hint,
    error,
    status,
    outcome,
    answers,
    submit,
    back,
    reset,
  }
}
