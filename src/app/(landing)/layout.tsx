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
  // `absolute` opts out of the root layout's "%s | ORBIT" template, which
  // would otherwise render "ORBIT — ... in Islamabad | ORBIT".
  title: { absolute: 'Orbit Innovations · AI, Web & Mobile Software Studio in Islamabad' },
  description:
    'Orbit Innovations builds AI chatbots, custom models, web platforms and mobile apps from Islamabad, Pakistan. Call, message or save our contact card.',
  alternates: { canonical: '/' },
}

// Tints the mobile browser chrome to match the canvas. Left on the dark
// values, a phone renders its address bar near-black above a white page.
// Flip both back to '#0D0D0D' / 'dark' alongside the `ds-dark` class.
export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`ds ${grotesk.variable} ${spaceMono.variable} ${syne.variable}`}>
      {children}
    </div>
  )
}
