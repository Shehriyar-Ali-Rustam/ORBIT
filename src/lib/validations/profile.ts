import { z } from 'zod'

export const sellerProfileSchema = z.object({
  tagline: z.string().min(10, 'Min 10 characters').max(120, 'Max 120 characters'),
  bio: z.string().min(50, 'Min 50 characters').max(600, 'Max 600 characters'),
  skills: z.array(z.string()).min(1, 'Add at least one skill').max(15, 'Max 15 skills'),
  languages: z.array(z.object({
    language: z.string().min(1),
    level: z.string().min(1),
  })).min(1, 'Add at least one language'),
  hourly_rate: z.coerce.number().min(1, 'Min $1').max(999, 'Max $999').optional().nullable(),
  response_time: z.string().optional().nullable(),
  country: z.string().min(2, 'Required'),
  portfolio_urls: z.array(z.string().url('Must be a valid URL')).optional(),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  fiverr: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
})

export type SellerProfileFormData = z.infer<typeof sellerProfileSchema>
