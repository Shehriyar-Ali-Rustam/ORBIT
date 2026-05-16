export type NavLink = {
  label: string
  href: string
  children?: { label: string; href: string; description?: string }[]
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Story', href: '/about', description: 'How ORBIT started' },
      { label: 'People Behind Orbit', href: '/about', description: 'Meet the founders' },
      { label: 'Mission & Values', href: '/about', description: 'What we stand for' },
      { label: 'Join the Team', href: '/about', description: 'Open roles' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'AI & ML Solutions', href: '/services', description: 'Chatbots, models, integrations' },
      { label: 'Web Development', href: '/services', description: 'Next.js, full-stack apps' },
      { label: 'Mobile Apps', href: '/services', description: 'Android and cross-platform' },
      { label: 'Brand & Design', href: '/services', description: 'Identity, UI/UX, visuals' },
    ],
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    children: [
      { label: 'All Projects', href: '/portfolio', description: 'Everything we have shipped' },
      { label: 'AI Projects', href: '/portfolio', description: 'Chatbots and AI tools' },
      { label: 'Web Projects', href: '/portfolio', description: 'Websites and platforms' },
      { label: 'Mobile Projects', href: '/portfolio', description: 'Apps and prototypes' },
    ],
  },
  { label: 'Freelancers', href: '/freelancers' },
  {
    label: 'Orbit AI',
    href: '/ai',
    children: [
      { label: 'AI Chat', href: '/ai/chat', description: 'Conversational assistant' },
      { label: 'AI Write', href: '/ai/write', description: 'Content generation' },
      { label: 'AI Image', href: '/ai/image', description: 'Visuals from text' },
      { label: 'AI Code', href: '/ai/code', description: 'Code assistant' },
      { label: 'Resume Tools', href: '/ai/resume', description: 'Build and refine' },
      { label: 'Translate', href: '/ai/translate', description: 'Multi-language' },
      { label: 'Freelance Helper', href: '/ai/freelance', description: 'Pitch and proposal AI' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

export const SOCIAL_LINKS = {
  github: 'https://github.com/Shehriyar-Ali-Rustam',
  linkedin: 'https://www.linkedin.com/in/shehriyar-ali-rustam-516895246',
  fiverr: 'https://www.fiverr.com/users/shehriyar01se',
}

export const COMPANY = {
  name: 'Orbit',
  tagline: 'Engineered for the Future. Built for Today.',
  email: 'hello.theorbit@gmail.com',
  location: 'Pakistan — Remote First',
  phone: '+92 XXX XXXXXXX',
}
