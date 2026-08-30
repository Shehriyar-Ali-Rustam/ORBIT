import { Service } from '@/types'

export const services: Service[] = [
  {
    id: 'ai-chatbot',
    icon: 'Bot',
    title: 'AI Chatbot Development',
    shortDescription:
      'Assistants trained on your own documents and wired into your site, app or WhatsApp.',
    fullDescription:
      'We design, build, and deploy intelligent chatbots that understand your business context and engage your customers naturally. From WhatsApp bots to website widgets, our chatbots are trained on your data to provide accurate, helpful responses 24/7.',
    includes: [
      'Custom-trained chatbots for your business domain',
      'Website, app, and platform integration',
      'WhatsApp, Telegram, and messaging bots',
      'Conversation flow design and optimization',
      'Analytics dashboard and performance tracking',
      'Post-launch support and model updates',
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
      'We go beyond off-the-shelf AI. Our team fine-tunes language models on your proprietary data, building RAG systems and custom AI pipelines that deliver results specific to your industry and use case.',
    includes: [
      'Custom dataset collection and preparation',
      'GPT, LLaMA, and open-source model fine-tuning',
      'RAG (Retrieval-Augmented Generation) systems',
      'Voice-activated AI assistant development',
      'Model evaluation, testing, and optimization',
      'Deployment and API integration',
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
      'From a landing page to a full SaaS platform. Server-rendered where it helps ranking, measured against Core Web Vitals before handover, and accessible enough to pass an audit rather than just look like it would.',
    includes: [
      'Custom websites and landing pages',
      'Full-stack web applications',
      'E-commerce solutions',
      'CMS integration (Sanity, Contentful)',
      'Performance optimization and SEO',
      'Ongoing maintenance and support',
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
      'We create mobile applications that users love. Using React Native, we deliver cross-platform apps that feel native on both iOS and Android, saving you time and budget without compromising quality.',
    includes: [
      'React Native cross-platform apps (iOS + Android)',
      'Native iOS and Android development',
      'UI/UX design and prototyping',
      'API and backend integration',
      'App Store and Google Play submission',
      'Post-launch support and updates',
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
      'Great products deserve great design. We create cohesive brand identities, stunning UI/UX designs, and marketing materials that communicate your value and leave a lasting impression.',
    includes: [
      'Logo design and complete brand identity',
      'UI/UX design for web and mobile',
      'Social media creative design',
      'Pitch decks and business presentations',
      'Print and digital marketing materials',
      'Brand guidelines documentation',
    ],
    category: 'design',
    slug: 'graphic-design',
  },
]
