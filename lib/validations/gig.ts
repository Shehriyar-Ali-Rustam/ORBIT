import { z } from 'zod'

const tierSchema = z.object({
  title: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
  description: z.string().min(10, 'Min 10 characters').max(200, 'Max 200 characters'),
  price: z.coerce.number().min(5, 'Minimum price is $5').max(50000, 'Maximum price is $50,000'),
  delivery_days: z.coerce.number().min(1, 'Min 1 day').max(365, 'Max 365 days'),
  revisions: z.coerce.number().min(0, 'Cannot be negative').max(100, 'Max 100'),
  features: z.string(),
})

export const gigSchema = z.object({
  title: z.string().min(10, 'Min 10 characters').max(120, 'Max 120 characters'),
  description: z.string().min(50, 'Min 50 characters').max(5000, 'Max 5000 characters'),
  category: z.enum(['ai', 'web', 'mobile', 'design', 'marketing', 'other'], {
    message: 'Please select a category',
  }),
  subcategory: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
  tags: z.string().min(2, 'Please enter at least one tag'),
  basic: tierSchema,
  standard: tierSchema,
  premium: tierSchema,
  faq: z.string().optional(),
})

export type GigFormData = z.infer<typeof gigSchema>
