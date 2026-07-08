import { SignUp } from '@clerk/nextjs'
import { CLERK_ENABLED } from '@/lib/clerk-flag'

export default function SignUpPage() {
  if (!CLERK_ENABLED) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
        <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <h1 className="text-xl font-semibold text-text-primary">Authentication not configured</h1>
          <p className="mt-3 text-sm text-text-secondary">
            Set <code className="rounded bg-surface-2 px-1.5 py-0.5 text-accent">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{' '}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 text-accent">CLERK_SECRET_KEY</code> in <code className="rounded bg-surface-2 px-1.5 py-0.5">.env.local</code> to enable sign-up.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <SignUp
        path="/freelancers/sign-up"
        routing="path"
        signInUrl="/freelancers/sign-in"
        afterSignUpUrl="/freelancers/onboarding"
      />
    </div>
  )
}
