'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface GigFAQProps {
  faq: { question: string; answer: string }[]
}

export function GigFAQ({ faq }: GigFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faq.length) return null

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary">FAQ</h2>

      <div className="mt-4 space-y-3">
        {faq.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-surface"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={openIndex === idx}
            >
              <span className="pr-4 font-semibold text-text-primary">{item.question}</span>
              <motion.div
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 shrink-0 text-orange" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <div className="px-5 pb-4 leading-relaxed text-text-secondary">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
