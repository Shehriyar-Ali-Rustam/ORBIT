import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Space_Mono, Syne } from 'next/font/google'
import '@/styles/landing.css'

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-grotesk',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ORBIT — AI, Web & Mobile Software Studio in Islamabad',
  description:
    'ORBIT builds AI chatbots, custom models, web platforms and mobile apps from Islamabad, Pakistan. Call, message or save our contact card.',
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  colorScheme: 'dark',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`ds ${grotesk.variable} ${spaceMono.variable} ${syne.variable}`}>
      {children}
    </div>
  )
}
