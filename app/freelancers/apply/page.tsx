import type { Metadata } from 'next'
import { FreelancerApplyForm } from '@/components/forms/FreelancerApplyForm'

export const metadata: Metadata = {
  title: 'Apply as Freelancer',
  description: 'Join the Orbit freelancer network. Apply with your skills and portfolio to get access to quality clients worldwide.',
}

export default function FreelancerApplyPage() {
  return (
    <section className="pt-24 section-padding">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange">
            Join Orbit
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Apply as a <span className="text-gradient">Freelancer</span>
          </h1>
          <p className="mt-4 text-text-secondary">
            Fill out the form below and our team will review your application within 48 hours.
          </p>
        </div>
        <div className="mt-12">
          <FreelancerApplyForm />
        </div>
      </div>
    </section>
  )
}
