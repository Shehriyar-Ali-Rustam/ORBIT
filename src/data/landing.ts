/**
 * Content for the v.l.01 landing page — the destination for the QR code on the
 * ORBIT business card. Kept separate from the marketing-site data so the two
 * can drift independently.
 */

const PHONE = '+92 327 5362412'

export const CARD = {
  /** Full legal name: titles, vCard, structured data. */
  company: 'Orbit Innovations',
  legalName: 'Orbit Innovations',
  /** Short form for running copy and the wordmark. */
  shortName: 'Orbit',
  tagline: 'AI, web and mobile software studio',
  phone: PHONE,
  phoneHref: `tel:${PHONE.replace(/\s/g, '')}`,
  whatsappHref: `https://wa.me/${PHONE.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    "Hi Orbit Innovations, I scanned your card and I'd like to talk about a project."
  )}`,
  email: 'info@orbitpk.com',
  emailHref: 'mailto:info@orbitpk.com?subject=Project%20enquiry%20from%20your%20card',
  site: 'orbitpk.com',
  siteHref: 'https://orbitpk.com',
  location: 'Islamabad, Pakistan',
  locationDetail: 'Islamabad Capital Territory · working remote worldwide',
  hours: 'Mon to Sat · 10:00 to 19:00 PKT (UTC+5)',
  vcardHref: '/api/vcard',
} as const

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shehriyar-ali-rustam-516895246' },
  { label: 'GitHub', href: 'https://github.com/Shehriyar-Ali-Rustam' },
  { label: 'Fiverr', href: 'https://www.fiverr.com/users/shehriyar01se' },
] as const

/** Icon names map to lucide-react exports. See Capabilities.tsx. */
export const CAPABILITIES = [
  {
    icon: 'Bot',
    title: 'AI Chatbots',
    blurb: 'Assistants trained on your own docs, wired into your site or WhatsApp.',
    href: '/services#ai-chatbot',
    image: '/images/landing/cap-chatbots.jpg',
    imageAlt: 'Messaging apps open on a phone screen',
  },
  {
    icon: 'Brain',
    title: 'Model Training',
    blurb: 'Fine-tuning and RAG pipelines on your data, not a generic API call.',
    href: '/services#model-training',
    image: '/images/landing/cap-models.jpg',
    imageAlt: 'Analytics dashboard open on a laptop',
  },
  {
    icon: 'Globe',
    title: 'Web Platforms',
    blurb: 'Next.js products and marketing sites built to load fast and rank.',
    href: '/services#web-development',
    image: '/images/landing/cap-web.jpg',
    imageAlt: 'A website open on a laptop at a bright desk',
  },
  {
    icon: 'Smartphone',
    title: 'Mobile Apps',
    blurb: 'One React Native codebase shipped to both App Store and Play.',
    href: '/services#mobile-development',
    image: '/images/landing/cap-mobile.jpg',
    imageAlt: 'App icons on a phone home screen',
  },
  {
    icon: 'Palette',
    title: 'Brand & Design',
    blurb: 'Logos, identity systems and interface design that survive contact with code.',
    href: '/services#graphic-design',
    image: '/images/landing/cap-design.jpg',
    imageAlt: 'Colour swatches and sketches on a designer desk',
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
    body: 'Twenty minutes. You describe the problem, we say honestly whether it is ours to build.',
  },
  {
    n: '02',
    title: 'Scope',
    body: 'What gets built, what it costs, what date it lands. Fixed before any money moves.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'A working link in week one, a demo every week after.',
  },
  {
    n: '04',
    title: 'Hand over',
    body: 'Code, accounts and docs go to you. Support afterwards is optional.',
  },
] as const
