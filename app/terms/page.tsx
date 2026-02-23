import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Orbit terms of service — the rules and guidelines for using our services.',
}

export default function TermsPage() {
  return (
    <section className="pt-24 section-padding">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-gray-2">Last updated: February 2026</p>

        <div className="mt-12 space-y-8 text-gray-1">
          <div>
            <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="mt-3 leading-relaxed">
              By accessing and using Orbit&apos;s website and services, you agree to be bound by
              these Terms of Service. If you do not agree with any part of these terms, please do not
              use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">2. Services</h2>
            <p className="mt-3 leading-relaxed">
              Orbit provides software development, AI solutions, graphic design, and freelancer
              marketplace services. All projects are governed by individual agreements that outline
              scope, timeline, deliverables, and payment terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">3. Intellectual Property</h2>
            <p className="mt-3 leading-relaxed">
              Upon full payment, clients receive full ownership of all deliverables unless otherwise
              stated in the project agreement. Orbit retains the right to showcase completed work in
              our portfolio unless a confidentiality agreement is in place.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">4. Payment Terms</h2>
            <p className="mt-3 leading-relaxed">
              Payment terms are defined in individual project agreements. Standard terms include an
              upfront deposit of 50%, with the remainder due upon project completion or at agreed
              milestones.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">5. Confidentiality</h2>
            <p className="mt-3 leading-relaxed">
              We treat all client information as confidential. We are happy to sign NDAs upon
              request. Our team members are bound by confidentiality agreements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">6. Limitation of Liability</h2>
            <p className="mt-3 leading-relaxed">
              Orbit shall not be liable for any indirect, incidental, or consequential damages
              arising from the use of our services. Our total liability is limited to the amount paid
              for the specific service in question.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">7. Contact</h2>
            <p className="mt-3 leading-relaxed">
              For any questions about these terms, please contact us at{' '}
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
