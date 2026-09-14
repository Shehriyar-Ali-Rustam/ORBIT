import type { Metadata } from 'next'
import { ServicesHero } from '@/components/sections/services/ServicesHero'
import { ServiceBlock } from '@/components/sections/services/ServiceBlock'
import { Process } from '@/components/sections/services/Process'
import { FAQ } from '@/components/sections/services/FAQ'
import { CTASection } from '@/components/sections/CTASection'
import { services } from '@/data/services'
import { faqs } from '@/data/faqs'

const SITE_URL = 'https://orbitpk.com'

export const metadata: Metadata = {
  title: 'Services - AI Chatbots, ML, Web & Mobile Development in Pakistan',
  description:
    'Full-service software solutions: custom AI chatbots, machine learning model training, Next.js web apps, mobile apps for Android and iOS, and brand design. Delivered fast by Orbit Innovations, Pakistan.',
  keywords: [
    'AI chatbot development Pakistan',
    'custom AI chatbot',
    'machine learning services Pakistan',
    'web development Pakistan',
    'mobile app development Pakistan',
    'graphic design agency Pakistan',
    'Next.js developer Pakistan',
    'Pakistan software services',
  ],
  alternates: { canonical: '/services' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answerText,
    },
  })),
}

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name: s.title,
      description: s.fullDescription,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'Worldwide',
      url: `${SITE_URL}/services#${s.slug}`,
    },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
  ],
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicesHero />
      <ServiceBlock />
      <Process />
      <FAQ />
      <CTASection />
    </>
  )
}
