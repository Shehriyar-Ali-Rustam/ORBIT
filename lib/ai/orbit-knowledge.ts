export interface KnowledgeEntry {
  id: string
  category: string
  content: string
  keywords: string[]
}

export const orbitKnowledge: KnowledgeEntry[] = [
  // ── Services: AI Chatbot ──────────────────────────────────────
  {
    id: 'svc-chatbot',
    category: 'services',
    content:
      'Orbit builds custom AI chatbots powered by OpenAI, Gemini, and custom models. We design, build, and deploy intelligent chatbots that understand your business context and engage your customers naturally 24/7. Services include: custom-trained chatbots for your business domain, website/app/platform integration, WhatsApp and Telegram bots, conversation flow design and optimization, analytics dashboard and performance tracking, and post-launch support with model updates. Starting from $200 for basic bots, $500-$2,000 for custom business bots, and custom pricing for enterprise solutions.',
    keywords: [
      'chatbot', 'ai', 'bot', 'assistant', 'whatsapp', 'telegram', 'voice',
      'customer support', 'automation', 'conversational', 'chat',
    ],
  },
  {
    id: 'svc-chatbot-detail',
    category: 'services',
    content:
      'Our AI chatbot development process: 1) Discovery — we analyze your business needs, target audience, and existing support workflows. 2) Design — we create conversation flows, define intents, and plan integrations. 3) Build — we develop and train the chatbot on your data, test across scenarios. 4) Deploy — we integrate with your website, app, or messaging platform. 5) Optimize — we monitor performance, refine responses, and improve accuracy over time. Typical timeline: 2-4 weeks for standard chatbots, 4-8 weeks for custom AI solutions with training.',
    keywords: [
      'chatbot process', 'how chatbot', 'chatbot timeline', 'build chatbot',
      'chatbot development', 'chatbot steps',
    ],
  },

  // ── Services: AI Model Training ───────────────────────────────
  {
    id: 'svc-model-training',
    category: 'services',
    content:
      'Orbit provides AI model training and fine-tuning services. We go beyond off-the-shelf AI — our team fine-tunes language models on your proprietary data, building RAG systems and custom AI pipelines for your specific industry. Services include: custom dataset collection and preparation, GPT/LLaMA/open-source model fine-tuning, RAG (Retrieval-Augmented Generation) systems, voice-activated AI assistant development, model evaluation and optimization, and API deployment and integration. Pricing: $1,000-$5,000 for fine-tuning projects, $3,000-$15,000 for full RAG system builds.',
    keywords: [
      'training', 'fine-tune', 'model', 'rag', 'llm', 'dataset', 'custom ai',
      'machine learning', 'deep learning', 'gpt', 'llama', 'ai model',
    ],
  },

  // ── Services: Web Development ─────────────────────────────────
  {
    id: 'svc-web',
    category: 'services',
    content:
      'Orbit builds modern, high-performance websites and web applications using Next.js 14, React, TypeScript, and Tailwind CSS. We deliver fast, scalable, and beautiful web experiences — from landing pages to full-stack SaaS platforms. Services include: custom websites and landing pages, full-stack web applications, e-commerce solutions, CMS integration (Sanity, Contentful), performance optimization and SEO, and ongoing maintenance. Pricing: landing pages from $300 (1-2 weeks), mid-sized apps $2,000-$10,000 (4-8 weeks), enterprise/SaaS custom-quoted.',
    keywords: [
      'website', 'web', 'nextjs', 'react', 'frontend', 'fullstack', 'ecommerce',
      'landing page', 'saas', 'web app', 'next.js', 'typescript', 'tailwind',
    ],
  },

  // ── Services: Mobile Development ──────────────────────────────
  {
    id: 'svc-mobile',
    category: 'services',
    content:
      'Orbit develops cross-platform mobile apps for iOS and Android using React Native. We create apps that feel native on both platforms, saving time and budget without compromising quality. Services include: React Native cross-platform apps (iOS + Android), native iOS and Android development, UI/UX design and prototyping, API and backend integration, App Store and Google Play submission, and post-launch support. Pricing: simple apps from $1,500, feature-rich apps $5,000-$15,000, enterprise apps custom-quoted.',
    keywords: [
      'mobile', 'app', 'ios', 'android', 'react native', 'flutter',
      'cross-platform', 'app store', 'google play', 'mobile app',
    ],
  },

  // ── Services: Graphic Design ──────────────────────────────────
  {
    id: 'svc-design',
    category: 'services',
    content:
      'Orbit provides graphic design and complete brand identity services. Great products deserve great design. We create cohesive brand identities, stunning UI/UX designs, and marketing materials. Services include: logo design and complete brand identity, UI/UX design for web and mobile, social media creative design, pitch decks and business presentations, print and digital marketing materials, and brand guidelines documentation. The founder is a Fiverr Level 1 Seller in design. Pricing: logos from $100, full brand identity $500-$2,000, UI/UX packages from $800.',
    keywords: [
      'design', 'logo', 'brand', 'graphic', 'ui', 'ux', 'identity',
      'branding', 'creative', 'visual', 'pitch deck', 'social media',
    ],
  },

  // ── Pricing & Packages ────────────────────────────────────────
  {
    id: 'pricing-overview',
    category: 'pricing',
    content:
      'Orbit pricing overview: We offer flexible pricing based on project scope. Landing pages: from $300 (1-2 weeks). AI chatbots: from $200 (basic), $500-$2,000 (custom). Web applications: $2,000-$10,000. Mobile apps: $1,500-$15,000. AI model training: $1,000-$15,000. Logo/branding: from $100. Full brand identity: $500-$2,000. Enterprise solutions: custom-quoted. We also offer hourly rates for ongoing work. Every project includes 30 days of free bug fixes after launch. Payment terms: 50% upfront, 50% on delivery for most projects.',
    keywords: [
      'price', 'cost', 'rate', 'charge', 'budget', 'pricing', 'package',
      'how much', 'affordable', 'quote', 'estimate', 'payment', 'fee', 'money',
      'expensive', 'cheap', 'dollar', 'usd',
    ],
  },

  // ── Process & Timeline ────────────────────────────────────────
  {
    id: 'process',
    category: 'process',
    content:
      'Orbit follows a 4-step process for every project: 1) DISCOVER — We learn about your business, goals, and requirements through in-depth consultation. Free consultation, no obligations. 2) DESIGN — We create wireframes, prototypes, and technical architecture tailored to your needs. You approve before we build. 3) BUILD — Our team develops your solution with agile methodology, regular progress updates, and milestone reviews. 4) LAUNCH — We deploy, test, and optimize your product for the best possible performance. Includes post-launch monitoring and 30 days of free support.',
    keywords: [
      'process', 'how', 'work', 'steps', 'methodology', 'timeline',
      'delivery', 'workflow', 'agile', 'how long', 'duration', 'time',
    ],
  },
  {
    id: 'timeline',
    category: 'process',
    content:
      'Typical project timelines at Orbit: Simple landing page — 1-2 weeks. Business website — 2-4 weeks. AI chatbot (standard) — 2-4 weeks. AI chatbot (custom trained) — 4-8 weeks. Web application — 4-8 weeks. Mobile app — 6-12 weeks. Full brand identity — 2-3 weeks. AI model fine-tuning — 3-6 weeks. RAG system — 4-8 weeks. Timelines may vary based on complexity and feedback cycles. We provide detailed timelines during the discovery phase.',
    keywords: [
      'timeline', 'how long', 'duration', 'weeks', 'time', 'delivery',
      'turnaround', 'deadline', 'schedule', 'when', 'fast',
    ],
  },

  // ── Team & Founder ────────────────────────────────────────────
  {
    id: 'founder',
    category: 'team',
    content:
      'Orbit was founded by Shehriyar Ali Rustam, a software engineering student from Pakistan. He is an AI/ML enthusiast and Fiverr Level 1 Seller with expertise in frontend development (Next.js, React, TypeScript), Python (AI/ML), graphic design, and OpenAI API integration. He started ORBIT as freelance projects on Fiverr and grew it into a full technology company. He personally oversees every project to ensure quality. GitHub: github.com/Shehriyar-Ali-Rustam. LinkedIn: linkedin.com/in/shehriyar-ali-rustam-516895246. Fiverr: fiverr.com/sellers/shehriyar01se.',
    keywords: [
      'founder', 'shehriyar', 'who', 'ceo', 'owner', 'leader', 'started',
      'created', 'built', 'behind',
    ],
  },
  {
    id: 'team',
    category: 'team',
    content:
      'The Orbit team: Team members at Orbit are called "Orbiters". Currently led by founder Shehriyar Ali Rustam (Lead Developer). Orbit is actively hiring: AI Engineers (Python, TensorFlow, PyTorch, NLP), UI/UX Designers (Figma, Adobe XD, prototyping), and Backend Developers (Node.js, PostgreSQL, AWS, Docker). Interested in joining? Visit the freelancer marketplace at /freelancers or email hello.theorbit@gmail.com.',
    keywords: [
      'team', 'orbiter', 'hiring', 'join', 'career', 'job', 'employee',
      'developer', 'engineer', 'designer', 'work at', 'positions',
    ],
  },

  // ── About & Company ───────────────────────────────────────────
  {
    id: 'about',
    category: 'about',
    content:
      'ORBIT is an AI-powered software solutions company. Tagline: "Engineered for the Future. Built for Today." Started as freelance projects on Fiverr and evolved into a growing technology company that combines AI innovation with full-service software development. Mission: To deliver world-class AI-powered software solutions that empower businesses to grow, innovate, and compete globally — regardless of their size or location. Vision: To become a globally recognized technology company from Pakistan — proving that innovation knows no borders.',
    keywords: [
      'about', 'orbit', 'company', 'who are you', 'what is orbit',
      'mission', 'vision', 'story', 'history',
    ],
  },
  {
    id: 'values',
    category: 'about',
    content:
      'Orbit core values: 1) Innovation — Pushing boundaries and embracing new technologies. We stay on the cutting edge. 2) Integrity — Honest, transparent, and client-first. No hidden fees, no surprises. 3) Excellence — Highest standards in every line of code and pixel. We don\'t ship half-baked work. 4) Impact — Building solutions that create real, measurable value for businesses.',
    keywords: [
      'values', 'culture', 'principles', 'believe', 'stand for',
      'integrity', 'innovation', 'excellence',
    ],
  },

  // ── Freelancer Marketplace ────────────────────────────────────
  {
    id: 'marketplace',
    category: 'platform',
    content:
      'Orbit has a freelancer marketplace where businesses can browse and hire vetted professionals. Freelancers on Orbit are called "Orbiters". Each freelancer is personally reviewed for quality, communication, and reliability. You can hire them for hourly or project-based work. Services available: web development, mobile apps, AI/ML, graphic design, content writing, and more. Visit /freelancers to browse talent, or /freelancers/sign-up to join as a seller.',
    keywords: [
      'freelancer', 'hire', 'talent', 'orbiter', 'marketplace', 'developer',
      'freelance', 'contractor', 'outsource', 'remote',
    ],
  },
  {
    id: 'marketplace-seller',
    category: 'platform',
    content:
      'Want to sell your services on Orbit? Join as a freelancer (Orbiter): 1) Sign up at /freelancers/sign-up. 2) Complete your profile and showcase your skills. 3) Create gigs with packages and pricing. 4) Get discovered by clients and start earning. Features: secure payments via Stripe, real-time messaging, order management dashboard, review system, and earnings tracking. No listing fees — Orbit only takes a small commission on completed orders.',
    keywords: [
      'sell', 'seller', 'gig', 'earn', 'join', 'register', 'sign up',
      'become freelancer', 'create gig', 'start selling',
    ],
  },

  // ── Contact & Getting Started ─────────────────────────────────
  {
    id: 'contact',
    category: 'contact',
    content:
      'Contact Orbit: Email: hello.theorbit@gmail.com. Based in Pakistan, serving clients globally. We respond within 24 hours. Currently accepting new projects. Visit /contact to send a message directly. For freelancer inquiries, visit /freelancers. Free initial consultation — no obligations. We\'re available on email and scheduled video calls.',
    keywords: [
      'contact', 'email', 'reach', 'talk', 'call', 'message', 'connect',
      'get in touch', 'consultation', 'meeting',
    ],
  },
  {
    id: 'get-started',
    category: 'contact',
    content:
      'How to get started with Orbit: 1) Reach out — Email us at hello.theorbit@gmail.com or visit /contact with a brief description of your project. 2) Free consultation — We\'ll schedule a call to understand your needs, goals, and budget. No obligations. 3) Proposal — We\'ll send a detailed proposal with scope, timeline, and pricing. 4) Kick off — Once approved, we start with 50% upfront and begin development immediately. You can also hire individual freelancers from our marketplace at /freelancers.',
    keywords: [
      'start', 'begin', 'get started', 'hire', 'project', 'quote',
      'proposal', 'consultation', 'onboard', 'kick off', 'work with',
    ],
  },

  // ── Portfolio / Case Studies ───────────────────────────────────
  {
    id: 'portfolio-overview',
    category: 'portfolio',
    content:
      'Orbit portfolio highlights — we have delivered projects across AI, web, mobile, and design: 1) Hello Kitty AI Voice Assistant — Wake-word activated AI assistant using ChatGPT and Gemini (Python, OpenAI API). 2) ORBIT Web Platform — This website, built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion. 3) AI Resume-Job Matcher — AI tool that scores resume-job compatibility using sentence transformers. 4) WearBlend — AI virtual try-on app using DALL-E 3 and Gemini. 5) Face Recognition Attendance System — Automated attendance with anti-spoofing. 6) Movie Recommendation Engine — Content-based recommender using TF-IDF. Visit /portfolio to see all projects with live demos and source code.',
    keywords: [
      'portfolio', 'projects', 'work', 'examples', 'case study', 'showcase',
      'built', 'delivered', 'previous work', 'show me',
    ],
  },
  {
    id: 'portfolio-ai',
    category: 'portfolio',
    content:
      'Orbit AI portfolio: Hello Kitty AI Voice Assistant — voice-activated personal AI assistant with wake word detection, conversation memory, switchable AI providers (ChatGPT/Gemini), adjustable voice speed. Built with Python, OpenAI API, SpeechRecognition, pyttsx3. AI Resume-Job Matcher — scores resume vs. job description compatibility (0-100%), detects missing skills, suggests improvements. Built with Python, Streamlit, FastAPI, Sentence Transformers. WearBlend — AI virtual try-on that generates realistic outfit photos using DALL-E 3 and Gemini. Face Recognition Attendance — multi-face detection with anti-spoofing (blink/movement detection).',
    keywords: [
      'ai project', 'ai work', 'ai portfolio', 'hello kitty', 'wearblend',
      'face recognition', 'resume matcher', 'voice assistant',
    ],
  },

  // ── Tech Stack ────────────────────────────────────────────────
  {
    id: 'tech-stack',
    category: 'technology',
    content:
      'Orbit tech stack: Frontend — Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion. Backend — Node.js, Python (FastAPI, Django). Databases — Supabase (PostgreSQL), Firebase, MongoDB. AI/ML — OpenAI API, Google Gemini, Groq (Llama 3.3), LangChain, Sentence Transformers, TensorFlow, PyTorch. Mobile — React Native. Design — Figma, Adobe Creative Suite. DevOps — Vercel, Railway, Docker, GitHub Actions. Auth — Clerk. Payments — Stripe.',
    keywords: [
      'tech', 'stack', 'technology', 'tools', 'framework', 'language',
      'python', 'javascript', 'next', 'react', 'supabase', 'firebase',
    ],
  },

  // ── Support & Guarantees ──────────────────────────────────────
  {
    id: 'support',
    category: 'support',
    content:
      'Orbit post-launch support: Every project includes 30 days of free bug fixes after launch. We also offer ongoing maintenance plans that include: hosting management, security patches, performance monitoring, feature additions, and content updates. Maintenance plans are available at competitive monthly rates. We use Slack, email, and scheduled calls for communication. We work across time zones for seamless collaboration with global clients.',
    keywords: [
      'support', 'maintenance', 'bug', 'fix', 'update', 'help',
      'after launch', 'warranty', 'guarantee', 'post-launch',
    ],
  },
  {
    id: 'nda-legal',
    category: 'support',
    content:
      'Orbit legal and confidentiality: Yes, we sign NDAs (Non-Disclosure Agreements) and any other legal agreements before starting projects. Your ideas and data are always protected. We take confidentiality seriously. We also provide clear contracts with defined scope, timelines, and deliverables. Payment terms: typically 50% upfront, 50% on delivery. Milestone-based payments available for larger projects.',
    keywords: [
      'nda', 'confidential', 'legal', 'contract', 'agreement', 'privacy',
      'secure', 'safe', 'trust', 'protection', 'intellectual property',
    ],
  },

  // ── FAQs ──────────────────────────────────────────────────────
  {
    id: 'faq-revisions',
    category: 'faq',
    content:
      'Orbit revision policy: We include 2-3 rounds of revisions in every project. We want you to be 100% satisfied. During the design phase, you approve wireframes and prototypes before we build. During development, we share progress regularly so you can give feedback early. Major scope changes after development starts may require an updated quote.',
    keywords: [
      'revision', 'change', 'modify', 'feedback', 'iteration', 'update',
      'not happy', 'redo', 'adjust', 'satisfied',
    ],
  },
  {
    id: 'faq-communication',
    category: 'faq',
    content:
      'How Orbit communicates with clients: We use email, Slack, and scheduled video calls. You get regular progress updates (usually weekly). For urgent matters, response time is within 24 hours. We work across time zones — our Pakistan-based team serves clients in the US, UK, UAE, Canada, and worldwide. All communication is in English (we also speak Urdu).',
    keywords: [
      'communication', 'update', 'respond', 'time zone', 'meeting',
      'call', 'slack', 'response time', 'available', 'hours',
    ],
  },
  {
    id: 'faq-location',
    category: 'faq',
    content:
      'Orbit is headquartered in Pakistan with a remote-first team serving clients globally. We work across time zones — US, UK, UAE, Canada, Europe, and beyond. Our remote-first approach means we hire the best talent regardless of location. We maintain consistent communication through Slack, email, and scheduled calls.',
    keywords: [
      'location', 'where', 'based', 'pakistan', 'remote', 'country',
      'office', 'global', 'international', 'timezone',
    ],
  },

  // ── Orbit AI Platform ─────────────────────────────────────────
  {
    id: 'orbit-ai',
    category: 'orbit-ai',
    content:
      'Orbit AI is the intelligent workspace built into the Orbit platform. It includes 7 free tools: 1) Orbit Chat — general AI assistant for any question. 2) Orbit Code — write, debug, and explain code in any language. 3) Orbit Write — create marketing copy, blogs, emails, and content. 4) Orbit Translate — professional English and Urdu translation. 5) Orbit Resume — build ATS-optimized resumes and cover letters. 6) Orbit Freelance — optimize Fiverr gigs and Upwork proposals. 7) Orbit Image — generate AI images for free. Powered by Llama 3.3 70B via Groq (fast, free) with Gemini as backup. Visit /ai to try all tools.',
    keywords: [
      'orbit ai', 'tools', 'features', 'what can you do', 'help', 'capabilities',
      'ai tools', 'free ai', 'workspace',
    ],
  },

  // ── Testimonials ──────────────────────────────────────────────
  {
    id: 'testimonials',
    category: 'social-proof',
    content:
      'What clients say about Orbit: "Exceptional work, fast delivery, and great communication. The team at Orbit exceeded our expectations and delivered a product that truly transformed our business." — John Smith, CTO, TechStartup Inc. "The AI chatbot Orbit built completely transformed our customer support. Response times dropped by 80% and customer satisfaction scores are at an all-time high." — Sarah Johnson, Product Manager, RetailCo. "Professional team with truly world-class quality. They understood our vision perfectly and delivered a brand identity that positions us for global growth." — Ahmed Khan, Founder, DigitalAgency.',
    keywords: [
      'review', 'testimonial', 'client', 'feedback', 'rating', 'recommend',
      'experience', 'say about', 'opinion', 'reputation', 'trust',
    ],
  },

  // ── Competitive Edge ──────────────────────────────────────────
  {
    id: 'why-orbit',
    category: 'about',
    content:
      'Why choose Orbit over others? 1) AI-first approach — AI isn\'t an add-on, it\'s built into everything we do. 2) Full-service — from design to development to deployment, we handle everything. 3) Cost-effective — Pakistan-based team offers world-class quality at competitive rates (60-70% less than US/UK agencies). 4) Founder-led — Shehriyar personally oversees every project, ensuring quality. 5) Modern tech stack — Next.js 14, React, TypeScript, Tailwind — no outdated WordPress templates. 6) Free post-launch support — 30 days of bug fixes included. 7) Fiverr track record — Level 1 Seller with proven client satisfaction.',
    keywords: [
      'why orbit', 'different', 'better', 'advantage', 'compare', 'vs',
      'choose', 'unique', 'special', 'stand out', 'competitor',
    ],
  },

  // ── Industry Focus ────────────────────────────────────────────
  {
    id: 'industries',
    category: 'about',
    content:
      'Industries Orbit serves: We work with businesses across all sectors — startups, SMEs, and enterprises. Key industries: SaaS and technology startups, e-commerce and retail, healthcare and medical tech, education and EdTech, fintech and finance, real estate, agencies and creative studios. We adapt our solutions to your specific industry needs and regulations. Whether you need a customer-facing chatbot, an internal tool, or a complete digital transformation — we have experience.',
    keywords: [
      'industry', 'sector', 'startup', 'ecommerce', 'healthcare', 'education',
      'fintech', 'saas', 'enterprise', 'small business', 'sme',
    ],
  },
]
