import type { GigCategory, SellerLevel, OrderStatus } from '@/types/marketplace'

export const GIG_CATEGORIES: { value: GigCategory; label: string; icon: string }[] = [
  { value: 'ai', label: 'AI & ML', icon: 'Bot' },
  { value: 'web', label: 'Web Development', icon: 'Globe' },
  { value: 'mobile', label: 'Mobile Apps', icon: 'Smartphone' },
  { value: 'design', label: 'Graphic Design', icon: 'Palette' },
  { value: 'marketing', label: 'Digital Marketing', icon: 'TrendingUp' },
  { value: 'other', label: 'Other', icon: 'Layers' },
]

export const CATEGORY_LABELS: Record<GigCategory, string> = {
  ai: 'AI & ML',
  web: 'Web Dev',
  mobile: 'Mobile',
  design: 'Design',
  marketing: 'Marketing',
  other: 'Other',
}

export const SELLER_LEVELS: { value: SellerLevel; label: string; color: string }[] = [
  { value: 'new', label: 'New Seller', color: 'text-text-tertiary border-border' },
  { value: 'level-1', label: 'Level 1', color: 'text-blue-400 border-blue-500' },
  { value: 'level-2', label: 'Level 2', color: 'text-yellow-400 border-yellow-500' },
  { value: 'top-rated', label: 'Top Rated', color: 'text-orange border-orange' },
]

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending_payment: { label: 'Pending Payment', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
  active: { label: 'Active', className: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  in_progress: { label: 'In Progress', className: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  delivered: { label: 'Delivered', className: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
  revision_requested: { label: 'Revision', className: 'bg-orange-500/10 text-orange border-orange/30' },
  completed: { label: 'Completed', className: 'bg-green-500/10 text-green-500 border-green-500/30' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-500 border-red-500/30' },
  disputed: { label: 'Disputed', className: 'bg-red-500/10 text-red-500 border-red-500/30' },
}

export const POPULAR_SEARCHES = [
  'AI Chatbot',
  'React Developer',
  'Logo Design',
  'Mobile App',
  'Python Developer',
  'UI/UX Design',
]

export const SERVICE_FEE_RATE = 0.05 // 5% service fee
