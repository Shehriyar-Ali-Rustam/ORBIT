import { z } from 'zod'

export const orderRequirementsSchema = z.object({
  requirements: z.string().min(10, 'Min 10 characters').max(2000, 'Max 2000 characters'),
})

export const deliverySchema = z.object({
  message: z.string().min(5, 'Min 5 characters').max(1000, 'Max 1000 characters'),
})

export const revisionSchema = z.object({
  reason: z.string().min(10, 'Min 10 characters').max(1000, 'Max 1000 characters'),
})

export type OrderRequirementsData = z.infer<typeof orderRequirementsSchema>
export type DeliveryData = z.infer<typeof deliverySchema>
export type RevisionData = z.infer<typeof revisionSchema>
