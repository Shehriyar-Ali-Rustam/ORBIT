import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Montserrat } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AppClerkProvider } from '@/components/providers/AppClerkProvider'
import { CurrencyProvider } from '@/components/providers/CurrencyProvider'

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
    default: 'Orbit Innovations - AI Software Company in Pakistan | Chatbots, Web & Mobile Apps',
    template: '%s | Orbit Innovations',
  },
  description:
    'Orbit Innovations builds AI chatbots, custom ML models, web apps, mobile apps, and brand identity for clients worldwide. Pakistan-based software studio. Founder-led, fast delivery, world-class quality.',
  keywords: [
    // Brand terms first: these are what someone types when they already know us.
    'Orbit Innovations',
    'Orbit Innovations Pakistan',
    'Orbit Innovations Islamabad',
    'Orbit Innovations software company',
    'Orbit Innovations',
    'orbitpk',
    'AI software company Pakistan',
    'AI chatbot development Pakistan',
    'custom AI development',
    'Next.js developers Pakistan',
    'web development agency Pakistan',
    'mobile app development Pakistan',
    'ML model training',
    'Pakistan software company',
    'freelancer marketplace Pakistan',
    'hire developers Pakistan',
  ],
  applicationName: 'Orbit Innovations',
  authors: [{ name: 'Shehriyar Ali Rustam', url: 'https://orbitpk.com' }],
  creator: 'Orbit Innovations',
  publisher: 'Orbit Innovations',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://orbitpk.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://orbitpk.com',
    title: 'Orbit Innovations - AI-Powered Software Solutions',
    description:
      'Orbit Innovations is a Pakistan-based AI software studio - chatbots, model training, web and mobile development.',
    siteName: 'Orbit Innovations',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbit Innovations - AI-Powered Software Solutions',
    description:
      'Orbit Innovations is a Pakistan-based AI software studio - chatbots, model training, web and mobile development.',
    images: ['/og-image.png'],
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
  name: 'Orbit Innovations',
  legalName: 'Orbit Innovations',
  // Every spelling someone might search. This is what lets Google connect
  // "orbit innovations", "orbit pk" and plain "ORBIT" to the same entity.
  alternateName: ['ORBIT', 'Orbit', 'Orbit Innovations Pakistan', 'OrbitPK', 'Orbit Innovations Islamabad'],
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/og-image.png`,
  description:
    'Orbit Innovations is a Pakistan-based AI-powered technology company specializing in AI chatbots, model training, web development, mobile apps, and graphic design.',
  email: 'info@orbitpk.com',
  foundingDate: '2024',
  founders: [
    { '@type': 'Person', name: 'Shehriyar Ali Rustam' },
    { '@type': 'Person', name: 'Saqib Nawaz Khan' },
    { '@type': 'Person', name: 'Abdul Ahad' },
  ],
  employee: [
    { '@type': 'Person', name: 'Moiz Danishmand', jobTitle: 'Outreach Lead' },
    { '@type': 'Person', name: 'Musa Khan', jobTitle: 'Outreach Lead' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Islamabad',
    addressRegion: 'Islamabad Capital Territory',
    addressCountry: 'PK',
  },
  areaServed: [
    { '@type': 'City', name: 'Islamabad' },
    { '@type': 'City', name: 'Rawalpindi' },
    { '@type': 'Country', name: 'Pakistan' },
    { '@type': 'Place', name: 'Worldwide (Remote)' },
  ],
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
  name: 'Orbit Innovations',
  alternateName: ['ORBIT', 'Orbit', 'OrbitPK'],
  description:
    'Orbit Innovations - AI-Powered Software Solutions: chatbots, model training, web and mobile development.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-US',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/logo.png" fetchPriority="high" />
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
          <CurrencyProvider>
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
          </CurrencyProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
