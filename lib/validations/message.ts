import { z } from 'zod'

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Max 2000 characters'),
})

export type MessageFormData = z.infer<typeof messageSchema>
