import type { Metadata } from 'next'
import { ContactHero } from '@/components/sections/contact/ContactHero'
import { ContactForm } from '@/components/forms/ContactForm'
import { ContactInfo } from '@/components/sections/contact/ContactInfo'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Orbit. Tell us about your project and we\'ll respond within 24 hours.',
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-5">
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
