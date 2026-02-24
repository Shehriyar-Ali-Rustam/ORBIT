import { create } from 'zustand'
import type { MarketplaceUser } from '@/types/marketplace'

interface AuthState {
  user: MarketplaceUser | null
  firebaseUid: string | null
  loading: boolean
  isAuthenticated: boolean
  isSeller: boolean
  isBuyer: boolean
  setUser: (user: MarketplaceUser | null) => void
  setFirebaseUid: (uid: string | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUid: null,
  loading: true,
  isAuthenticated: false,
  isSeller: false,
  isBuyer: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isSeller: user?.role === 'seller' || user?.role === 'both',
      isBuyer: user?.role === 'buyer' || user?.role === 'both',
    }),
  setFirebaseUid: (uid) => set({ firebaseUid: uid }),
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({
      user: null,
      firebaseUid: null,
      loading: false,
      isAuthenticated: false,
      isSeller: false,
      isBuyer: false,
    }),
}))
