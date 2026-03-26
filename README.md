# ORBIT — AI-Powered Freelancer Marketplace

> A full-stack freelancer marketplace with 7 built-in AI tools, real-time messaging, Stripe payments, and a company showcase — built with Next.js 14, TypeScript, Supabase, and Clerk.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)

---

## Features

### Company Website
- Responsive landing page with animated sections (Framer Motion)
- Services, Portfolio, About, Contact pages
- SEO optimized with Open Graph & Twitter cards
- Dark/Light theme toggle
- Floating AI chat widget on every page

### Freelancer Marketplace
- Browse and hire freelancers with gig-based listings
- Seller & Buyer dashboards
- Gig creation with packages and pricing
- Stripe payment integration (checkout + webhooks)
- Real-time messaging (Supabase Realtime)
- Review and rating system
- Order management (deliver, revise, complete)
- File uploads with validation (Supabase Storage)

### Orbit AI — 7 Free AI Tools
- **Orbit Chat** — General AI assistant with RAG-powered company knowledge
- **Orbit Code** — Code generation and debugging assistant
- **Orbit Write** — Content writing assistant
- **Orbit Translate** — English <-> Urdu translator
- **Orbit Resume** — Resume builder and optimizer
- **Orbit Freelance** — Freelance profile optimizer
- **Orbit Image** — AI image generation (Pollinations)

All AI tools feature streaming responses, conversation history, multi-provider fallback (Groq -> Gemini -> OpenAI), and prompt injection protection.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, SSR, API Routes) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + Framer Motion |
| Auth | Clerk (marketplace) + Firebase (legacy site auth) |
| Database | Supabase (PostgreSQL + Realtime + Storage) |
| Payments | Stripe (Checkout + Webhooks) |
| AI | Groq (Llama 3.3 70B), Google Gemini, OpenAI |
| Validation | Zod + React Hook Form |
| Icons | Lucide React |

---

## Architecture

```text
+--------------------------------------------------+
|                  Next.js 14                       |
+------------+-----------------+--------------------+
|  Public    |  Marketplace    |    AI Tools        |
|  Website   |  (Clerk Auth)   |  (7 tools + RAG)  |
+------------+-----------------+--------------------+
|              API Routes                           |
+-----------+-----------+-----------+---------------+
| Supabase  |  Stripe   |  Groq/   |   Gmail       |
|  (DB +    | (Payments)|  Gemini/ |   SMTP        |
|  Storage) |           |  OpenAI  |               |
+-----------+-----------+-----------+---------------+
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project
- Stripe account
- Clerk account
- Groq API key (free)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shehriyar-Ali-Rustam/ORBIT.git
   cd ORBIT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in all required keys (see `.env.example` for the full list).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
ORBIT/
├── app/
│   ├── (public)/          # Company website pages
│   ├── ai/                # 7 AI tool pages
│   ├── freelancers/       # Marketplace (Clerk-scoped auth)
│   │   └── dashboard/     # Seller & buyer dashboards
│   └── api/               # Backend API routes
├── components/            # Reusable UI, chat, AI, marketplace components
├── lib/                   # Utils, AI system, Supabase, Stripe, validations
├── data/                  # Static content (services, portfolio, team, FAQs)
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript interfaces
```

---

## AI System

ORBIT's AI uses a multi-provider architecture with automatic fallback:

1. **Groq** (Llama 3.3 70B) — Primary, fast and free
2. **Google Gemini** (gemini-2.0-flash) — Backup
3. **OpenAI** (gpt-4o-mini) — Fallback

Features:
- RAG with synonym expansion and intent detection
- Company knowledge base (27 entries)
- Lead conversion detection
- Streaming token-by-token responses
- Prompt injection protection

---

## Security

- Clerk webhook verification (Svix)
- Stripe webhook signature validation
- File upload validation (5MB limit + MIME type check)
- Zod schema validation on all API inputs
- SQL injection prevention via parameterized Supabase queries
- CSP headers configured in `next.config.mjs`

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Contact

**Shehriyar Ali** — Software Engineer

- GitHub: [@Shehriyar-Ali-Rustam](https://github.com/Shehriyar-Ali-Rustam)
- LinkedIn: [shehriyar-ali-rustam](https://www.linkedin.com/in/shehriyar-ali-rustam-516895246)
