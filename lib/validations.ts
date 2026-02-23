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

export const freelancerApplySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string().min(2).max(100),
  skills: z.string().min(2).max(500),
  portfolioUrl: z.string().url('Please enter a valid URL'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  fiverrUrl: z.string().url().optional().or(z.literal('')),
  hourlyRate: z.string().min(1),
  experience: z.enum(['0-1', '1-3', '3-5', '5-plus']),
  bio: z.string().min(50).max(300),
  hearAbout: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
export type FreelancerApplyData = z.infer<typeof freelancerApplySchema>
