'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Bot, Brain, Globe, Smartphone, Palette, Check } from 'lucide-react'
import { services } from '@/data/services'

const iconMap: Record<string, React.ElementType> = {
  Bot, Brain, Globe, Smartphone, Palette,
}

const serviceImages: Record<string, string> = {
  'ai-chatbot': '/chatbot-examples.webp',
  'model-training': '/ai-model-training.png',
  'web-development':
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85',
  'mobile-development':
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=85',
  'graphic-design':
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=85',
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
            const imgSrc = serviceImages[service.id]

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true, margin: '-50px' }}
                className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}
              >
                <div className={isReversed ? 'lg:order-2' : ''}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                    {Icon && <Icon className="h-7 w-7 text-accent" />}
                  </div>
                  <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
                    {service.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-text-secondary">{service.fullDescription}</p>
                  <ul className="mt-6 space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={isReversed ? 'lg:order-1' : ''}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.15, ease }}
                    viewport={{ once: true }}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--color-card-border)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-[#0a0a0a]/30" />
                      {/* Orange accent gradient at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a]/70 to-transparent" />
                      {/* Icon badge */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-lg">
                          {Icon && <Icon className="h-5 w-5 text-[#0a0a0a]" />}
                        </div>
                        <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          {service.title}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
