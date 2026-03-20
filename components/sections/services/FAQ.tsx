'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { faqs } from '@/data/faqs'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true }}
          >
            <SectionLabel>FAQ</SectionLabel>
            <SectionHeading className="mt-4">Common Questions</SectionHeading>
          </motion.div>
        </div>

        {/* ── Single outer card, all items inside ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)]"
        >
          {faqs.map((faq, i) => {
            const isOpen = openId === faq.id
            const isLast = i === faqs.length - 1

            return (
              <div
                key={faq.id}
                className={!isLast ? 'border-b border-[var(--color-card-border)]' : ''}
              >
                {/* Question row */}
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[var(--color-surface)]"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[0.95rem] font-semibold leading-snug text-text-primary"
                  >
                    {faq.question}
                  </span>

                  {/* +/− icon */}
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
                    style={{
                      borderColor: isOpen ? 'var(--color-accent)' : 'var(--color-card-border)',
                      background:  isOpen ? 'rgba(255,117,31,0.10)' : 'var(--color-surface)',
                      color:       isOpen ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                    }}
                  >
                    <motion.svg
                      width="12" height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.22, ease }}
                    >
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </motion.svg>
                  </span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
