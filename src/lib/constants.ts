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
      { label: 'Our Story', href: '/about#story', description: 'How ORBIT started' },
      { label: 'People Behind Orbit', href: '/about#founders', description: 'Meet the founders' },
      { label: 'Mission & Vision', href: '/about#mission', description: 'What we stand for' },
      { label: 'Our Values', href: '/about#values', description: 'How we work' },
      { label: 'Careers', href: '/careers', description: 'Internships and open roles' },
      { label: 'Blog', href: '/blog', description: 'Notes from the build' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'AI Chatbots', href: '/services#ai-chatbot', description: 'Custom-trained AI assistants' },
      { label: 'Model Training', href: '/services#model-training', description: 'Custom ML and AI models' },
      { label: 'Web Development', href: '/services#web-development', description: 'Next.js, full-stack apps' },
      { label: 'Mobile Apps', href: '/services#mobile-development', description: 'Android and cross-platform' },
      { label: 'Graphic Design', href: '/services#graphic-design', description: 'Brand, UI/UX, visuals' },
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
  {
    label: 'Products',
    href: '/ai',
    children: [
      { label: 'Orbit AI', href: '/ai', description: 'Built-in AI tools · coming soon' },
      { label: 'Freelancer Marketplace', href: '/freelancers', description: 'Hire vetted Orbiters · coming soon' },
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
  email: 'info@orbitpk.com',
  location: 'Pakistan - Remote First',
  phone: '+92 327 5362412',
}
