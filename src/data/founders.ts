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

// The wider team beyond the founders. Photos are placeholders (letter
// avatars) until real ones are added; LinkedIn links are placeholders (#).
export const teamMembers: TeamMember[] = [
  {
    id: 'moiz-danishmand',
    name: 'Moiz Danishmand',
    role: 'Chief Marketing Officer',
    bio: 'Leads marketing across the studio - brand, social media, content, and campaigns. Shapes how ORBIT shows up online and drives the strategy behind reaching new clients.',
    photo: '',
    skills: [],
    linkedin: '#',
  },
  {
    id: 'maaz-karim',
    name: 'Maaz Karim',
    role: 'Business Development Executive',
    bio: 'Leads business development - meeting potential clients, building relationships, generating offline leads, and closing the deals that grow the studio.',
    photo: '',
    skills: [],
    linkedin: '#',
  },
  {
    id: 'azan-hayat',
    name: 'Azan Hayat',
    role: 'Digital Marketing Specialist',
    bio: 'Drives online growth through paid advertising on Google and Meta, online client acquisition, lead generation, and campaign optimization.',
    photo: '',
    skills: [],
    linkedin: '#',
  },
]

// Everyone, founders first.
export const fullTeam: TeamMember[] = [...founders, ...teamMembers]
