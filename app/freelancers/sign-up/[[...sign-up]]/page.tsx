import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
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
