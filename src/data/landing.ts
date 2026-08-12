/**
 * Content for the v.l.01 landing page — the destination for the QR code on the
 * ORBIT business card. Kept separate from the marketing-site data so the two
 * can drift independently.
 */

const PHONE = '+92 327 5362412'

export const CARD = {
  company: 'ORBIT',
  legalName: 'ORBIT',
  tagline: 'AI, web and mobile software studio',
  phone: PHONE,
  phoneHref: `tel:${PHONE.replace(/\s/g, '')}`,
  whatsappHref: `https://wa.me/${PHONE.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    "Hi ORBIT — I scanned your card and I'd like to talk about a project."
  )}`,
  email: 'info@orbitpk.com',
  emailHref: 'mailto:info@orbitpk.com?subject=Project%20enquiry%20from%20your%20card',
  site: 'orbitpk.com',
  siteHref: 'https://orbitpk.com',
  location: 'Islamabad, Pakistan',
  locationDetail: 'Islamabad Capital Territory · working remote worldwide',
  hours: 'Mon–Sat, 10:00–19:00 PKT (UTC+5)',
  vcardHref: '/api/vcard',
} as const

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shehriyar-ali-rustam-516895246' },
  { label: 'GitHub', href: 'https://github.com/Shehriyar-Ali-Rustam' },
  { label: 'Fiverr', href: 'https://www.fiverr.com/users/shehriyar01se' },
] as const

/** Icon names map to lucide-react exports — see Capabilities.tsx. */
export const CAPABILITIES = [
  {
    icon: 'Bot',
    title: 'AI Chatbots',
    blurb: 'Assistants trained on your own docs, wired into your site or WhatsApp.',
    href: '/services#ai-chatbot',
  },
  {
    icon: 'Brain',
    title: 'Model Training',
    blurb: 'Fine-tuning and RAG pipelines on your data, not a generic API call.',
    href: '/services#model-training',
  },
  {
    icon: 'Globe',
    title: 'Web Platforms',
    blurb: 'Next.js products and marketing sites built to load fast and rank.',
    href: '/services#web-development',
  },
  {
    icon: 'Smartphone',
    title: 'Mobile Apps',
    blurb: 'One React Native codebase shipped to both App Store and Play.',
    href: '/services#mobile-development',
  },
  {
    icon: 'Palette',
    title: 'Brand & Design',
    blurb: 'Logos, identity systems and interface design that survive contact with code.',
    href: '/services#graphic-design',
  },
] as const

export const STATS = [
  { value: '10', label: 'Projects shipped' },
  { value: '30', label: 'Five-star reviews' },
  { value: '8', label: 'Countries served' },
  { value: '24h', label: 'Reply window' },
] as const

export const PROCESS = [
  {
    n: '01',
    title: 'Call',
    body: 'Twenty minutes on the phone. You describe the problem, we tell you honestly whether we are the right people for it.',
  },
  {
    n: '02',
    title: 'Scope',
    body: 'A written breakdown: what gets built, what it costs, what date it lands. Fixed, before any money moves.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'You get a working link from week one and a demo every week after. No black box, no month of silence.',
  },
  {
    n: '04',
    title: 'Hand over',
    body: 'Code, accounts and documentation go to you. We stay on for support if you want it, not because you are locked in.',
  },
] as const
