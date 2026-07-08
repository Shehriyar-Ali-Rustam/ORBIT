// ---- Auth / User ----
export type UserRole = 'buyer' | 'seller' | 'both'
export type SellerLevel = 'new' | 'level-1' | 'level-2' | 'top-rated'

export interface MarketplaceUser {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  role: UserRole
}

export interface Profile {
  id: string // Clerk user ID
  email: string
  display_name: string
  photo_url: string | null
  role: UserRole
  tagline: string | null
  bio: string | null
  skills: string[]
  languages: { language: string; level: string }[]
  hourly_rate: number | null
  response_time: string | null
  level: SellerLevel
  total_earnings: number
  completed_orders: number
  rating: number
  review_count: number
  portfolio_urls: string[]
  github: string | null
  linkedin: string | null
  fiverr: string | null
  available: boolean
  country: string | null
  stripe_customer_id: string | null
  stripe_connect_id: string | null
  created_at: string
  updated_at: string
}

// ---- Gig ----
export type GigCategory = 'ai' | 'web' | 'mobile' | 'design' | 'marketing' | 'other'
export type GigStatus = 'draft' | 'active' | 'paused'
export type PricingTier = 'basic' | 'standard' | 'premium'

export interface TierPricing {
  title: string
  description: string
  price: number
  delivery_days: number
  revisions: number
  features: string[]
}

export interface Gig {
  id: string
  seller_id: string
  title: string
  slug: string
  description: string
  category: GigCategory
  subcategory: string
  tags: string[]
  images: string[]
  cover_image: string | null
  pricing: Record<PricingTier, TierPricing>
  faq: { question: string; answer: string }[]
  status: GigStatus
  rating: number
  review_count: number
  order_count: number
  created_at: string
  updated_at: string
  // Joined data
  seller?: Profile
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
  uploaded_at: string
}

export interface Order {
  id: string
  gig_id: string
  gig_title: string
  gig_cover_image: string | null
  seller_id: string
  buyer_id: string
  tier: PricingTier
  price: number
  service_fee: number
  total_amount: number
  delivery_days: number
  delivery_deadline: string | null
  status: OrderStatus
  requirements: string | null
  deliverables: OrderDeliverable[]
  revision_count: number
  max_revisions: number
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  // Joined data
  gig?: Gig
  seller?: Profile
  buyer?: Profile
}

// ---- Conversation / Message ----
export interface Conversation {
  id: string
  participants: string[]
  participant_names: Record<string, string>
  participant_photos: Record<string, string | null>
  last_message: string | null
  last_message_at: string
  last_message_by: string | null
  unread_count: Record<string, number>
  related_gig_id: string | null
  related_order_id: string | null
  created_at: string
}

export type MessageType = 'text' | 'file' | 'system'

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  content: string
  type: MessageType
  file_url: string | null
  file_name: string | null
  read: boolean
  created_at: string
}

// ---- Review ----
export interface Review {
  id: string
  order_id: string
  gig_id: string
  seller_id: string
  buyer_id: string
  rating: number
  comment: string
  seller_response: string | null
  created_at: string
  // Joined data
  buyer?: Profile
}

// ---- Notification ----
export type NotificationType = 'message' | 'order' | 'review' | 'system'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  read: boolean
  created_at: string
}

// ---- Search Filters ----
export interface SearchFilters {
  query: string
  category: GigCategory | ''
  minPrice: number
  maxPrice: number
  minRating: number
  deliveryDays: number | null
  sellerLevel: SellerLevel | ''
  sortBy: 'relevant' | 'newest' | 'rating' | 'price_low' | 'price_high'
}
