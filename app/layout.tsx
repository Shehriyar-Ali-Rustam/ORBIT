import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Orbit — AI-Powered Software Solutions',
    template: '%s | Orbit',
  },
  description:
    'Orbit is a full-service technology company specializing in AI chatbots, model training, web development, mobile apps, and graphic design. Based in Pakistan, serving globally.',
  keywords: [
    'AI software company',
    'chatbot development',
    'model training',
    'web development Pakistan',
    'mobile app development',
    'graphic design',
    'freelancer marketplace',
    'AI solutions',
    'Next.js development',
  ],
  authors: [{ name: 'Shehriyar Ali Rustam', url: 'https://orbittech.io' }],
  creator: 'Orbit',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://orbittech.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://orbittech.io',
    title: 'Orbit — AI-Powered Software Solutions',
    description:
      'Full-service AI software company — chatbots, model training, web & mobile development.',
    siteName: 'Orbit',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbit — AI-Powered Software Solutions',
    description:
      'Full-service AI software company — chatbots, model training, web & mobile development.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} dark`} suppressHydrationWarning>
      <body className="bg-background font-montserrat text-foreground antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
