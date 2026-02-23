import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="dot-grid flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-xl px-6 text-center lg:px-8">
        <div className="text-8xl font-black text-orange">404</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-gray-1">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back
          on track.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost">Contact Us</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
