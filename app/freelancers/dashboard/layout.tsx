'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/marketplace/dashboard/Sidebar'
import { getProfile } from '@/lib/marketplace/queries'
import type { Profile } from '@/types/marketplace'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mode, setMode] = useState<'seller' | 'buyer'>('seller')

  useEffect(() => {
    if (user?.id) {
      getProfile(user.id).then((p) => {
        setProfile(p)
        if (p?.role === 'buyer') setMode('buyer')
      })
    }
  }, [user?.id])

  function handleModeSwitch() {
    const newMode = mode === 'seller' ? 'buyer' : 'seller'
    setMode(newMode)
    if (newMode === 'buyer') {
      router.push('/freelancers')
    } else {
      router.push('/freelancers/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        mode={mode}
        onModeSwitch={handleModeSwitch}
        userName={user?.fullName || undefined}
        userRole={profile?.role || undefined}
      />
      <main className="ml-64 flex-1 bg-background p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
