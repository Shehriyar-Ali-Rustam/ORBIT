'use client'

import { motion } from 'framer-motion'
import { Bot, Brain, Globe, Smartphone, Palette } from 'lucide-react'
import { Check } from 'lucide-react'
import { services } from '@/data/services'

const iconMap: Record<string, React.ElementType> = {
  Bot, Brain, Globe, Smartphone, Palette,
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function ServiceBlock() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="space-y-24">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon]
            const isReversed = i % 2 !== 0

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true, margin: '-50px' }}
                className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
                  isReversed ? 'lg:direction-rtl' : ''
                }`}
              >
                <div className={isReversed ? 'lg:order-2' : ''}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-dim">
                    {Icon && <Icon className="h-7 w-7 text-orange" />}
                  </div>
                  <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                    {service.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-gray-1">{service.fullDescription}</p>
                  <ul className="mt-6 space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-sm text-gray-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={isReversed ? 'lg:order-1' : ''}>
                  <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-surface">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-orange-dim">
                      {Icon && <Icon className="h-12 w-12 text-orange" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
