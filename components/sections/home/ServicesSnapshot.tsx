'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { LineReveal } from '@/components/ui/LineReveal'

const services = [
  {
    title: 'AI Chatbot Development',
    description: 'Intelligent chatbots powered by OpenAI, Gemini, and custom models that transform your customer experience.',
    href: '/services',
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&q=80&fit=crop&crop=center',
    tags: ['OpenAI', 'Gemini'],
  },
  {
    title: 'Model Training & Fine-Tuning',
    description: 'Custom AI models trained on your data for classification, generation, and intelligent automation.',
    href: '/services',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&fit=crop&crop=center',
    tags: ['Custom AI', 'Fine-Tuning'],
  },
  {
    title: 'Web Development',
    description: 'Modern, high-performance websites and web applications built with Next.js, React, and cutting-edge tech.',
    href: '/services',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&fit=crop&crop=center',
    tags: ['Next.js', 'React'],
  },
  {
    title: 'Mobile App Development',
    description: 'Cross-platform mobile apps for iOS and Android, built with React Native for maximum reach.',
    href: '/services',
    image: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=600&q=80&fit=crop&crop=center',
    tags: ['iOS', 'Android'],
  },
  {
    title: 'Graphic Design & Branding',
    description: 'Complete brand identity systems and creative design that makes your business stand out.',
    href: '/services',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80&fit=crop&crop=center',
    tags: ['Branding', 'Identity'],
  },
  {
    title: 'Find a Freelancer',
    description: 'Browse our curated network of vetted professionals and hire the perfect talent for your project.',
    href: '/freelancers',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&fit=crop&crop=center',
    tags: ['Vetted', 'On-Demand'],
  },
]

export function ServicesSnapshot() {
  return (
    <section className="section-padding relative overflow-hidden">

      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-accent/[0.04] dark:from-accent/[0.08] dark:via-transparent dark:to-accent/[0.05]" />
        <motion.div
          className="absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[90px] dark:bg-accent/15"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-24 top-1/3 h-56 w-56 rounded-full bg-accent/8 blur-[70px] dark:bg-accent/12"
          animate={{ y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-24 bottom-1/4 h-56 w-56 rounded-full bg-accent/8 blur-[70px] dark:bg-accent/12"
          animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="services-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#services-dots)" className="text-accent" />
        </svg>
      </div>

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

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 90, damping: 22, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link href={service.href} className="group block h-full">
                {/* Card: image fills entire card, content overlaid at bottom */}
                <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]" style={{ minHeight: '420px' }}>

                  {/* Full-card background image */}
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Gradient: transparent at top → dark at bottom, derived from image */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

                  {/* Content sits at bottom over gradient */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col px-6 pb-5 pt-16">
                    <h3 className="text-lg font-bold text-white drop-shadow-md">{service.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65 drop-shadow-sm">{service.description}</p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA button */}
                    <div className="mt-4">
                      <span className="block w-full rounded-2xl bg-white/15 py-3 text-center text-sm font-semibold text-white backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-white">
                        Explore →
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
