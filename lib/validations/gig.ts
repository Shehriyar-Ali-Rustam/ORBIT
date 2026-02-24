import { z } from 'zod'

const tierSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must be at most 50 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be at most 200 characters'),
  price: z.coerce
    .number()
    .min(5, 'Minimum price is $5')
    .max(50000, 'Maximum price is $50,000'),
  deliveryDays: z.coerce
    .number()
    .min(1, 'Minimum delivery is 1 day')
    .max(365, 'Maximum delivery is 365 days'),
  revisions: z.coerce
    .number()
    .min(0, 'Revisions cannot be negative')
    .max(100, 'Maximum 100 revisions'),
  features: z.string(),
})

export const gigSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(120, 'Title must be at most 120 characters'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be at most 5000 characters'),
  category: z.enum(['ai', 'web', 'mobile', 'design', 'marketing', 'other'], {
    message: 'Please select a category',
  }),
  subcategory: z
    .string()
    .min(2, 'Subcategory must be at least 2 characters')
    .max(50, 'Subcategory must be at most 50 characters'),
  tags: z
    .string()
    .min(2, 'Please enter at least one tag'),
  basic: tierSchema,
  standard: tierSchema,
  premium: tierSchema,
  faq: z.string().optional(),
})

export type GigFormData = z.infer<typeof gigSchema>
