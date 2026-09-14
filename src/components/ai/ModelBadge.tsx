import { MODEL_LABEL } from '@/lib/ai/model'

/**
 * Names the model answering in this composer.
 *
 * This took a `provider` prop and mapped it over four vendors. It was wrong on
 * every render: nothing ever put a `provider` field in either AI route's
 * response, so `data.provider || 'groq'` always fell through to the literal,
 * and the badge read "Llama 3.3 · Groq" while Anthropic served every reply.
 *
 * The label now comes from the module that makes the call, so it cannot drift
 * from the model again.
 */
export function ModelBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-text-secondary">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
      {MODEL_LABEL}
    </span>
  )
}
