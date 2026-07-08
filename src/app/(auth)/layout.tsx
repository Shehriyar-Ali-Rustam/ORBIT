import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo.png" alt="ORBIT" width={160} height={160} quality={100} className="h-12 w-12 object-contain" />
            <span className="font-montserrat text-lg font-bold tracking-[0.3em] text-text-primary">ORBIT</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
