import { getSupabase } from '@/lib/supabase/client'
import type { Gig, Profile, Order, Review, Conversation, Message, GigCategory, SearchFilters } from '@/types/marketplace'

// ---- Profiles ----

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as Profile
}

// ---- Gigs ----

export async function getGigBySlug(slug: string): Promise<Gig | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('gigs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) return null

  // Fetch seller profile
  const seller = await getProfile(data.seller_id)
  return { ...data, seller } as Gig
}

export async function getGigById(id: string): Promise<Gig | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('gigs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null

  const seller = await getProfile(data.seller_id)
  return { ...data, seller } as Gig
}

export async function getActiveGigs(options?: {
  category?: GigCategory
  limit?: number
  offset?: number
}): Promise<{ gigs: Gig[]; count: number }> {
  const supabase = getSupabase()
  let query = supabase
    .from('gigs')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
  }

  const { data, error, count } = await query
  if (error) return { gigs: [], count: 0 }
  return { gigs: (data || []) as Gig[], count: count || 0 }
}

export async function searchGigs(filters: Partial<SearchFilters> & { page?: number; limit?: number }): Promise<{ gigs: Gig[]; count: number }> {
  const supabase = getSupabase()
  const limit = filters.limit || 20
  const offset = ((filters.page || 1) - 1) * limit

  let query = supabase
    .from('gigs')
    .select('*', { count: 'exact' })
    .eq('status', 'active')

  if (filters.query) {
    query = query.ilike('title', `%${filters.query}%`)
  }
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    query = query.gte('pricing->basic->price', filters.minPrice)
  }
  if (filters.maxPrice !== undefined && filters.maxPrice < 50000) {
    query = query.lte('pricing->basic->price', filters.maxPrice)
  }
  if (filters.minRating) {
    query = query.gte('rating', filters.minRating)
  }

  // Sort
  switch (filters.sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'price_low':
      query = query.order('pricing->basic->price', { ascending: true })
      break
    case 'price_high':
      query = query.order('pricing->basic->price', { ascending: false })
      break
    default:
      query = query.order('order_count', { ascending: false })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query
  if (error) return { gigs: [], count: 0 }
  return { gigs: (data || []) as Gig[], count: count || 0 }
}

export async function getSellerGigs(sellerId: string, includeInactive = false): Promise<Gig[]> {
  const supabase = getSupabase()
  let query = supabase
    .from('gigs')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (!includeInactive) {
    query = query.eq('status', 'active')
  }

  const { data, error } = await query
  if (error) return []
  return (data || []) as Gig[]
}

// ---- Orders ----

export async function getOrder(orderId: string): Promise<Order | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error) return null
  return data as Order
}

export async function getUserOrders(userId: string, role: 'buyer' | 'seller'): Promise<Order[]> {
  const supabase = getSupabase()
  const column = role === 'buyer' ? 'buyer_id' : 'seller_id'
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq(column, userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data || []) as Order[]
}

// ---- Reviews ----

export async function getGigReviews(gigId: string): Promise<Review[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('gig_id', gigId)
    .order('created_at', { ascending: false })

  if (error) return []

  // Fetch buyer profiles for each review
  const reviews = (data || []) as Review[]
  const buyerIds = [...new Set(reviews.map((r) => r.buyer_id))]
  const profiles = await Promise.all(buyerIds.map(getProfile))
  const profileMap = new Map(profiles.filter(Boolean).map((p) => [p!.id, p!]))

  return reviews.map((r) => ({ ...r, buyer: profileMap.get(r.buyer_id) || undefined }))
}

export async function getSellerReviews(sellerId: string): Promise<Review[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) return []

  const reviews = (data || []) as Review[]
  const buyerIds = [...new Set(reviews.map((r) => r.buyer_id))]
  const profiles = await Promise.all(buyerIds.map(getProfile))
  const profileMap = new Map(profiles.filter(Boolean).map((p) => [p!.id, p!]))

  return reviews.map((r) => ({ ...r, buyer: profileMap.get(r.buyer_id) || undefined }))
}

// ---- Conversations ----

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .contains('participants', [userId])
    .order('last_message_at', { ascending: false })

  if (error) return []
  return (data || []) as Conversation[]
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) return []
  return (data || []) as Message[]
}

export async function findConversation(userId1: string, userId2: string): Promise<Conversation | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .contains('participants', [userId1, userId2])
    .single()

  if (error) return null
  return data as Conversation
}
