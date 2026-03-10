'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
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

const chatMessages = [
  { role: 'user', text: 'Can you help me train a custom AI model?' },
  { role: 'ai', text: 'Absolutely! We specialize in fine-tuning language models on your custom dataset. What industry are you in?' },
  { role: 'user', text: 'E-commerce' },
  { role: 'ai', text: 'Perfect. We can train a model on your product catalog and customer data to power intelligent recommendations and support.' },
]

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function AIShowcase() {
  const { ref: chatRef, y: chatY } = useParallax({ speed: 0.15 })

  return (
    <section className="section-padding overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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

          {/* Right - Chat UI with parallax */}
          <div ref={chatRef}>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }}
              viewport={{ once: true, margin: '-50px' }}
              style={{ y: chatY }}
            >
              <div className="overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] backdrop-blur-sm">
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-[var(--color-card-border)] px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand">
                    <span className="text-sm font-bold text-[#0a0a0a]">O</span>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">Orbit AI</span>
                  <GlowDot />
                </div>

                {/* Messages */}
                <div className="space-y-4 p-5">
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.15 }}
                      viewport={{ once: true }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                          msg.role === 'user'
                            ? 'bg-accent text-[#0a0a0a]'
                            : 'bg-surface-2 text-text-secondary'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input bar */}
                <div className="border-t border-[var(--color-card-border)] p-4">
                  <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-4 py-3">
                    <span className="flex-1 text-sm text-text-tertiary">Ask Orbit AI...</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                      <ArrowRight className="h-4 w-4 text-[#0a0a0a]" />
                    </div>
                  </div>
                  <p className="mt-2 text-center font-mono text-xs text-text-tertiary">Powered by Orbit AI</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
