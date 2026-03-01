export interface KnowledgeEntry {
  id: string
  category: string
  content: string
  keywords: string[]
}

export const orbitKnowledge: KnowledgeEntry[] = [
  {
    id: '1',
    category: 'services',
    content:
      'Orbit builds custom AI chatbots powered by OpenAI, Gemini, and custom models. Services include website chatbots, WhatsApp bots, Telegram bots, voice assistants, and AI integrations. Starting from $200.',
    keywords: [
      'chatbot', 'ai', 'bot', 'assistant', 'whatsapp', 'telegram', 'voice',
    ],
  },
  {
    id: '2',
    category: 'services',
    content:
      'Orbit provides AI model training and fine-tuning services. We train on custom datasets, build RAG systems, fine-tune GPT and LLaMA, and deploy production AI solutions for businesses.',
    keywords: [
      'training', 'fine-tune', 'model', 'rag', 'llm', 'dataset', 'custom ai',
    ],
  },
  {
    id: '3',
    category: 'services',
    content:
      'Orbit builds websites and web apps using Next.js, React, TypeScript. Services: landing pages, full-stack apps, e-commerce, dashboards. From $300.',
    keywords: [
      'website', 'web', 'nextjs', 'react', 'frontend', 'fullstack', 'ecommerce',
    ],
  },
  {
    id: '4',
    category: 'services',
    content:
      'Orbit develops mobile apps for iOS and Android using React Native. Services: UI/UX design, API integration, App Store submission.',
    keywords: ['mobile', 'app', 'ios', 'android', 'react native', 'flutter'],
  },
  {
    id: '5',
    category: 'services',
    content:
      'Orbit provides graphic design and brand identity: logo design, UI/UX, social media graphics, pitch decks, print materials. Founder is a Fiverr Level 1 Seller in design.',
    keywords: ['design', 'logo', 'brand', 'graphic', 'ui', 'ux', 'identity'],
  },
  {
    id: '6',
    category: 'team',
    content:
      'Orbit was founded by Shehriyar Ali Rustam, a software engineering student from Pakistan and AI/ML enthusiast. He is a Fiverr Level 1 Seller. GitHub: github.com/Shehriyar-Ali-Rustam. LinkedIn: linkedin.com/in/shehriyar-ali-rustam-516895246. Fiverr: fiverr.com/sellers/shehriyar01se. Team members at Orbit are called Orbiters.',
    keywords: ['founder', 'shehriyar', 'team', 'orbiter', 'who', 'about'],
  },
  {
    id: '7',
    category: 'platform',
    content:
      'Orbit has a freelancer marketplace. Businesses can hire vetted developers, designers, and AI specialists from the Orbit network. Freelancers are called Orbiters. Visit /freelancers to browse talent.',
    keywords: [
      'freelancer', 'hire', 'talent', 'orbiter', 'marketplace', 'developer',
    ],
  },
  {
    id: '8',
    category: 'contact',
    content:
      'Contact Orbit at hello@orbittech.io. Based in Pakistan, serving clients globally. Response within 24 hours. Currently accepting new projects. Visit /contact.',
    keywords: ['contact', 'email', 'hire', 'project', 'quote', 'reach', 'price'],
  },
  {
    id: '9',
    category: 'orbit-ai',
    content:
      'Orbit AI is the intelligent workspace with 7 tools: Chat Assistant, Code Assistant, Content Writer, Urdu/English Translator, Resume Builder, Freelance Tools, Image Generator. Powered by Llama 3.3 via Groq (free) with Gemini as backup.',
    keywords: [
      'orbit ai', 'tools', 'features', 'what can you do', 'help', 'capabilities',
    ],
  },
]
