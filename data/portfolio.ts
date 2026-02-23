import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'hello-kitty-ai',
    slug: 'hello-kitty-ai-assistant',
    title: 'Hello Kitty AI Voice Assistant',
    category: 'ai',
    shortDescription:
      'Wake-word activated personal AI assistant powered by ChatGPT and Google Gemini',
    fullDescription:
      'A voice-activated personal AI assistant inspired by Siri and Alexa. Say "Hello Kitty" to activate, ask anything, and receive intelligent spoken responses. Features wake word detection, speech-to-text, AI-powered responses via OpenAI or Gemini, text-to-speech output, and persistent conversation memory.',
    coverImage: '/images/portfolio/hello-kitty-ai.jpg',
    images: ['/images/portfolio/hello-kitty-ai.jpg'],
    techStack: ['Python', 'OpenAI API', 'Google Gemini', 'SpeechRecognition', 'pyttsx3'],
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/Personal-Assistant-Hello-Kitty-',
    featured: true,
    completedAt: '2024-08-15',
  },
  {
    id: 'orbit-web-platform',
    slug: 'orbit-web-platform',
    title: 'Orbit Web Platform',
    category: 'web',
    shortDescription:
      'Full-stack Next.js platform with AI-powered features and modern glassmorphism design',
    fullDescription:
      'The very website you are browsing. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features a complete design system, API integrations, rate limiting, and enterprise-grade security headers. A showcase of what Orbit can build.',
    coverImage: '/images/portfolio/orbit-web-platform.jpg',
    images: ['/images/portfolio/orbit-web-platform.jpg'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    liveUrl: 'https://orbittech.io',
    featured: true,
    completedAt: '2024-11-01',
  },
  {
    id: 'medibot-healthcare',
    slug: 'medibot-healthcare',
    title: 'MediBot Healthcare Assistant',
    category: 'ai',
    shortDescription:
      'AI-powered healthcare customer support chatbot with medical knowledge base',
    fullDescription:
      'An intelligent healthcare chatbot designed for clinics and hospitals. MediBot handles appointment scheduling, symptom pre-screening, FAQ responses, and patient follow-ups. Trained on medical guidelines with built-in safety guardrails to escalate complex queries to human staff.',
    coverImage: '/images/portfolio/medibot-healthcare.jpg',
    images: ['/images/portfolio/medibot-healthcare.jpg'],
    techStack: ['Python', 'LangChain', 'OpenAI', 'FastAPI', 'PostgreSQL', 'Redis'],
    featured: true,
    completedAt: '2024-09-20',
  },
  {
    id: 'trackmate-fitness',
    slug: 'trackmate-fitness',
    title: 'TrackMate Fitness App',
    category: 'mobile',
    shortDescription: 'React Native fitness tracking app with AI-powered workout recommendations',
    fullDescription:
      'A comprehensive fitness tracking app built with React Native. TrackMate tracks workouts, nutrition, and progress with beautiful visualizations. The AI engine analyzes user patterns to suggest optimized workout plans and recovery schedules.',
    coverImage: '/images/portfolio/trackmate-fitness.jpg',
    images: ['/images/portfolio/trackmate-fitness.jpg'],
    techStack: ['React Native', 'TypeScript', 'Node.js', 'MongoDB', 'TensorFlow Lite'],
    featured: false,
    completedAt: '2024-07-10',
  },
  {
    id: 'nova-brand-identity',
    slug: 'nova-brand-identity',
    title: 'Nova Brand Identity',
    category: 'design',
    shortDescription: 'Complete brand identity system for a SaaS startup including logo and guidelines',
    fullDescription:
      'A complete brand identity package for Nova, a B2B SaaS startup. Includes logo design, color system, typography selection, business cards, social media templates, pitch deck design, and a comprehensive 40-page brand guidelines document.',
    coverImage: '/images/portfolio/nova-brand-identity.jpg',
    images: ['/images/portfolio/nova-brand-identity.jpg'],
    techStack: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'After Effects'],
    featured: false,
    completedAt: '2024-06-05',
  },
  {
    id: 'pulse-analytics',
    slug: 'pulse-analytics',
    title: 'Pulse Analytics Dashboard',
    category: 'web',
    shortDescription: 'Real-time analytics dashboard with live data streaming and interactive charts',
    fullDescription:
      'A real-time analytics dashboard for monitoring business KPIs. Features live WebSocket data streaming, interactive charts with drill-down capabilities, customizable widgets, PDF report generation, and role-based access control.',
    coverImage: '/images/portfolio/pulse-analytics.jpg',
    images: ['/images/portfolio/pulse-analytics.jpg'],
    techStack: ['Next.js', 'D3.js', 'WebSockets', 'PostgreSQL', 'Redis', 'Docker'],
    featured: false,
    completedAt: '2024-10-15',
  },
]
