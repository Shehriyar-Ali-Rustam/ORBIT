import type { ContactFormData } from '@/lib/validations'

/**
 * What Orbie says while collecting a brief.
 *
 * This is script, not UI copy, and it lives here for the same reason the tour
 * narration lives in `orbie-graph.ts`: an error string hardcoded in a `catch`
 * block is a line of dialogue nobody can find to edit.
 *
 * The field order and the values are not defined here. They come from
 * `contactSchema` in `src/lib/validations.ts`, which is what the server
 * enforces — this file only supplies the words around them.
 */

/** The fields Orbie asks for, in order. `phone` is optional and skipped. */
export const CONTACT_STEPS = ['name', 'email', 'service', 'budget', 'message'] as const
export type ContactStep = (typeof CONTACT_STEPS)[number]

interface StepScript {
  /** What Orbie says when the step opens. */
  ask: string
  /** Placeholder or helper under the input. */
  hint?: string
  /**
   * What Orbie says when the value fails validation.
   *
   * Deliberately in character rather than the schema's own message. Zod says
   * "Message must be at least 20 characters", which is true and reads like a
   * form rejecting you. Orbie asks a follow-up question instead — which is the
   * one place a conversational brief is genuinely better than a form, not just
   * a slower version of one.
   */
  retry: string
}

export const CONTACT_SCRIPT: Record<ContactStep, StepScript> = {
  name: {
    ask: 'Lovely. What should I call you?',
    hint: 'First name is fine',
    retry: 'I need something to put on the message. Even just a first name.',
  },
  email: {
    ask: 'And where should the reply go?',
    hint: 'you@company.com',
    retry: 'That does not look like an address I can reach. Mind checking it?',
  },
  service: {
    ask: 'What kind of work is it?',
    retry: 'Pick whichever is closest. We can sort out the details on the call.',
  },
  budget: {
    ask: 'Roughly what budget are you working with?',
    hint: 'An honest range saves us both a call',
    retry: 'Any of these is fine, including not sure.',
  },
  message: {
    ask: 'Last one. What are you trying to build?',
    hint: 'Two lines is plenty',
    retry: 'Give me a bit more than that. What is it for, and roughly when do you need it?',
  },
}

/** Human labels for the enum values. The values themselves come from the schema. */
export const SERVICE_LABELS: Record<ContactFormData['service'], string> = {
  'ai-chatbot': 'AI chatbot',
  'model-training': 'Model training',
  'web-development': 'Web platform',
  'mobile-development': 'Mobile app',
  'graphic-design': 'Brand & design',
  freelancer: 'Hiring someone',
  other: 'Something else',
}

export const BUDGET_LABELS: Record<ContactFormData['budget'], string> = {
  'under-500': 'Under $500',
  '500-2000': '$500 to $2k',
  '2000-10000': '$2k to $10k',
  '10000-plus': '$10k and up',
  'not-sure': 'Not sure yet',
}

/**
 * Every way this can end, including the ways it fails.
 *
 * The failure lines matter more than the success one. A brief that vanishes
 * into a 500 is worse than no form at all, so each of these surfaces a way to
 * reach a human that does not depend on the thing that just broke.
 */
export const CONTACT_OUTCOMES = {
  sending: 'Sending that over.',
  sent: 'Got it. You will hear back within a working day.',
  /** 429 from the existing per-IP limiter, which allows three in ten minutes. */
  rateLimited:
    'That is a few messages in a short window. Give it ten minutes, or reach me on WhatsApp now.',
  /** 503 when EMAIL_USER / EMAIL_PASS are unset. */
  unavailable: 'My mail route is down. WhatsApp or email will reach the team directly.',
  failed: 'That did not send. WhatsApp is the fastest way through right now.',
} as const
