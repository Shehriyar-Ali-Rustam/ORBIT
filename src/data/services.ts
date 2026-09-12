import { Service } from '@/types'

export const services: Service[] = [
  {
    id: 'ai-chatbot',
    icon: 'Bot',
    title: 'AI Chatbot Development',
    shortDescription:
      'Assistants trained on your own documents and wired into your site, app or WhatsApp.',
    fullDescription:
      'Trained on your documents, not a generic model. WhatsApp, web widget or in-app, with flows designed around what people actually ask.',
    includes: [
      'Trained on your own documents',
      'Web, app and WhatsApp integration',
      'Conversation flow design',
      'Post-launch tuning and support',
    ],
    category: 'ai',
    slug: 'ai-chatbot',
  },
  {
    id: 'model-training',
    icon: 'Brain',
    title: 'AI Model Training & Fine-Tuning',
    shortDescription:
      'Fine-tuning and RAG pipelines on your data, not a generic API call.',
    fullDescription:
      'Fine-tuning on your proprietary data, plus RAG pipelines that answer from your own sources. For when an off-the-shelf API is not specific enough.',
    includes: [
      'Dataset preparation',
      'Fine-tuning on open and hosted models',
      'RAG retrieval pipelines',
      'Evaluation and deployment',
    ],
    category: 'ai',
    slug: 'model-training',
  },
  {
    id: 'web-development',
    icon: 'Globe',
    title: 'Web Development',
    shortDescription:
      'Next.js platforms and marketing sites, built to load fast and rank.',
    fullDescription:
      'From a landing page to a full SaaS platform. Server-rendered where it helps ranking, and measured against Core Web Vitals before handover.',
    includes: [
      'Marketing sites and web apps',
      'Full-stack with Supabase or Postgres',
      'Performance and SEO',
      'Ongoing maintenance',
    ],
    category: 'web',
    slug: 'web-development',
  },
  {
    id: 'mobile-development',
    icon: 'Smartphone',
    title: 'Mobile App Development',
    shortDescription:
      'Cross-platform mobile apps for iOS and Android, built with React Native for maximum reach.',
    fullDescription:
      'One React Native codebase, shipped to both the App Store and Play. Native modules where a cross-platform answer would not hold up.',
    includes: [
      'One React Native codebase',
      'iOS and Android release',
      'Offline and push support',
      'Store submission',
    ],
    category: 'mobile',
    slug: 'mobile-development',
  },
  {
    id: 'graphic-design',
    icon: 'Palette',
    title: 'Graphic Design & Branding',
    shortDescription:
      'Complete brand identity systems and creative design that makes your business stand out.',
    fullDescription:
      'Identity systems built to survive contact with code: logos, type, colour, and the interface work that uses them.',
    includes: [
      'Logo and identity systems',
      'Brand guidelines',
      'UI and interface design',
      'Social and marketing assets',
    ],
    category: 'design',
    slug: 'graphic-design',
  },
]
