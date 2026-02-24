import { z } from 'zod'

export const sellerProfileSchema = z.object({
  tagline: z
    .string()
    .min(10, 'Tagline must be at least 10 characters')
    .max(100, 'Tagline must be at most 100 characters'),
  bio: z
    .string()
    .min(50, 'Bio must be at least 50 characters')
    .max(1000, 'Bio must be at most 1000 characters'),
  skills: z
    .string()
    .min(2, 'Please enter at least one skill'),
  languages: z
    .string()
    .min(2, 'Please enter at least one language'),
  hourlyRate: z.coerce
    .number()
    .min(5, 'Minimum hourly rate is $5')
    .max(1000, 'Maximum hourly rate is $1000'),
  country: z
    .string()
    .min(2, 'Please enter your country'),
  github: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  linkedin: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  fiverr: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
})

export type SellerProfileFormData = z.infer<typeof sellerProfileSchema>
