# ORBIT — Complete Project Documentation

> A developer's guide to understanding every part of the ORBIT website + freelancer marketplace.

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
10. [AI Chatbot & Orbit AI](#ai-chatbot--orbit-ai)
11. [Freelancer Marketplace](#freelancer-marketplace)
12. [Forms & Validation](#forms--validation)
13. [API Routes](#api-routes)
14. [Data Files](#data-files)
15. [Custom Hooks](#custom-hooks)
16. [Utility Functions](#utility-functions)
17. [Environment Variables](#environment-variables)
18. [How to Add/Change Things](#how-to-addchange-things)

---

## What is ORBIT?

ORBIT is a company website + freelancer marketplace for an AI-powered software solutions business. It showcases services, portfolio projects, team members, and includes a full freelancer marketplace with Stripe payments. It also has a built-in AI assistant (Orbit AI) with 7 tools.

**Key features:**
- Company website: Home, About, Services, Portfolio, Contact, Privacy, Terms
- Freelancer marketplace: Browse/hire freelancers, seller dashboard, buyer dashboard, messaging, reviews
- Orbit AI: 7 free AI tools (chat, code, write, translate, resume, freelance, image)
- Floating AI chat widget on every public page
- Dark/Light theme toggle
- Contact form with email notifications
- Animated UI with Framer Motion
- Fully responsive (mobile, tablet, desktop)
- SEO optimized with Open Graph and Twitter cards

---

## Tech Stack

| Technology | What it does |
|---|---|
| **Next.js 14** | React framework — App Router, SSR, API routes |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS v3** | Utility-first CSS styling |
| **Framer Motion** | Animations and transitions |
| **Clerk** | Authentication for the freelancer marketplace (`/freelancers/*`) |
| **Supabase** | Database (PostgreSQL), realtime messaging, file storage for marketplace |
| **Stripe** | Payment processing for marketplace orders |
| **Groq** | Primary AI provider (Llama 3.3 70B — fast, free) |
| **Google Gemini** | Backup AI provider |
| **OpenAI** | Optional AI provider (paid, if configured) |
| **Zod** | Schema validation for forms and API routes |
| **React Hook Form** | Form state management |
| **Lucide React** | Icon library |
| **Firebase** | Legacy auth (main site Navbar sign-in/out only) |
| **Svix** | Clerk webhook signature verification |

---

## Project Structure

```
ORBIT/
├── app/                              # All pages and API routes
│   ├── layout.tsx                    # Root layout (font, metadata, ThemeProvider)
│   ├── (public)/                     # Public website pages
│   │   ├── page.tsx                  # Home page
│   │   ├── about/page.tsx            # About page
│   │   ├── services/page.tsx         # Services page
│   │   ├── portfolio/page.tsx        # Portfolio listing
│   │   ├── portfolio/[slug]/page.tsx # Individual project page
│   │   ├── contact/page.tsx          # Contact page
│   │   ├── privacy/page.tsx          # Privacy policy
│   │   ├── terms/page.tsx            # Terms of service
│   │   └── layout.tsx               # Public layout (Navbar, Footer, ChatWidget)
│   ├── (auth)/                       # Legacy Firebase auth pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── ai/                           # Orbit AI tools
│   │   ├── page.tsx                  # AI tools hub
│   │   ├── chat/page.tsx             # Orbit Chat
│   │   ├── code/page.tsx             # Orbit Code
│   │   ├── write/page.tsx            # Orbit Write
│   │   ├── translate/page.tsx        # Orbit Translate
│   │   ├── resume/page.tsx           # Orbit Resume
│   │   ├── freelance/page.tsx        # Orbit Freelance
│   │   └── image/page.tsx            # Orbit Image
│   ├── freelancers/                  # Marketplace (Clerk auth scoped here)
│   │   ├── layout.tsx                # ClerkProvider + theme-aware appearance
│   │   ├── page.tsx                  # Browse freelancers
│   │   ├── search/page.tsx           # Search gigs
│   │   ├── sign-in/page.tsx          # Clerk sign-in
│   │   ├── sign-up/page.tsx          # Clerk sign-up
│   │   ├── onboarding/page.tsx       # New seller profile setup
│   │   ├── gig/[slug]/page.tsx       # Gig detail page
│   │   ├── seller/[id]/page.tsx      # Seller profile page
│   │   └── dashboard/                # Seller & buyer dashboards
│   │       ├── layout.tsx            # Dashboard sidebar + mode switch
│   │       ├── page.tsx              # Seller dashboard home
│   │       ├── gigs/                 # Manage gigs (list, create, edit)
│   │       ├── orders/               # Seller orders
│   │       ├── messages/             # Real-time messaging
│   │       ├── earnings/             # Earnings tracking
│   │       ├── reviews/              # Seller reviews
│   │       ├── profile/              # Edit profile
│   │       └── buyer/                # Buyer dashboard (orders, reviews)
│   └── api/                          # Backend API routes
│       ├── ai/
│       │   ├── chat/route.ts         # AI chat (streaming, multi-provider, RAG)
│       │   └── image/route.ts        # AI image generation
│       ├── contact/route.ts          # Contact form endpoint
│       ├── marketplace/              # Marketplace CRUD APIs
│       │   ├── gigs/route.ts         # Gigs CRUD
│       │   ├── profiles/[id]/route.ts
│       │   ├── orders/               # Order management
│       │   ├── reviews/route.ts
│       │   ├── conversations/route.ts
│       │   ├── messages/route.ts
│       │   ├── notifications/route.ts
│       │   └── stripe/               # Stripe checkout + webhook
│       └── webhooks/
│           └── clerk/route.ts        # Clerk webhook (user sync to Supabase)
│
├── components/
│   ├── ThemeProvider.tsx              # Dark/Light theme context
│   ├── layout/
│   │   ├── Navbar.tsx                # Main site navigation
│   │   └── Footer.tsx                # Site footer
│   ├── ui/                           # Reusable UI components
│   │   ├── Button.tsx, Card.tsx, Badge.tsx
│   │   ├── SectionHeading.tsx, SectionLabel.tsx
│   │   ├── AnimatedCounter.tsx, GlowDot.tsx
│   │   └── ...
│   ├── chat/                         # Floating chat widget (public pages)
│   │   ├── ChatWidget.tsx            # Open/close wrapper
│   │   ├── ChatBubble.tsx            # Floating orange button
│   │   ├── ChatWindow.tsx            # Chat panel
│   │   └── ChatMessage.tsx           # Message bubble
│   ├── ai/                           # Full AI tools interface
│   │   ├── ChatInterface.tsx         # Main chat UI with streaming
│   │   ├── WelcomeScreen.tsx         # Tool-specific welcome
│   │   ├── MessageBubble.tsx         # Message with markdown rendering
│   │   ├── InputBar.tsx              # Input with attachments
│   │   ├── AISidebar.tsx             # Conversation history sidebar
│   │   ├── CodeBlock.tsx             # Syntax-highlighted code blocks
│   │   ├── ImageResult.tsx           # AI-generated image display
│   │   ├── ToolCard.tsx              # Tool selector card
│   │   ├── ModelBadge.tsx            # AI provider badge
│   │   ├── TypingIndicator.tsx       # Loading dots animation
│   │   ├── VoiceInput.tsx            # Voice input support
│   │   ├── AttachmentPreview.tsx     # File attachment preview
│   │   └── ConversationList.tsx      # Conversation list
│   ├── marketplace/                  # Marketplace components
│   │   ├── MarketplaceNavbar.tsx     # Marketplace navigation
│   │   ├── GigCard.tsx, GigGrid.tsx  # Gig display
│   │   ├── SearchBar.tsx             # Search with filters
│   │   └── dashboard/               # Dashboard components
│   │       ├── Sidebar.tsx           # Dashboard sidebar nav
│   │       ├── GigForm.tsx           # Create/edit gig form
│   │       ├── OrderCard.tsx         # Order display
│   │       ├── MessageThread.tsx     # Real-time chat thread
│   │       └── ...
│   ├── forms/
│   │   └── ContactForm.tsx           # Contact page form (Firebase)
│   └── sections/                     # Page-specific sections
│       ├── home/                     # Home page sections
│       ├── about/                    # About page sections
│       ├── services/                 # Services page sections
│       ├── portfolio/                # Portfolio page sections
│       └── contact/                  # Contact page sections
│
├── lib/
│   ├── utils.ts                      # cn(), formatDate, slugify, truncate
│   ├── constants.ts                  # Nav links, social links, company info
│   ├── validations.ts               # Zod schemas for forms
│   ├── email.ts                      # Email sending (Gmail SMTP)
│   ├── ai/                           # AI system
│   │   ├── router.ts                 # Multi-provider router (Groq → Gemini → OpenAI)
│   │   ├── prompts.ts               # System prompts for all 7 tools
│   │   ├── orbit-knowledge.ts       # Knowledge base (27 entries)
│   │   ├── rag.ts                    # RAG search with synonym expansion
│   │   ├── groq.ts                   # Groq streaming client
│   │   ├── gemini.ts                 # Gemini streaming client
│   │   ├── openai.ts                 # OpenAI streaming client
│   │   ├── memory.ts                 # Session memory management
│   │   └── image.ts                  # Pollinations image URL builder
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client (anon key)
│   │   └── server.ts                 # Server Supabase client (service role)
│   ├── supabase/storage.ts           # File upload with validation (5MB, MIME check)
│   ├── marketplace/
│   │   ├── queries.ts                # All SELECT operations
│   │   ├── mutations.ts             # All INSERT/UPDATE/DELETE operations
│   │   └── auth.ts                   # requireMarketplaceUser() helper
│   ├── firebase/
│   │   └── config.ts                 # Firebase config (legacy, used by Navbar)
│   └── stripe/
│       └── config.ts                 # Stripe instance
│
├── types/
│   ├── index.ts                      # Main site TypeScript interfaces
│   └── marketplace.ts               # Marketplace TypeScript types
│
├── data/                             # Static content data
│   ├── services.ts                   # 5 services
│   ├── portfolio.ts                  # 8 portfolio projects
│   ├── team.ts                       # 4 team members
│   ├── testimonials.ts              # 3 client testimonials
│   └── faqs.ts                       # 6 FAQ items
│
├── hooks/
│   ├── useChat.ts                    # Floating chat widget hook (calls /api/ai/chat)
│   ├── useCounter.ts                 # Animated counting
│   ├── useInView.ts                  # Viewport detection
│   └── useAIConversations.ts        # AI conversation persistence (localStorage)
│
├── middleware.ts                     # Clerk auth middleware (/freelancers/dashboard/*, /freelancers/onboarding/*)
├── tailwind.config.ts
├── next.config.mjs                   # CSP headers, image optimization
├── tsconfig.json
└── package.json
```

---

## How the App Works

### The Flow

1. **User visits any URL** → Next.js matches it to a page in `app/`
2. **Root `layout.tsx` loads** → Sets up font, metadata, wraps in `ThemeProvider`
3. **Route group determines the wrapper:**
   - `(public)/*` — Navbar, Footer, ChatWidget
   - `ai/*` — AI tools layout
   - `freelancers/*` — ClerkProvider + marketplace layout
4. **Page renders** → Composition of section components with Framer Motion animations

### Auth Architecture

- **Clerk** — Scoped to `/freelancers/*` only (ClerkProvider in `app/freelancers/layout.tsx`)
  - Middleware protects `/freelancers/dashboard/*` and `/freelancers/onboarding/*`
  - Theme-aware sign-in/sign-up (dark/light mode)
  - Webhook syncs users to Supabase `profiles` table
- **Firebase** — Legacy, used only by main site Navbar for sign-in/out

### Data Flow

- **Main site** → Static data from `data/` files
- **Marketplace** → Supabase (PostgreSQL) via `lib/marketplace/queries.ts` and `mutations.ts`
- **AI chatbot** → Groq/Gemini/OpenAI via `lib/ai/router.ts` with RAG context from `lib/ai/orbit-knowledge.ts`
- **Payments** → Stripe checkout + webhooks
- **File uploads** → Supabase Storage (4 buckets: gig-images, profile-images, deliverables, message-attachments)

---

## Configuration Files

### `tailwind.config.ts`
- **Colors**: CSS variable-based (auto-switch with theme)
- **Animations**: fadeUp, fadeIn, pulseDot, float, spin-slow
- **Shadows**: orange-glow effects
- **Font**: Montserrat via CSS variable
- **Dark mode**: `class` strategy

### `next.config.mjs`
- **Security headers**: CSP (Clerk, Cloudflare Turnstile, Google, Firebase), X-Frame-Options, HSTS
- **Image optimization**: External images from GitHub, Unsplash, Supabase, Clerk
- **Image formats**: AVIF and WebP

### `middleware.ts`
- Clerk `clerkMiddleware()` protecting dashboard and onboarding routes
- Public routes: all other paths

---

## Design System

### Colors

| Token | Dark Mode | Light Mode | Used For |
|---|---|---|---|
| `bg-background` | #000000 | #ffffff | Page background |
| `bg-surface` | #0d0d0d | #f5f5f5 | Card backgrounds |
| `bg-surface-2` | #141414 | #e8e8e8 | Secondary surface |
| `border-border` | #1a1a1a | #e0e0e0 | Borders |
| `text-text-primary` | #ffffff | #111111 | Main text |
| `text-text-secondary` | #a0a0a0 | #555555 | Secondary text |
| `bg-orange` | #FF751F | #FF751F | Brand color (both themes) |

### Typography
- **Font**: Montserrat (Google Font)
- **Weights**: 400–900

---

## Theme System (Dark/Light)

Three pieces:
1. **CSS Variables** (`globals.css`) — `.dark` and `.light` classes with color tokens
2. **ThemeProvider** (`components/ThemeProvider.tsx`) — React Context with `theme` and `toggleTheme()`
3. **Navbar Toggle** — Sun/Moon button calls `toggleTheme()`

---

## Pages & Routes

### Public Site
| Route | Page |
|---|---|
| `/` | Home (8 sections: Hero, Stats, Services, AI Showcase, Why Orbit, Portfolio, Testimonials, CTA) |
| `/about` | About (Hero, Story, Mission/Vision, Values, Team) |
| `/services` | Services (Hero, Service Blocks, Process, FAQ) |
| `/portfolio` | Portfolio listing with category filter |
| `/portfolio/[slug]` | Individual project page |
| `/contact` | Contact form + info |
| `/privacy`, `/terms` | Legal pages |

### AI Tools
| Route | Tool |
|---|---|
| `/ai` | Tool selection hub |
| `/ai/chat` | General AI assistant |
| `/ai/code` | Code assistant |
| `/ai/write` | Content writer |
| `/ai/translate` | English ↔ Urdu translator |
| `/ai/resume` | Resume builder |
| `/ai/freelance` | Freelance profile optimizer |
| `/ai/image` | AI image generator |

### Marketplace
| Route | Page |
|---|---|
| `/freelancers` | Browse freelancers |
| `/freelancers/search` | Search gigs |
| `/freelancers/sign-in` | Clerk sign-in |
| `/freelancers/sign-up` | Clerk sign-up |
| `/freelancers/onboarding` | New seller profile setup |
| `/freelancers/gig/[slug]` | Gig detail |
| `/freelancers/seller/[id]` | Seller profile |
| `/freelancers/dashboard` | Seller dashboard |
| `/freelancers/dashboard/gigs` | Manage gigs |
| `/freelancers/dashboard/orders` | Seller orders |
| `/freelancers/dashboard/messages` | Real-time messaging |
| `/freelancers/dashboard/earnings` | Earnings tracking |
| `/freelancers/dashboard/reviews` | Seller reviews |
| `/freelancers/dashboard/profile` | Edit profile |
| `/freelancers/dashboard/buyer` | Buyer dashboard |

---

## AI Chatbot & Orbit AI

### Floating Chat Widget (Public Pages)

A floating orange button (bottom-right) that opens a chat panel on every public page.

**Architecture:**
```
User types message
    ↓
useChat hook (hooks/useChat.ts)
    ↓ POST /api/ai/chat (tool: 'chat')
AI route → RAG search → System prompt → AI provider
    ↓
Groq (Llama 3.3 70B) → Gemini (backup) → OpenAI (fallback)
    ↓ Streams response
ReadableStream → useChat reads chunks → Updates UI
```

### Full AI Tools (`/ai/*`)

7 specialized tools, each with:
- Custom system prompt (`lib/ai/prompts.ts`)
- Tool-specific suggestions and welcome screen
- Conversation persistence (localStorage)
- Streaming responses with markdown rendering

### AI System Architecture

| File | Purpose |
|---|---|
| `lib/ai/router.ts` | Multi-provider router: Groq → Gemini → OpenAI with auto-fallback |
| `lib/ai/prompts.ts` | Base identity + 7 tool-specific prompts with guardrails |
| `lib/ai/orbit-knowledge.ts` | Knowledge base (27 entries: services, pricing, portfolio, FAQs, etc.) |
| `lib/ai/rag.ts` | RAG search with synonym expansion, bigram matching, category boosting |
| `lib/ai/groq.ts` | Groq streaming (Llama 3.3 70B) |
| `lib/ai/gemini.ts` | Gemini streaming (gemini-2.0-flash) |
| `lib/ai/openai.ts` | OpenAI streaming (gpt-4o-mini) |
| `lib/ai/memory.ts` | Session memory (localStorage) |
| `lib/ai/image.ts` | Pollinations.ai free image generation |

### Key AI Features
- **RAG** — Synonym expansion (e.g., "how much" → "price", "cost", "rate"), intent detection, category boosting
- **Lead conversion** — Detects buying intent, asks qualifying questions, guides to contact
- **Guardrails** — Never invents info, never reveals system prompts, handles off-topic gracefully
- **Follow-up suggestions** — Suggests natural next questions after each answer
- **Prompt injection protection** — Blocks common injection patterns
- **Streaming** — Token-by-token response display

---

## Freelancer Marketplace

### Database (Supabase)

| Table | Purpose |
|---|---|
| `profiles` | Seller profiles (synced from Clerk via webhook) |
| `gigs` | Service listings with packages |
| `orders` | Purchase orders (Stripe checkout) |
| `reviews` | Buyer reviews for sellers |
| `conversations` | Messaging threads |
| `messages` | Individual messages (realtime) |
| `notifications` | User notifications (realtime) |

### Storage Buckets

| Bucket | Access | Purpose |
|---|---|---|
| `gig-images` | Public | Gig cover images and gallery |
| `profile-images` | Public | Seller profile photos |
| `deliverables` | Private | Order deliverable files |
| `message-attachments` | Private | Message file attachments |

### Security
- File uploads: 5MB limit + MIME type validation
- Search: ILIKE wildcard escaping
- Notifications: Ownership check on mark-read
- Clerk webhook: Svix signature verification
- Stripe webhook: Secret verification + metadata validation
- Gigs API: Zod validation on POST

---

## Forms & Validation

### Contact Form
- **Fields**: Name, Email, Phone (optional), Service, Budget, Message
- **Validation**: Zod schemas in `lib/validations.ts`
- **Flow**: Client validation → POST `/api/contact` → Server validation → Email via Gmail SMTP

---

## API Routes

### AI
| Route | Method | Purpose |
|---|---|---|
| `/api/ai/chat` | POST | Streaming AI chat with RAG and multi-provider routing |
| `/api/ai/image` | POST | AI image prompt enhancement + Pollinations URL |

### Marketplace
| Route | Method | Purpose |
|---|---|---|
| `/api/marketplace/gigs` | GET/POST | List/create gigs (Zod validated) |
| `/api/marketplace/gigs/[id]` | PATCH/DELETE | Update/delete gig |
| `/api/marketplace/profiles/[id]` | GET/PATCH | Get/update seller profile |
| `/api/marketplace/orders/[id]/complete` | POST | Complete an order |
| `/api/marketplace/orders/[id]/deliver` | POST | Deliver an order |
| `/api/marketplace/orders/[id]/revision` | POST | Request revision |
| `/api/marketplace/reviews` | GET/POST | List/create reviews |
| `/api/marketplace/conversations` | GET/POST | List/create conversations |
| `/api/marketplace/messages` | GET/POST | List/send messages |
| `/api/marketplace/notifications` | GET/PATCH | List/mark-read notifications |
| `/api/marketplace/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/marketplace/stripe/webhook` | POST | Handle Stripe payment events |

### Webhooks
| Route | Method | Purpose |
|---|---|---|
| `/api/webhooks/clerk` | POST | Sync Clerk users to Supabase (user.created/updated/deleted) |

### Other
| Route | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Contact form submission + email |

---

## Data Files

| File | Contents |
|---|---|
| `data/services.ts` | 5 services (AI chatbots, model training, web, mobile, design) |
| `data/portfolio.ts` | 8 portfolio projects with tech stacks and links |
| `data/team.ts` | 4 team members (1 founder + 3 hiring placeholders) |
| `data/testimonials.ts` | 3 client testimonials |
| `data/faqs.ts` | 6 FAQ items |

---

## Custom Hooks

| Hook | Purpose |
|---|---|
| `useChat` | Floating chat widget — sends messages to `/api/ai/chat`, handles streaming |
| `useCounter` | Animated number counting with easing |
| `useInView` | Viewport intersection detection |
| `useAIConversations` | AI conversation persistence in localStorage |

---

## Environment Variables

```env
# Gmail SMTP
EMAIL_USER=hello.theorbit@gmail.com
EMAIL_PASS=your_app_password

# Firebase (legacy — main site auth)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Providers
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...
AI_PROVIDER=groq  # preferred provider

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/freelancers/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/freelancers/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/freelancers/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/freelancers/onboarding
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## How to Add/Change Things

| What | Where |
|---|---|
| Change nav links | `lib/constants.ts` → `NAV_LINKS` |
| Change company info | `lib/constants.ts` → `COMPANY` |
| Edit services | `data/services.ts` |
| Edit portfolio | `data/portfolio.ts` |
| Edit team | `data/team.ts` |
| Edit testimonials | `data/testimonials.ts` |
| Edit FAQs | `data/faqs.ts` |
| Change chatbot knowledge | `lib/ai/orbit-knowledge.ts` (27 knowledge entries) |
| Change chatbot personality | `lib/ai/prompts.ts` (BASE_IDENTITY + tool prompts) |
| Change RAG synonyms | `lib/ai/rag.ts` (SYNONYMS map) |
| Change form validation | `lib/validations.ts` |
| Change colors/theme | `app/globals.css` (CSS variables) |
| Change Tailwind config | `tailwind.config.ts` |
| Change metadata/SEO | `app/layout.tsx` (global) or each `page.tsx` |
| Add images | `public/` folder |
| Environment secrets | `.env.local` |

### Run the project
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Check for code issues
```
