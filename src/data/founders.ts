import { TeamMember } from '@/types'

export const founders: TeamMember[] = [
  {
    id: 'shehriyar',
    name: 'Shehriyar Ali Rustam',
    role: 'Founder',
    bio: 'Sets the technical direction and leads product and brand. An AI/ML enthusiast and Fiverr Level 1 Seller, he builds with Next.js, React, and Python and shapes how everything the studio ships looks and feels.',
    photo: '/images/team/shehriyar.webp',
    skills: [],
    linkedin: 'https://www.linkedin.com/in/shehriyar-ali-rustam-516895246',
    isFounder: true,
  },
  {
    id: 'saqib',
    name: 'Saqib Nawaz Khan',
    role: 'Co-Founder',
    bio: 'Builds the mobile and Android side of the studio and drives project delivery. He handles much of the coordination and operations, keeping client work moving and shipping on schedule.',
    photo: '/images/team/saqib.webp',
    skills: [],
    linkedin: 'https://www.linkedin.com/in/saqib-nawaz-khan-2679553aa/',
    isFounder: true,
  },
  {
    id: 'abdul-ahad',
    name: 'Abdul Ahad',
    role: 'Co-Founder',
    bio: 'Builds the web and product work, turning designs into fast, production-ready applications. He keeps day-to-day execution on track across the studio\'s projects.',
    photo: '/images/team/abdul-ahad.webp',
    skills: [],
    linkedin: 'https://www.linkedin.com/in/abdul-ahad-bb8777417/',
    isFounder: true,
  },
]

// The leadership team beyond the founders. Both run outreach: the first
// conversation a new client has with Orbit Innovations is usually with one of
// them. Photos are placeholders (letter avatars) until real ones are added;
// LinkedIn links are placeholders (#).
export const teamMembers: TeamMember[] = [
  {
    id: 'moiz-danishmand',
    name: 'Moiz Danishmand',
    role: 'Outreach Lead',
    bio: 'Runs outreach and marketing across the studio - brand, campaigns, and the conversations that turn into projects. Shapes how Orbit Innovations shows up, online and off.',
    photo: '',
    skills: [],
    linkedin: '#',
  },
  {
    id: 'musa-khan',
    name: 'Musa Khan',
    role: 'Outreach Lead',
    bio: 'Runs client outreach and partnerships - meeting prospective clients, building the relationships behind new work, and keeping the studio in front of the right people.',
    photo: '',
    skills: [],
    linkedin: '#',
  },
]

// Everyone, founders first.
export const fullTeam: TeamMember[] = [...founders, ...teamMembers]
