import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Montserrat } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppClerkProvider } from '@/components/providers/AppClerkProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '700'],
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Orbit',
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
  authors: [{ name: 'Shehriyar Ali Rustam', url: 'https://orbitpk.com' }],
  creator: 'Orbit',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://orbitpk.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://orbitpk.com',
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
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const SITE_URL = 'https://orbitpk.com'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Orbit',
  alternateName: 'ORBIT',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/og-image.png`,
  description:
    'Orbit is a Pakistan-based AI-powered technology company specializing in AI chatbots, model training, web development, mobile apps, and graphic design.',
  email: 'hello.theorbit@gmail.com',
  foundingDate: '2024',
  founders: [
    { '@type': 'Person', name: 'Shehriyar Ali Rustam' },
    { '@type': 'Person', name: 'Saqib Nawaz Khan' },
    { '@type': 'Person', name: 'Abdul Ahad' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PK',
  },
  knowsAbout: [
    'AI Development',
    'Machine Learning',
    'Chatbot Development',
    'Web Development',
    'Mobile App Development',
    'Graphic Design',
    'Brand Identity',
  ],
  sameAs: [
    'https://github.com/Shehriyar-Ali-Rustam',
    'https://www.linkedin.com/in/shehriyar-ali-rustam-516895246',
    'https://www.fiverr.com/sellers/shehriyar01se',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Orbit',
  description:
    'AI-Powered Software Solutions — chatbots, model training, web & mobile development.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-US',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('orbit-theme-v2');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}var r=document.documentElement;r.classList.add(t);r.classList.remove(t==='dark'?'light':'dark');r.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-background font-inter text-foreground antialiased">
        <ThemeProvider>
          <AppClerkProvider>
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
          </AppClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
