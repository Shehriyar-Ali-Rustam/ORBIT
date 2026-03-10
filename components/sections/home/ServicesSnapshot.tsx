'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Brain, Globe, Smartphone, Palette, Users } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LineReveal } from '@/components/ui/LineReveal'

const iconMap: Record<string, React.ElementType> = {
  Bot, Brain, Globe, Smartphone, Palette, Users,
}

const services = [
  { icon: 'Bot', title: 'AI Chatbot Development', description: 'Intelligent chatbots powered by OpenAI, Gemini, and custom models that transform your customer experience.', href: '/services' },
  { icon: 'Brain', title: 'Model Training & Fine-Tuning', description: 'Custom AI models trained on your data for classification, generation, and intelligent automation.', href: '/services' },
  { icon: 'Globe', title: 'Web Development', description: 'Modern, high-performance websites and web applications built with Next.js, React, and cutting-edge tech.', href: '/services' },
  { icon: 'Smartphone', title: 'Mobile App Development', description: 'Cross-platform mobile apps for iOS and Android, built with React Native for maximum reach.', href: '/services' },
  { icon: 'Palette', title: 'Graphic Design & Branding', description: 'Complete brand identity systems and creative design that makes your business stand out.', href: '/services' },
  { icon: 'Users', title: 'Find a Freelancer', description: 'Browse our curated network of vetted professionals and hire the perfect talent for your project.', href: '/freelancers' },
]

export function ServicesSnapshot() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <LineReveal>
            <SectionLabel>What We Do</SectionLabel>
          </LineReveal>
          <LineReveal delay={0.1}>
            <SectionHeading className="mt-4">
              Everything You Need.{' '}
              <span className="text-gradient">One Orbit.</span>
            </SectionHeading>
          </LineReveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon]
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <Link href={service.href} className="group block">
                  <div className="relative h-full overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-8 backdrop-blur-sm transition-all duration-300 hover:border-accent/30">
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary">{service.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.description}</p>

                      {/* Bottom stat pill */}
                      <div className="mt-6 flex items-center justify-between border-t border-[var(--color-card-border)] pt-4">
                        <span className="text-sm font-medium text-accent transition-transform group-hover:translate-x-1">
                          Explore &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
