'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { track } from '@vercel/analytics'
import { CARD } from '@/data/landing'
import { EASE } from '@/components/motion/motion-config'


interface Turn {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Ask Orbie anything.
 *
 * Renders as plain text, deliberately. The API is told to answer in plain
 * sentences and this view has no markdown renderer, which keeps
 * `react-markdown` and `rehype-highlight` out of `/`'s bundle entirely — they
 * are ~60 kB that the page printed on the business card has no reason to carry
 * for a two-sentence answer.
 *
 * The failure path matters as much as the happy one. Chat depends on a model
 * provider, a rate limiter and a network, so every way it can fail ends with a
 * way to reach a human that does not depend on any of them.
 */
export function ChatView({ onClose }: { onClose(): void }) {
  const reduce = useReducedMotion()
  const [turns, setTurns] = useState<Turn[]>([])
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => inputRef.current?.focus(), [])
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [turns])

  const send = useCallback(async () => {
    const text = value.trim()
    if (!text || busy) return

    setValue('')
    setFailed(null)
    setBusy(true)
    track('orbie_chat_ask')

    const next: Turn[] = [...turns, { role: 'user', content: text }]
    setTurns(next)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'orbie', messages: next }),
      })

      if (!res.ok) {
        // 503 is the flag or a missing limiter; 429 is the per-IP cap. Both are
        // worth naming, because "something went wrong" invites a retry into
        // the same wall.
        const data = await res.json().catch(() => ({}))
        setFailed(
          res.status === 429
            ? 'That is a lot of questions in a short window. Give it a moment, or message us directly.'
            : (data.error ?? 'I cannot reach my brain right now.')
        )
        setBusy(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('no stream')
      const decoder = new TextDecoder()

      setTurns((t) => [...t, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value: chunk } = await reader.read()
        if (done) break
        const piece = decoder.decode(chunk, { stream: true })
        setTurns((t) => {
          const copy = [...t]
          copy[copy.length - 1] = {
            role: 'assistant',
            content: copy[copy.length - 1].content + piece,
          }
          return copy
        })
      }
    } catch {
      setFailed('I cannot reach my brain right now.')
    } finally {
      setBusy(false)
    }
  }, [value, busy, turns])

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex w-full max-w-lg flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <p className="eyebrow accent-rule">Ask Orbie</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat and continue the tour"
          className="flex h-9 w-9 items-center justify-center text-orbit-ink/50 transition-colors hover:text-orbit-accInk"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="flex max-h-[38vh] flex-col gap-3 overflow-y-auto">
        {turns.length === 0 && !failed && (
          <p className="text-sm leading-relaxed text-orbit-ink/55">
            Ask about what we build, how a project runs, or what something costs.
          </p>
        )}

        {turns.map((turn, i) => (
          <p
            key={i}
            className={
              turn.role === 'user'
                ? 'self-end border border-orbit-ink/15 px-3.5 py-2 text-sm text-orbit-ink/80'
                : 'text-[0.9375rem] leading-relaxed text-orbit-ink'
            }
          >
            {turn.content}
            {/* A caret while the answer streams, so a pause reads as thinking
                rather than as nothing happening. */}
            {turn.role === 'assistant' && busy && i === turns.length - 1 && (
              <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-orbit-accInk" />
            )}
          </p>
        ))}

        {failed && (
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed text-orbit-accInk">{failed}</p>
            <div className="flex flex-wrap gap-2">
              <a href={CARD.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                WhatsApp us
              </a>
              <a href={CARD.emailHref} className="btn-ghost">
                Email us
              </a>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <form
        className="flex items-center gap-2 border border-orbit-ink/20 px-4 py-3 focus-within:border-orbit-accInk/60"
        onSubmit={(e) => {
          e.preventDefault()
          void send()
        }}
      >
        <label htmlFor="orbie-chat" className="sr-only">
          Ask Orbie a question
        </label>
        <input
          id="orbie-chat"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask me anything"
          disabled={busy}
          className="w-full bg-transparent font-grotesk text-base text-orbit-ink outline-none placeholder:text-orbit-ink/35 disabled:opacity-50"
        />
        {/* Disabled while streaming: no queueing a second question on top of an
            answer that is still arriving, and no accidental double spend. */}
        <button
          type="submit"
          disabled={busy || !value.trim()}
          aria-label="Send"
          className="shrink-0 text-orbit-ink/45 transition-colors hover:text-orbit-accInk disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </form>
    </motion.div>
  )
}
