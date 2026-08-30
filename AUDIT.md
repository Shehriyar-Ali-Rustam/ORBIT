# Story Mode — Phase 0 Audit

Written before any story code. Everything below is verified against the repo, not assumed.

## 1. Stack

| | |
|---|---|
| Framework | Next.js **14.2.35** (App Router, `src/` dir), pinned exact |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS **3.4** (`darkMode: 'class'`) |
| Motion | **Framer Motion 12** — already a dependency, so no GSAP is needed |
| React | 18 |
| Host | Vercel (`@vercel/analytics`, `@vercel/speed-insights`, `x-vercel-ip-country` in `/api/geolocation`) |
| Icons | `lucide-react` |

Not a no-code platform. Full approach available.

## 2. Routes

`/` is served by `src/app/(landing)/page.tsx` — its own route group with its own fonts and
its own stylesheet, deliberately not inheriting the marketing site's navbar/footer/chat.
**It is the destination printed on the physical Orbit business card's QR code.**

The other 12 public routes live in `src/app/(public)/`: `/about`, `/services`, `/portfolio`,
`/portfolio/[slug]`, `/blog`, `/blog/[slug]`, `/team`, `/team/[id]`, `/careers`, `/contact`,
`/privacy`, `/terms`. Plus `/ai/*` and `/freelancers/*`, both flag-gated to a Coming Soon
screen by `src/lib/flags.ts`.

Story mode adds **zero routes**.

## 3. Brand assets

- `public/logo.png` (49 KB) — a white ring with an orange satellite; built for a dark canvas.
- **`src/components/landing/OrbitMark.tsx`** — the same mark redrawn as SVG so the ring
  inherits `currentColor` and the satellite keeps `rgb(var(--acc-rgb))`. Works on either
  palette. **This is the basis for the Orbit AI orb** — no new asset needed.
- Colour: `#FF751F` brand orange for fills. `#C2410C` for accent *text* — brand orange is
  2.7:1 on white and fails WCAG AA; the repo documents this in `src/styles/landing.css`.
- Fonts already loaded on `/`: **Space Grotesk** (body), **Syne** (display), **Space Mono**
  (micro-labels). No new font needed for the story.

## 4. Content available to the story — real, not invented

| Source | Content |
|---|---|
| `src/data/portfolio.ts` | **10 projects**, each with a local `.webp` `coverImage`, `techStack`, `category`. 4 are `featured`. 3 have a full `caseStudy`. |
| `src/data/services.ts` | **5 services**: AI Chatbot Development, AI Model Training & Fine-Tuning, Web Development, Mobile App Development, Graphic Design & Branding. |
| `src/data/landing.ts` | `PROCESS` — 4 steps (Call / Scope / Build / Hand over). `CARD` — phone, WhatsApp, email, vCard href, location, hours. `STATS` — 10 projects, 30 reviews, 8 countries, 24h reply. |
| `src/data/testimonials.ts` | 30 reviews, all 5-star — but sourced from Fiverr **design and logo** work, not software. |

### Facts the story may state
Ten projects shipped · clients in eight countries · five services · Islamabad, Pakistan ·
Next.js and React Native · chatbots trained on client documents · fine-tuning and RAG ·
24-hour reply window · code and accounts handed over.

### Facts the story must NOT state
- **Any SaaS product.** Orbit ships none. The only two things called products (Orbit AI,
  Freelancer Marketplace) are both behind `MARKETPLACE_ENABLED = false` / `AI_ENABLED = false`
  and render a Coming Soon screen. This is why the brief's scene 3 was cut.
- **`101+ projects`, `100+ clients`, `4+ years`** — these appear in `sections/home/Stats.tsx`
  and `Hero.tsx` and contradict `data/landing.ts`, which says 10 projects. Those components
  live only on `/home`, a noindexed parked page.
- **`99.9% uptime SLA`, `10x faster`** — in `sections/home/WhyOrbit.tsx`. No such SLA exists.
- **A star rating.** `5.0` is claimed in two places and `4.9 / 5` in another.

The storyboard derives its project count from `projects.length` so it cannot become a fourth
conflicting number.

## 5. Analytics

`@vercel/analytics` and `@vercel/speed-insights`, mounted in `src/app/layout.tsx`.
No GA4, no Plausible. Story events go through `track()` from `@vercel/analytics`.

## 6. Accessibility baseline

`src/app/globals.css` has a global `@media (prefers-reduced-motion: reduce)` block zeroing
CSS animation and transition durations. **It does not reach Framer Motion**, which animates
via JS. Every story component must call `useReducedMotion()` explicitly.

## 7. Approved script — 5 scenes, ~28.5s, ~74 words

| # | id | Window | Narration |
|---|---|---|---|
| 1 | `welcome` | 0.0–5.0s | Hi, I'm Orbit AI. Welcome to Orbit Innovations. Give me thirty seconds and I'll show you what we build. |
| 2 | `software` | 5.0–11.5s | We engineer custom software end to end — Next.js platforms and React Native apps, shipped for clients in eight countries. |
| 3 | `ai` | 11.5–18.5s | AI is our home turf: chatbots trained on your own documents, fine-tuned models, and voice assistants. |
| 4 | `journey` | 18.5–23.5s | From the first call to handover, we run the whole build. Code and accounts end up yours. |
| 5 | `cta` | 23.5–28.5s | Ready to build something? Let's talk — or explore at your own pace. |

Scene 3 gains the two words "like me" only once real audio ships — until then Orbit AI does
not speak, and claiming otherwise would be false.

## 8. Blocker noted

At the time of writing, `git status` shows **38 uncommitted files** from an earlier de-gloss
pass. Story mode is purely additive and does not depend on it, but the two changes will share
a diff until that work is committed.
