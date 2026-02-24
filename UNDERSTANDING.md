# ORBIT — Complete Project Documentation

> A developer's guide to understanding every part of the ORBIT website.

---

## Table of Contents

1. [What is ORBIT?](#what-is-orbit)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [How the App Works](#how-the-app-works)
5. [Configuration Files](#configuration-files)
6. [Design System](#design-system)
7. [Theme System (Dark/Light)](#theme-system-darklight)
8. [Pages & Routes](#pages--routes)
9. [Components Breakdown](#components-breakdown)
10. [AI Chatbot](#ai-chatbot)
11. [Forms & Validation](#forms--validation)
12. [API Routes](#api-routes)
13. [Data Files](#data-files)
14. [Custom Hooks](#custom-hooks)
15. [Utility Functions](#utility-functions)
16. [Environment Variables](#environment-variables)
17. [How to Add/Change Things](#how-to-addchange-things)

---

## What is ORBIT?

ORBIT is a company website for an AI-powered software solutions business. It showcases services, portfolio projects, team members, and a freelancer marketplace. It also has a built-in AI chatbot powered by Google Gemini that can answer questions about the company.

**Key features:**
- 8 pages (Home, About, Services, Portfolio, Freelancers, Contact, Privacy, Terms)
- AI chatbot widget on every page
- Dark/Light theme toggle
- Contact form and freelancer application form
- Animated UI with smooth transitions
- Fully responsive (works on mobile, tablet, desktop)
- SEO optimized with Open Graph and Twitter cards

---

## Tech Stack

| Technology | What it does |
|---|---|
| **Next.js 14** | The React framework — handles routing, server rendering, API routes |
| **TypeScript** | Type-safe JavaScript — catches errors before they happen |
| **Tailwind CSS v3** | Utility-first CSS — all styling is done with class names |
| **Framer Motion** | Animation library — handles all the smooth transitions and hover effects |
| **Zod v4** | Schema validation — validates form inputs on both client and server |
| **React Hook Form** | Form library — manages form state, submission, and error messages |
| **Lucide React** | Icon library — provides all the icons used across the site |
| **Google Generative AI** | Gemini API — powers the AI chatbot |
| **Resend** | Email service — sends form submissions via email (ready but not active) |
| **Upstash Redis** | Rate limiting — prevents spam on form submissions (ready but not active) |

---

## Project Structure

```
ORBIT/
├── app/                          # All pages and API routes (Next.js App Router)
│   ├── layout.tsx                # Root layout — wraps every page
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles + theme CSS variables
│   ├── loading.tsx               # Loading spinner (shown during page transitions)
│   ├── error.tsx                 # Error page (shown when something crashes)
│   ├── not-found.tsx             # 404 page
│   ├── about/page.tsx            # About page
│   ├── services/page.tsx         # Services page
│   ├── portfolio/
│   │   ├── page.tsx              # Portfolio listing page
│   │   └── [slug]/page.tsx       # Individual project page (dynamic route)
│   ├── freelancers/
│   │   ├── page.tsx              # Freelancers listing page
│   │   └── apply/page.tsx        # Freelancer application page
│   ├── contact/page.tsx          # Contact page
│   ├── privacy/page.tsx          # Privacy policy
│   ├── terms/page.tsx            # Terms of service
│   └── api/                      # Backend API routes
│       ├── chat/route.ts         # Gemini AI chatbot endpoint
│       ├── contact/route.ts      # Contact form endpoint
│       └── freelancer/route.ts   # Freelancer application endpoint
│
├── components/
│   ├── ThemeProvider.tsx          # Dark/Light theme context provider
│   ├── layout/                   # Shared layout components
│   │   ├── Navbar.tsx            # Navigation bar (appears on every page)
│   │   ├── Footer.tsx            # Footer (appears on every page)
│   │   └── PageWrapper.tsx       # Fade-in animation wrapper for pages
│   ├── ui/                       # Reusable UI building blocks
│   │   ├── Button.tsx            # Button (4 variants, 3 sizes, loading state)
│   │   ├── Card.tsx              # Card container with hover animation
│   │   ├── Badge.tsx             # Small label/tag component
│   │   ├── Modal.tsx             # Popup modal with backdrop
│   │   ├── SectionHeading.tsx    # Large heading for sections
│   │   ├── SectionLabel.tsx      # Small orange label above headings
│   │   ├── AnimatedCounter.tsx   # Number that counts up when visible
│   │   ├── Skeleton.tsx          # Loading placeholder
│   │   ├── GlowDot.tsx           # Pulsing status indicator dot
│   │   └── Divider.tsx           # Horizontal line separator
│   ├── chat/                     # AI Chatbot components
│   │   ├── ChatWidget.tsx        # Main wrapper (controls open/close)
│   │   ├── ChatBubble.tsx        # Floating orange button (bottom-right)
│   │   ├── ChatWindow.tsx        # Chat panel (header, messages, input)
│   │   └── ChatMessage.tsx       # Individual message bubble
│   ├── forms/                    # Form components
│   │   ├── ContactForm.tsx       # Contact page form
│   │   └── FreelancerApplyForm.tsx # Freelancer application form
│   └── sections/                 # Page-specific sections
│       ├── home/                 # 8 sections for the home page
│       ├── about/                # 5 sections for the about page
│       ├── services/             # 4 sections for the services page
│       ├── portfolio/            # 4 components for the portfolio page
│       ├── freelancers/          # 5 sections for the freelancers page
│       └── contact/              # 3 sections for the contact page
│
├── data/                         # Static content data (like a mini database)
│   ├── services.ts               # 5 services
│   ├── portfolio.ts              # 6 portfolio projects
│   ├── team.ts                   # 4 team members (1 real + 3 "coming soon")
│   ├── freelancers.ts            # 6 freelancer profiles
│   ├── testimonials.ts           # 3 client testimonials
│   └── faqs.ts                   # 6 FAQ items
│
├── hooks/                        # Custom React hooks
│   ├── useChat.ts                # Chat state management + streaming
│   ├── useCounter.ts             # Animated counting hook
│   ├── useInView.ts              # Detects when element is visible
│   ├── useMediaQuery.ts          # Responsive breakpoint detection
│   └── useScrollY.ts             # Tracks scroll position
│
├── lib/                          # Utility functions and configs
│   ├── utils.ts                  # cn() helper, formatDate, slugify, truncate
│   ├── constants.ts              # Nav links, social links, company info
│   ├── validations.ts            # Zod schemas for forms
│   ├── chat-context.ts           # AI chatbot system prompt
│   ├── email.ts                  # Email sending functions (Resend)
│   └── ratelimit.ts              # Rate limiting setup (Upstash)
│
├── types/
│   └── index.ts                  # TypeScript interfaces for all data types
│
├── public/                       # Static assets
│   ├── logo.png                  # ORBIT logo
│   ├── logo1.png                 # Alternative logo
│   └── images/team/
│       └── shehriyar.png         # Founder photo
│
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── .env.example                  # Environment variable template
├── .env.local                    # Actual environment variables (not in git)
└── .gitignore                    # Files excluded from git
```

---

## How the App Works

### The Flow

1. **User visits any URL** → Next.js matches it to a page in `app/`
2. **`layout.tsx` loads first** → Sets up the font, metadata, and wraps everything in:
   - `ThemeProvider` (provides dark/light theme to all components)
   - `Navbar` (top navigation bar)
   - `Footer` (bottom footer)
   - `ChatWidget` (floating chatbot button)
3. **The page component renders** → Each page is a composition of section components
4. **Animations play** → Framer Motion triggers animations as elements enter the viewport

### Client vs Server Components

- Files with `'use client'` at the top run in the browser (interactive stuff — animations, forms, state)
- Files without it run on the server (static content, metadata, data fetching)
- API routes (`app/api/`) always run on the server

---

## Configuration Files

### `tailwind.config.ts`
This defines the entire design system:
- **Colors**: All based on CSS variables so they change with the theme
- **Animations**: fadeUp, fadeIn, pulseDot, float, spin-slow
- **Shadows**: orange-glow and orange-glow-sm for the signature orange glow effect
- **Font**: Montserrat via CSS variable `--font-montserrat`
- **Dark mode**: Uses the `class` strategy (adds `.dark` or `.light` to `<html>`)

### `next.config.mjs`
- **Security headers**: X-Frame-Options, CSP, HSTS, etc.
- **Image optimization**: Allows external images from GitHub avatars and Unsplash
- **Image formats**: Serves AVIF and WebP for better performance

### `tsconfig.json`
- **Strict mode**: Enabled (catches more bugs)
- **Path alias**: `@/*` maps to the project root — so `@/components/ui/Button` means `./components/ui/Button`

---

## Design System

### Colors

The entire color palette uses CSS variables, which means colors automatically change when you switch themes.

| Token | Dark Mode | Light Mode | Used For |
|---|---|---|---|
| `bg-background` | #000000 (black) | #ffffff (white) | Page background |
| `bg-surface` | #0d0d0d | #f5f5f5 | Card/section backgrounds |
| `bg-surface-2` | #141414 | #e8e8e8 | Secondary surface |
| `border-border` | #1a1a1a | #e0e0e0 | Borders |
| `text-text-primary` | #ffffff | #111111 | Main text |
| `text-text-secondary` | #a0a0a0 | #555555 | Secondary text |
| `text-text-tertiary` | #606060 | #888888 | Muted text |
| `bg-orange` | #FF751F | #FF751F | Primary brand color (same in both themes) |

### Special CSS Classes (in `globals.css`)

| Class | What it does |
|---|---|
| `.dot-grid` | Creates a subtle dot pattern background |
| `.glass` | Glassmorphism effect (blurred transparent background) |
| `.orange-glow` | Orange shadow/glow effect |
| `.card-hover` | Hover animation on cards (border glow, slight lift) |
| `.text-gradient` | Orange gradient text |
| `.border-gradient` | Orange gradient border |
| `.section-padding` | Standard section vertical padding (6rem / 8rem on large screens) |

### Typography

- **Font**: Montserrat (Google Font), loaded in `layout.tsx`
- **Weights available**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extra Bold), 900 (Black)

---

## Theme System (Dark/Light)

The theme system works through three pieces:

### 1. CSS Variables (`globals.css`)
Two sets of variables defined under `.dark` and `.light` classes. When the class changes on `<html>`, all colors update instantly.

### 2. ThemeProvider (`components/ThemeProvider.tsx`)
A React Context that:
- Reads the saved theme from `localStorage` (key: `orbit-theme`)
- Provides `theme` (current theme) and `toggleTheme()` (function to switch) to all child components
- Adds/removes `dark` or `light` class on `<html>` element

### 3. Navbar Theme Toggle
The Sun/Moon button in the navbar calls `toggleTheme()` from the ThemeProvider. The icon animates with a rotation when switching.

**To use the theme in any component:**
```tsx
import { useTheme } from '@/components/ThemeProvider'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  // theme is 'dark' or 'light'
}
```

---

## Pages & Routes

### Home (`/`)
The landing page with 8 sections stacked vertically:
1. **Hero** — Full-screen intro with headline, tagline, and CTA buttons
2. **Stats** — 4 animated counters (projects, clients, rating, years)
3. **ServicesSnapshot** — 6 service cards in a grid
4. **AIShowcase** — Split layout showing AI capabilities with a chat mockup
5. **WhyOrbit** — 3 reasons to choose ORBIT
6. **FeaturedPortfolio** — 3 highlighted projects
7. **Testimonials** — 3 client review cards
8. **HomeCTA** — Call-to-action section with "Get in Touch" button

### About (`/about`)
5 sections: Hero, Our Story, Mission/Vision, Values, Team + shared CTA

### Services (`/services`)
4 sections: Hero, Service Blocks (alternating layout for each service), Process (4 steps), FAQ accordion + shared CTA

### Portfolio (`/portfolio`)
3 sections: Hero, Project Grid (with category filter), shared CTA

### Portfolio Detail (`/portfolio/[slug]`)
Dynamic route — each project has its own page. Uses `generateStaticParams()` to pre-build all project pages at build time. Shows full description, tech stack, links, and a "Next Project" navigation.

### Freelancers (`/freelancers`)
4 sections: Hero, Freelancer Grid (with skill filter), How It Works (3 steps), Join Banner

### Freelancer Apply (`/freelancers/apply`)
Application form page for freelancers wanting to join.

### Contact (`/contact`)
3 sections: Hero, Contact Form (left side) + Contact Info (right side)

### Privacy & Terms (`/privacy`, `/terms`)
Static content pages with legal text.

### Error Pages
- **`not-found.tsx`** — 404 page with "Go Home" and "Contact Us" buttons
- **`error.tsx`** — Error boundary with "Try Again" button
- **`loading.tsx`** — Spinner shown during page transitions

---

## Components Breakdown

### UI Components (`components/ui/`)

#### Button
The most-used component. Wraps Framer Motion for micro-interactions.
- **Variants**: `primary` (orange), `ghost` (orange border), `outline` (border only), `link` (text only)
- **Sizes**: `sm`, `md`, `lg`
- **Loading state**: Shows a spinner and disables the button

#### Card
A container with border, surface background, and optional hover animation (lifts up 4px).

#### Badge
Small pill-shaped label. Variants: `default` (surface bg), `orange` (orange bg), `outline` (border only).

#### Modal
Full-screen overlay with a centered content box. Supports Escape key to close, backdrop click to close, and body scroll lock.

#### AnimatedCounter
Counts from 0 to a target number with an easing animation. Only starts counting when the element scrolls into view.

### Layout Components (`components/layout/`)

#### Navbar
- Fixed to top of page
- Glassmorphism effect when scrolled
- ORBIT logo + text with wide letter spacing
- Desktop: horizontal nav links with active indicator
- Mobile: hamburger menu with slide-down drawer
- Theme toggle button (Sun/Moon)
- "Start a Project" CTA button

#### Footer
4-column grid:
1. Brand (logo, tagline, social links)
2. Company (nav links)
3. Services (service list)
4. Contact (email, phone, location)

Bottom bar has copyright and legal links.

---

## AI Chatbot

The chatbot is a floating widget available on every page.

### How it works:

1. **User clicks the orange bubble** (bottom-right corner) → Chat window opens
2. **User types a message** → The `useChat` hook sends it to `/api/chat`
3. **API route** receives the message, sends it to Google Gemini with the ORBIT system prompt
4. **Gemini streams the response** → Text appears word-by-word in the chat
5. **The system prompt** (`lib/chat-context.ts`) gives Gemini full knowledge about ORBIT: services, pricing, team, portfolio, contact info

### Architecture:

```
User types message
    ↓
useChat hook (hooks/useChat.ts)
    ↓ POST request
/api/chat/route.ts
    ↓ Sends to Gemini with system prompt
Google Gemini API (gemini-1.5-flash)
    ↓ Streams response
ReadableStream → useChat reads chunks → Updates UI
```

### Components:

| Component | Role |
|---|---|
| `ChatWidget` | Root wrapper — controls open/close state |
| `ChatBubble` | The floating orange button (MessageCircle / X icon) |
| `ChatWindow` | The chat panel (header, messages, input area) |
| `ChatMessage` | Individual message bubble (orange for user, surface for AI) |

### Key details:
- **Model**: Gemini 1.5 Flash (fast and cheap)
- **Streaming**: Responses appear incrementally (like ChatGPT)
- **History**: Keeps last 20 messages for context
- **Mobile**: Chat window goes fullscreen on small screens
- **Fallback**: If API key is missing, shows a message with the email address

---

## Forms & Validation

### Contact Form (`components/forms/ContactForm.tsx`)

**Fields**: Name, Email, Phone (optional), Service (dropdown), Budget (dropdown), Message

**Validation** (defined in `lib/validations.ts` using Zod):
- Name: 2-100 characters
- Email: Valid email format
- Service: Must select from list
- Budget: Must select from list
- Message: 20-2000 characters

**Flow**: User fills form → Client-side validation → POST to `/api/contact` → Server-side validation → Success/Error message

### Freelancer Application Form (`components/forms/FreelancerApplyForm.tsx`)

**Fields**: Name, Email, Role, Skills, Experience, Portfolio URL, Hourly Rate, GitHub/LinkedIn/Fiverr (optional), Bio

**Flow**: Same pattern as contact form, submits to `/api/freelancer`

Both forms use **React Hook Form** for state management and **Zod** for validation (same schema validates on both client and server).

---

## API Routes

All API routes are in `app/api/` and handle POST requests.

### `/api/chat` (POST)
- Receives chat messages, forwards to Gemini AI
- Returns streaming text response
- Falls back gracefully if API key is missing

### `/api/contact` (POST)
- Validates contact form data with Zod
- Rate limiting ready (Upstash Redis) — currently commented out
- Email sending ready (Resend) — currently commented out
- Returns success/error response

### `/api/freelancer` (POST)
- Validates freelancer application with Zod
- Same rate limiting and email setup as contact route
- Returns success/error response

**To activate email sending**: Uncomment the rate limit and email code in the route files and add the RESEND_API_KEY and UPSTASH variables to `.env.local`.

---

## Data Files

All content data lives in `data/`. These act like a simple database — when you want to change content, you edit these files.

| File | What it contains | Count |
|---|---|---|
| `services.ts` | Service offerings (title, description, features) | 5 services |
| `portfolio.ts` | Portfolio projects (title, description, tech stack, links) | 6 projects |
| `team.ts` | Team members (name, role, bio, photo, skills) | 4 members |
| `freelancers.ts` | Freelancer profiles (name, skills, rate, availability) | 6 freelancers |
| `testimonials.ts` | Client reviews (quote, author, rating) | 3 testimonials |
| `faqs.ts` | Frequently asked questions | 6 FAQs |

Each file exports a typed array. The TypeScript interfaces are defined in `types/index.ts`.

---

## Custom Hooks

| Hook | What it does | Used by |
|---|---|---|
| `useChat` | Manages chat messages, sends to API, handles streaming | ChatWidget |
| `useCounter` | Animates a number from 0 to target with easing | AnimatedCounter |
| `useInView` | Detects when an element is visible on screen | AnimatedCounter |
| `useMediaQuery` | Returns true/false for a CSS media query | Responsive components |
| `useScrollY` | Returns the current scroll position (number) | Navbar scroll effect |

---

## Utility Functions

All in `lib/utils.ts`:

| Function | What it does | Example |
|---|---|---|
| `cn()` | Merges Tailwind classes safely | `cn('text-lg', isActive && 'text-orange')` |
| `formatDate()` | Formats a date string | `formatDate('2024-01-15')` → "January 15, 2024" |
| `truncate()` | Shortens text with "..." | `truncate('long text', 50)` |
| `slugify()` | Converts text to URL slug | `slugify('Hello World')` → "hello-world" |

---

## Environment Variables

Create a `.env.local` file (never commit this!) based on `.env.example`:

```env
# Email service (for contact/freelancer forms)
RESEND_API_KEY=your_resend_api_key

# Rate limiting (for form spam prevention)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Contact form recipient
CONTACT_EMAIL=hello.theorbit@gmail.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Chatbot
GEMINI_API_KEY=your_gemini_api_key
```

**Currently active**: Only GEMINI_API_KEY is needed for the chatbot. The email and rate limiting features are ready but commented out in the API routes.

---

## How to Add/Change Things

### Add a new service
1. Open `data/services.ts`
2. Add a new object to the array following the `Service` interface
3. The icon should be a Lucide icon name (check lucide.dev for icons)

### Add a new portfolio project
1. Open `data/portfolio.ts`
2. Add a new object following the `Project` interface
3. Set `featured: true` if you want it on the home page
4. The slug is used for the URL: `/portfolio/your-slug`

### Add a new team member
1. Open `data/team.ts`
2. Add a new object following the `TeamMember` interface
3. Put the photo in `public/images/team/`

### Change company info
Edit `lib/constants.ts` — this is where the email, phone, tagline, and social links live.

### Change the chatbot's knowledge
Edit `lib/chat-context.ts` — this is the system prompt that tells Gemini everything about ORBIT.

### Activate email sending
1. Sign up at resend.com, get an API key
2. Add `RESEND_API_KEY=your_key` to `.env.local`
3. Uncomment the rate limit and email code in `app/api/contact/route.ts` and `app/api/freelancer/route.ts`

### Add a new page
1. Create `app/your-page/page.tsx`
2. Export a default function component
3. Add metadata export for SEO
4. Add the route to `NAV_LINKS` in `lib/constants.ts` if it should appear in the navbar

### Run the project
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Check for code issues
```

---

## Quick Reference

| What | Where |
|---|---|
| Change nav links | `lib/constants.ts` → `NAV_LINKS` |
| Change company info | `lib/constants.ts` → `COMPANY` |
| Change social links | `lib/constants.ts` → `SOCIAL_LINKS` |
| Edit services | `data/services.ts` |
| Edit portfolio | `data/portfolio.ts` |
| Edit team | `data/team.ts` |
| Edit freelancers | `data/freelancers.ts` |
| Edit testimonials | `data/testimonials.ts` |
| Edit FAQs | `data/faqs.ts` |
| Change chatbot behavior | `lib/chat-context.ts` |
| Change form validation | `lib/validations.ts` |
| Change colors/theme | `app/globals.css` (CSS variables) |
| Change Tailwind config | `tailwind.config.ts` |
| Change metadata/SEO | `app/layout.tsx` (global) or each `page.tsx` |
| Add images | `public/` folder |
| Environment secrets | `.env.local` |
