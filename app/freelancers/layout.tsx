'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { MarketplaceNavbar } from '@/components/marketplace/MarketplaceNavbar'
import { Footer } from '@/components/layout/Footer'
import { useTheme } from '@/components/ThemeProvider'

const darkAppearance = {
  variables: {
    colorPrimary: '#FF751F',
    colorBackground: '#0D0D0D',
    colorInputBackground: '#141414',
    colorInputText: '#FFFFFF',
    colorText: '#FFFFFF',
    colorTextSecondary: '#A0A0A0',
    colorNeutral: '#FFFFFF',
    colorTextOnPrimaryBackground: '#FFFFFF',
    colorDanger: '#FF4444',
  },
}

const lightAppearance = {
  variables: {
    colorPrimary: '#FF751F',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#F5F5F5',
    colorInputText: '#111111',
    colorText: '#111111',
    colorTextSecondary: '#555555',
    colorNeutral: '#111111',
    colorTextOnPrimaryBackground: '#FFFFFF',
    colorDanger: '#DC2626',
  },
}

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const appearance = theme === 'dark' ? darkAppearance : lightAppearance

  return (
    <ClerkProvider appearance={appearance}>
      <MarketplaceNavbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </ClerkProvider>
  )
}
