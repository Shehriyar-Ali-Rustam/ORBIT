import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required').max(5),
  comment: z.string().min(20, 'Min 20 characters').max(500, 'Max 500 characters'),
})

export type ReviewFormData = z.infer<typeof reviewSchema>
