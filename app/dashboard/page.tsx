'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function DashboardPage() {
  const router = useRouter()
  const { isSeller, loading } = useAuthStore()

  useEffect(() => {
    if (!loading) {
      if (isSeller) {
        router.replace('/dashboard/seller')
      } else {
        router.replace('/dashboard/orders')
      }
    }
  }, [isSeller, loading, router])

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent" />
    </div>
  )
}
