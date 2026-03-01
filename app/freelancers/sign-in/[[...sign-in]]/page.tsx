import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <SignIn
        path="/freelancers/sign-in"
        routing="path"
        signUpUrl="/freelancers/sign-up"
        afterSignInUrl="/freelancers/dashboard"
      />
    </div>
  )
}
