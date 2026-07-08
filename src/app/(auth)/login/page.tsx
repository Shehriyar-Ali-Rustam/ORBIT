import { redirect } from 'next/navigation'

export default function LoginRedirect() {
  redirect('/freelancers/sign-in')
}
