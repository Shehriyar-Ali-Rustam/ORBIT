'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { GlowDot } from '@/components/ui/GlowDot'

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
  return (
    <section className="section-padding overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>AI Solutions</SectionLabel>
            <SectionHeading className="mt-4">
              We Don&apos;t Just Use AI.
              <br />
              We <span className="text-gradient">Build It.</span>
            </SectionHeading>
            <p className="mt-6 leading-relaxed text-gray-1">
              From custom ChatGPT-powered chatbots to fine-tuned language models, Orbit delivers AI
              solutions built specifically for your business — not off-the-shelf tools, but
              intelligence trained on your data.
            </p>
            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-sm text-gray-1">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/services">
                <Button variant="primary">See AI Services &rarr;</Button>
              </Link>
            </div>
          </motion.div>

          {/* Right - Chat UI */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                  <span className="text-xs font-bold text-white">O</span>
                </div>
                <span className="text-sm font-semibold text-white">Orbit AI</span>
                <GlowDot />
              </div>

              {/* Messages */}
              <div className="space-y-4 p-4">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.2, ease }}
                    viewport={{ once: true }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                        msg.role === 'user'
                          ? 'bg-orange text-white'
                          : 'bg-surface-2 text-gray-1'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input bar */}
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-2.5">
                  <span className="flex-1 text-sm text-gray-2">Ask Orbit AI...</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange">
                    <span className="text-xs text-white">&rarr;</span>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-gray-2">Powered by Orbit AI</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
