'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Send } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { GlowDot } from '@/components/ui/GlowDot'
import { LineReveal } from '@/components/ui/LineReveal'
import { useParallax } from '@/hooks/useParallax'

const features = [
  'Custom ChatGPT-powered chatbots',
  'Voice-activated AI assistants',
  'Model fine-tuning on custom datasets',
  'RAG (Retrieval-Augmented Generation) systems',
  'AI integration into existing products',
]

// Each step: delay from previous step in ms
const SCRIPT = [
  { role: 'user',  text: 'Can you help me train a custom AI model?', typingMs: 900 },
  { role: 'ai',    text: 'Absolutely! We specialize in fine-tuning language models on your custom dataset. What industry are you in?', typingMs: 1600 },
  { role: 'user',  text: 'E-commerce', typingMs: 700 },
  { role: 'ai',    text: 'Perfect. We can train a model on your product catalog and customer data to power intelligent recommendations and support.', typingMs: 1800 },
] as const

type Message = { role: 'user' | 'ai'; text: string }

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl bg-surface-2 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-text-tertiary"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [showTyping, setShowTyping] = useState(false)
  const [inputText, setInputText] = useState('')
  const [phase, setPhase] = useState<'idle' | 'running'>('idle')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, showTyping])

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    function delay(ms: number) {
      return new Promise<void>((resolve) => {
        const t = setTimeout(() => { if (!cancelled) resolve() }, ms)
        timers.push(t)
      })
    }

    async function run() {
      setMessages([])
      setShowTyping(false)
      setInputText('')
      setPhase('running')

      await delay(600)

      for (const step of SCRIPT) {
        if (cancelled) return

        if (step.role === 'user') {
          // Simulate typing in the input bar
          const fullText = step.text
          for (let i = 1; i <= fullText.length; i++) {
            if (cancelled) return
            setInputText(fullText.slice(0, i))
            await delay(40)
          }
          await delay(200)
          setInputText('')
          setMessages((prev) => [...prev, { role: 'user', text: step.text }])
          await delay(400)
        } else {
          // AI typing indicator
          setShowTyping(true)
          await delay(step.typingMs)
          if (cancelled) return
          setShowTyping(false)
          setMessages((prev) => [...prev, { role: 'ai', text: step.text }])
          await delay(600)
        }
      }

      // Pause at end, then restart
      await delay(3000)
      if (!cancelled) {
        setMessages([])
        setPhase('idle')
        const restart = setTimeout(() => { if (!cancelled) run() }, 400)
        timers.push(restart)
      }
    }

    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-card-border)] px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand">
          <span className="text-sm font-bold text-[#0a0a0a]">O</span>
        </div>
        <span className="text-sm font-semibold text-text-primary">Orbit AI</span>
        <GlowDot />
        <span className="ml-auto font-mono text-xs text-text-tertiary">live demo</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-[220px] overflow-y-auto scroll-smooth p-4 sm:h-[260px] sm:p-5"
        style={{ scrollbarWidth: 'none' }}
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && phase === 'idle' && (
            <motion.p
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-text-tertiary"
            >
              Starting conversation...
            </motion.p>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-accent text-[#0a0a0a] font-medium'
                    : 'bg-surface-2 text-text-secondary'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {showTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="mb-3 flex justify-start"
            >
              <TypingDots />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="border-t border-[var(--color-card-border)] p-4">
        <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-4 py-2.5">
          <span className="flex-1 text-sm text-text-primary">
            {inputText || <span className="text-text-tertiary">Ask Orbit AI...</span>}
            {inputText && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="ml-0.5 inline-block h-4 w-0.5 bg-accent align-middle"
              />
            )}
          </span>
          <motion.div
            animate={inputText ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 0.2 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand"
          >
            <Send className="h-3.5 w-3.5 text-[#0a0a0a]" />
          </motion.div>
        </div>
        <p className="mt-2 text-center font-mono text-xs text-text-tertiary">Powered by Orbit AI</p>
      </div>
    </div>
  )
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function AIShowcase() {
  const { ref: chatRef, y: chatY } = useParallax({ speed: 0.15 })

  return (
    <section className="section-padding overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left - Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <SectionLabel>AI Solutions</SectionLabel>
            </motion.div>
            <LineReveal delay={0.1}>
              <SectionHeading className="mt-4">
                We Don&apos;t Just Use AI.
              </SectionHeading>
            </LineReveal>
            <LineReveal delay={0.2}>
              <SectionHeading>
                We <span className="text-gradient">Build It.</span>
              </SectionHeading>
            </LineReveal>
            <motion.p
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              viewport={{ once: true, margin: '-50px' }}
              className="mt-6 leading-relaxed text-text-secondary"
            >
              From custom ChatGPT-powered chatbots to fine-tuned language models, Orbit delivers AI
              solutions built specifically for your business. Not off-the-shelf tools, but
              intelligence trained on your data.
            </motion.p>
            <ul className="mt-8 space-y-3">
              {features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-text-secondary">{feature}</span>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Link href="/services">
                <Button variant="primary">
                  See AI Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right - Live chat demo */}
          <div ref={chatRef}>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }}
              viewport={{ once: true, margin: '-50px' }}
              style={{ y: chatY }}
            >
              <LiveChat />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
