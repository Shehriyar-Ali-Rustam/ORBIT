'use client'

import { useState, useEffect } from 'react'
import { getUserOrders } from '@/lib/firebase/firestore'
import type { Order } from '@/types/marketplace'

interface UseOrdersReturn {
  orders: Order[]
  loading: boolean
  error: string | null
}

export function useOrders(userId: string | undefined, role: 'buyer' | 'seller'): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchOrders() {
      setLoading(true)
      setError(null)

      try {
        const data = await getUserOrders(userId!, role)

        if (!cancelled) {
          setOrders(data as Order[])
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load orders.'
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      cancelled = true
    }
  }, [userId, role])

  return { orders, loading, error }
}
