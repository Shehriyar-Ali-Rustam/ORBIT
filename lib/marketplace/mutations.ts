import { getSupabase } from '@/lib/supabase/client'
import type { Gig, Order, Review, Conversation, Message, Profile, GigStatus, OrderStatus } from '@/types/marketplace'

// ---- Profiles ----

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ ...profile, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw new Error(`Profile upsert failed: ${error.message}`)
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(`Profile update failed: ${error.message}`)
  return data as Profile
}

// ---- Gigs ----

export async function createGig(gig: Omit<Gig, 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count' | 'order_count'>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('gigs')
    .insert(gig)
    .select()
    .single()

  if (error) throw new Error(`Gig creation failed: ${error.message}`)
  return data as Gig
}

export async function updateGig(gigId: string, updates: Partial<Gig>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('gigs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', gigId)
    .select()
    .single()

  if (error) throw new Error(`Gig update failed: ${error.message}`)
  return data as Gig
}

export async function deleteGig(gigId: string) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('gigs')
    .delete()
    .eq('id', gigId)

  if (error) throw new Error(`Gig deletion failed: ${error.message}`)
}

export async function updateGigStatus(gigId: string, status: GigStatus) {
  return updateGig(gigId, { status })
}

// ---- Orders ----

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (error) throw new Error(`Order creation failed: ${error.message}`)
  return data as Order
}

export async function updateOrder(orderId: string, updates: Partial<Order>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('orders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw new Error(`Order update failed: ${error.message}`)
  return data as Order
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const updates: Partial<Order> = { status }
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
  }
  return updateOrder(orderId, updates)
}

// ---- Reviews ----

export async function createReview(review: Omit<Review, 'id' | 'created_at'>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()

  if (error) throw new Error(`Review creation failed: ${error.message}`)

  // Update gig rating
  await updateGigRating(review.gig_id)
  // Update seller rating
  await updateSellerRating(review.seller_id)

  return data as Review
}

export async function addSellerResponse(reviewId: string, response: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reviews')
    .update({ seller_response: response })
    .eq('id', reviewId)
    .select()
    .single()

  if (error) throw new Error(`Response failed: ${error.message}`)
  return data as Review
}

async function updateGigRating(gigId: string) {
  const supabase = getSupabase()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('gig_id', gigId)

  if (!reviews?.length) return

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  await supabase
    .from('gigs')
    .update({ rating: Math.round(avg * 100) / 100, review_count: reviews.length })
    .eq('id', gigId)
}

async function updateSellerRating(sellerId: string) {
  const supabase = getSupabase()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('seller_id', sellerId)

  if (!reviews?.length) return

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  await supabase
    .from('profiles')
    .update({ rating: Math.round(avg * 100) / 100, review_count: reviews.length })
    .eq('id', sellerId)
}

// ---- Conversations ----

export async function createConversation(conversation: Omit<Conversation, 'id' | 'created_at'>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('conversations')
    .insert(conversation)
    .select()
    .single()

  if (error) throw new Error(`Conversation creation failed: ${error.message}`)
  return data as Conversation
}

export async function sendMessage(message: Omit<Message, 'id' | 'created_at' | 'read'>) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single()

  if (error) throw new Error(`Message send failed: ${error.message}`)

  // Update conversation's last message
  await supabase
    .from('conversations')
    .update({
      last_message: message.content,
      last_message_at: new Date().toISOString(),
      last_message_by: message.sender_id,
    })
    .eq('id', message.conversation_id)

  return data as Message
}

export async function markMessagesRead(conversationId: string, userId: string) {
  const supabase = getSupabase()
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false)
}

// ---- Notifications ----

export async function createNotification(notification: { user_id: string; type: string; title: string; message: string; link?: string }) {
  const supabase = getSupabase()
  const { error } = await supabase
    .from('notifications')
    .insert(notification)

  if (error) throw new Error(`Notification creation failed: ${error.message}`)
}

export async function markNotificationRead(notificationId: string) {
  const supabase = getSupabase()
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = getSupabase()
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
}
