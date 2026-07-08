'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useTheme } from '@/components/ThemeProvider'
import { CLERK_ENABLED } from '@/lib/clerk-flag'

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

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const appearance = theme === 'dark' ? darkAppearance : lightAppearance

  if (!CLERK_ENABLED) return <>{children}</>
  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>
}
