import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Orbit privacy policy — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <section className="pt-24 section-padding">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-gray-2">Last updated: February 2026</p>

        <div className="mt-12 space-y-8 text-gray-1">
          <div>
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <p className="mt-3 leading-relaxed">
              We collect information you provide directly to us, such as when you fill out a contact
              form, apply as a freelancer, or communicate with us. This may include your name, email
              address, phone number, and project details.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
            <p className="mt-3 leading-relaxed">
              We use the information we collect to respond to your inquiries, process freelancer
              applications, improve our services, and communicate with you about projects and
              opportunities.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">3. Data Protection</h2>
            <p className="mt-3 leading-relaxed">
              We implement industry-standard security measures to protect your personal information.
              Your data is encrypted in transit and at rest. We do not sell, trade, or rent your
              personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">4. Cookies</h2>
            <p className="mt-3 leading-relaxed">
              We use essential cookies to ensure proper functionality of our website. We do not use
              tracking cookies or third-party analytics that compromise your privacy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">5. Your Rights</h2>
            <p className="mt-3 leading-relaxed">
              You have the right to access, correct, or delete your personal data at any time. To
              exercise these rights, please contact us at hello@orbittech.io.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">6. Contact</h2>
            <p className="mt-3 leading-relaxed">
              For any privacy-related questions or concerns, please reach out to us at{' '}
              <a href="mailto:hello@orbittech.io" className="text-orange hover:underline">
                hello@orbittech.io
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
