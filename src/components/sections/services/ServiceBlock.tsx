'use client'

import Image from 'next/image'
import { Bot, Brain, Globe, Smartphone, Palette } from 'lucide-react'
import { services } from '@/data/services'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'

const iconMap: Record<string, React.ElementType> = {
  Bot,
  Brain,
  Globe,
  Smartphone,
  Palette,
}

/**
 * Three of these were remote Unsplash URLs. Local files for all five already
 * existed in `public/images/landing/` — they were downloaded for the QR
 * landing page — so the services page was paying for a third-party image fetch
 * on a photograph that was already sitting in the repo, and showing different
 * imagery for the same five capabilities as the landing page.
 */
const serviceImages: Record<string, string> = {
  'ai-chatbot': '/images/landing/cap-chatbots.jpg',
  'model-training': '/images/landing/cap-models.jpg',
  'web-development': '/images/landing/cap-web.jpg',
  'mobile-development': '/images/landing/cap-mobile.jpg',
  'graphic-design': '/images/landing/cap-design.jpg',
}

/**
 * The zig-zag stays — alternating sides is the right shape for five items that
 * each need a paragraph. What came off the image:
 *
 *  - A title pill sitting over the photograph, repeating the `h2` that is
 *    already 400px to its left. The same words twice in one viewport.
 *  - Two stacked scrims (`#0a0a0a/30` plus a bottom gradient) that existed
 *    only to make that pill legible. With the pill gone they darkened the
 *    photo for nothing, and both were pinned to dark literals, so in light
 *    mode every image was dimmed against a white page.
 *  - A `bg-gradient-brand` icon badge, the site's only remaining gradient fill.
 *
 * The green check marks are also gone. They put a third colour on a page with
 * one accent, and a list of things a service includes does not need a tick
 * beside each line to be read as a list.
 */
export function ServiceBlock() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="space-y-24 md:space-y-32">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon]
            const isReversed = i % 2 !== 0

            return (
              <Reveal
                key={service.id}
                as="article"
                amount={0.15}
                className="grid scroll-mt-28 items-start gap-x-16 gap-y-10 lg:grid-cols-2"
              >
                <div id={service.id} className={isReversed ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />}
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
                      {service.category}
                    </span>
                  </div>

                  <h2 className="mt-5 text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.025em] text-text-primary md:text-[2rem]">
                    {service.title}
                  </h2>

                  <p className="mt-4 max-w-[58ch] leading-relaxed text-text-secondary">
                    {service.fullDescription}
                  </p>

                  <Stagger as="ul" className="mt-8 border-t border-border">
                    {service.includes.map((item) => (
                      <StaggerItem
                        key={item}
                        as="li"
                        className="border-b border-border py-3 text-[0.9375rem] text-text-secondary"
                      >
                        {item}
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>

                <div className={isReversed ? 'lg:order-1' : ''}>
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
                    <Image
                      src={serviceImages[service.id]}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
