'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Brain, Globe, Smartphone, Palette, Users } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'

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

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function ServicesSnapshot() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <SectionLabel>What We Do</SectionLabel>
            <SectionHeading className="mt-4">
              Everything You Need.{' '}
              <span className="text-gradient">One Orbit.</span>
            </SectionHeading>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon]
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <Card className="h-full">
                  <Icon className="h-6 w-6 text-orange" />
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.description}</p>
                  <Link
                    href={service.href}
                    className="mt-4 inline-block text-sm font-medium text-orange transition-colors hover:underline"
                  >
                    Explore &rarr;
                  </Link>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
