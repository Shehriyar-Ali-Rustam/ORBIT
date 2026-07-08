import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  service: z.enum(
    [
      'ai-chatbot',
      'model-training',
      'web-development',
      'mobile-development',
      'graphic-design',
      'freelancer',
      'other',
    ],
    { message: 'Please select a service' }
  ),
  budget: z.enum(['under-500', '500-2000', '2000-10000', '10000-plus', 'not-sure'], {
    message: 'Please select a budget range',
  }),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
})

export type ContactFormData = z.infer<typeof contactSchema>
