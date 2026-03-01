'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { SellerProfileForm } from '@/components/marketplace/forms/SellerProfileForm'
import { getProfile } from '@/lib/marketplace/queries'
import type { Profile } from '@/types/marketplace'

export default function ProfilePage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    getProfile(user.id)
      .then((p) => setProfile(p))
      .finally(() => setLoading(false))
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-text-secondary">Profile not found. Please complete onboarding first.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Update your seller profile information.</p>
      </div>

      {saved && (
        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
          Profile saved successfully!
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-6">
        <SellerProfileForm
          profile={profile}
          onSaved={(updated) => {
            setProfile(updated)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
          }}
        />
      </div>
    </div>
  )
}
