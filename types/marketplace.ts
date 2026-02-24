import { Timestamp } from 'firebase/firestore'

// ---- Auth / User ----
export type UserRole = 'buyer' | 'seller' | 'both'

export interface SellerProfile {
  tagline: string
  bio: string
  skills: string[]
  languages: { language: string; level: string }[]
  hourlyRate: number
  responseTime: string
  level: 'new' | 'level-1' | 'level-2' | 'top-rated'
  totalEarnings: number
  completedOrders: number
  rating: number
  reviewCount: number
  portfolioUrls: string[]
  github?: string
  linkedin?: string
  fiverr?: string
  available: boolean
  country: string
  memberSince: Timestamp
}

export interface MarketplaceUser {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  role: UserRole
  createdAt: Timestamp
  updatedAt: Timestamp
  sellerProfile?: SellerProfile
  stripeCustomerId?: string
  stripeConnectId?: string
}

// ---- Gig ----
export type GigCategory = 'ai' | 'web' | 'mobile' | 'design' | 'marketing' | 'other'
export type GigStatus = 'draft' | 'active' | 'paused'
export type PricingTier = 'basic' | 'standard' | 'premium'

export interface TierPricing {
  title: string
  description: string
  price: number
  deliveryDays: number
  revisions: number
  features: string[]
}

export interface Gig {
  id: string
  sellerId: string
  sellerName: string
  sellerPhoto: string | null
  title: string
  slug: string
  description: string
  category: GigCategory
  subcategory: string
  tags: string[]
  images: string[]
  coverImage: string
  pricing: Record<PricingTier, TierPricing>
  faq: { question: string; answer: string }[]
  status: GigStatus
  rating: number
  reviewCount: number
  orderCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ---- Order ----
export type OrderStatus =
  | 'pending_payment'
  | 'active'
  | 'in_progress'
  | 'delivered'
  | 'revision_requested'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export interface OrderDeliverable {
  url: string
  name: string
  uploadedAt: Timestamp
}

export interface Order {
  id: string
  gigId: string
  gigTitle: string
  gigCoverImage: string
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  tier: PricingTier
  price: number
  serviceFee: number
  totalAmount: number
  deliveryDays: number
  deliveryDeadline: Timestamp
  status: OrderStatus
  requirements: string
  deliverables: OrderDeliverable[]
  revisionCount: number
  maxRevisions: number
  stripeSessionId: string
  stripePaymentIntentId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  completedAt?: Timestamp
}

// ---- Conversation / Message ----
export interface Conversation {
  id: string
  participants: string[]
  participantNames: Record<string, string>
  participantPhotos: Record<string, string | null>
  lastMessage: string
  lastMessageAt: Timestamp
  lastMessageBy: string
  unreadCount: Record<string, number>
  relatedGigId?: string
  relatedOrderId?: string
  createdAt: Timestamp
}

export type MessageType = 'text' | 'file' | 'system'

export interface ConversationMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  type: MessageType
  fileUrl?: string
  fileName?: string
  read: boolean
  createdAt: Timestamp
}

// ---- Review ----
export interface Review {
  id: string
  orderId: string
  gigId: string
  sellerId: string
  buyerId: string
  buyerName: string
  buyerPhoto: string | null
  rating: number
  comment: string
  sellerResponse?: string
  createdAt: Timestamp
}
