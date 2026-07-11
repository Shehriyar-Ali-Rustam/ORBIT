import type { Metadata } from 'next'
import { ContactHero } from '@/components/sections/contact/ContactHero'
import { ContactForm } from '@/components/forms/ContactForm'
import { ContactInfo } from '@/components/sections/contact/ContactInfo'

export const metadata: Metadata = {
  title: 'Contact ORBIT - Hire Us for AI, Web & Mobile Projects',
  description:
    'Start a project with ORBIT. AI chatbots, web development, mobile apps, and brand design. We reply within 24 hours. Free initial consultation.',
  keywords: [
    'hire ORBIT',
    'hire AI developers Pakistan',
    'contact ORBIT',
    'software development Pakistan',
    'orbitpk contact',
  ],
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 md:gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
