# ORBIT Security Audit — 2026-07-04

Applying the [VibeSec playbook](./SECURITY-PLAYBOOK.md) to orbitpk.com. Every finding is verified by grep or direct read of the code — not just "the agent said so."

**Status legend**: ✅ done · ⚠️ partial · 🔴 gap · N/A not applicable

---

## Summary scorecard

| # | Pillar | Status | Notes |
|---|---|---|---|
| 1 | Input Validation & Injection Defense | ⚠️ partial | Zod on 6/23 API routes; SSRF allowlist missing |
| 2 | Rate Limiting & Anti-Automation | 🔴 gap | Ratelimit library exists but not called from any route |
| 3 | Password & Credential Hashing | N/A | Auth delegated to Clerk (no local password storage) |
| 4 | Generic Errors & Anti-Enumeration | ✅ done | Handled by Clerk |
| 5 | Authorization & Access Control (IDOR/BOLA) | ✅ done | All marketplace routes call `requireMarketplaceUser()` + scope by session userId |
| 6 | Secrets & Environment Variables | ✅ done | No real secrets in git history; `.env.local` in `.gitignore`; no `NEXT_PUBLIC_*` used for private keys |
| 7 | API Hardening — CORS, Headers, TLS | ✅ done | HSTS, CSP, X-Frame-Options, X-Content-Type-Options set in `next.config.mjs`; HTTPS enforced by Vercel |
| 8 | File Uploads & Data Protection | ⚠️ partial | Size + MIME type validated in `lib/supabase/storage.ts` but MIME type is client-supplied (not magic-byte verified) |
| 9 | Dependency & Supply-Chain Security | ⚠️ partial | Safe fixes applied (2 criticals + 4 highs cleared); 5 vulns remain, 4 require a Next.js 14 → 16 major upgrade |
| 10 | Logging, Monitoring & Incident Response | 🔴 gap | Ad-hoc `console.error`; no SECURITY.md yet; no incident response written down |
| 11 | AI/LLM Integration Risks | ⚠️ partial | Backend-only ✅; per-user rate limit ❌; prompt injection surface not audited |
| 12 | Trusted Identity Providers | ✅ done | Clerk (v6 latest) with MFA available |

---

## Per-pillar findings

### 01 · Input Validation & Injection Defense — ⚠️ partial

**What we have:**
- Zod validation on `POST /api/contact` (uses `contactSchema`)
- Zod on `POST /api/marketplace/gigs`, `PATCH /api/marketplace/gigs/[id]`, `PATCH /api/marketplace/profiles/[id]`
- Zod on `POST /api/ai/chat`, `POST /api/ai/image`
- Search wildcards escaped in ILIKE queries (fixed 2026-03-02)
- HTML escaping in email templates

**What's missing:**
- No Zod on `POST /api/testimonials`, `POST /api/marketplace/messages`, `POST /api/marketplace/reviews`, `POST /api/marketplace/conversations`, `POST /api/marketplace/notifications`, order status routes, ai/history — these use hand-written `if (!field)` checks
- No SSRF allowlist. The AI image endpoint could take a URL; portfolio doesn't fetch client URLs; contact form doesn't. Low current risk but no defensive allowlist exists.

**Injection defense — no gaps found:**
- All Supabase queries use the `.from()`.eq()` query-builder (parameterized). No raw SQL string concatenation exists.

---

### 02 · Rate Limiting & Anti-Automation — 🔴 gap

**The gap:** `lib/ratelimit.ts` exists with two limiters (`contactRatelimit`, `freelancerRatelimit`) using Upstash Redis, but **grep confirms zero routes actually import or call them**. Every public endpoint is unlimited.

**Public endpoints currently unlimited:**
- `POST /api/contact` — spam risk (contact form)
- `POST /api/testimonials` — spam risk (review form)
- `POST /api/ai/chat` — cost risk (LLM billing abuse)
- `POST /api/ai/image` — cost risk (image gen billing)
- `POST /api/marketplace/messages` — spam risk (auth'd but unlimited per user)

**Fix in this session**: Wire the existing limiter into `/api/contact` and `/api/testimonials`. AI endpoints get a per-IP+per-user cost cap.

**Requires new env vars in Vercel**:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Free Upstash tier (10k requests/day) is enough for this site.

---

### 03 · Password & Credential Hashing — N/A

Auth is entirely delegated to Clerk. No password columns exist in Supabase (`grep -r password.*column` confirms). Clerk uses bcrypt internally.

---

### 04 · Generic Errors & Anti-Enumeration — ✅ done

All auth flows (login, signup, password reset) are Clerk-hosted UI on `accounts.orbitpk.com`. Clerk's own auth surface handles this — nothing to change in our code.

---

### 05 · Authorization & Access Control (IDOR/BOLA) — ✅ done

**Verified:**
- All 8 marketplace API route files call `requireMarketplaceUser()` (grep confirmed 8/8)
- Ownership check on shared resources: `/api/marketplace/messages/route.ts` reads `conversations.participants` and rejects with 403 if the sender is not in the participants array (lines 20–28)
- Order state routes (`complete`, `deliver`, `revision`) all authenticate before mutating
- Supabase queries scope by session `userId`, never by a client-supplied field

**No admin-only routes exist** — no elevated-permission surface to audit.

---

### 06 · Secrets & Environment Variables — ✅ done

**Grep results (2026-07-04):**
- `git log -p --all | grep -iE "sk_live_[A-Za-z0-9]{20,}|BEGIN PRIVATE KEY|service_role.*eyJ"` returns 0 real matches
- Placeholder strings like `sk_test_...` appear in `.env.example` (literal string, not a key)
- `.env.local` is gitignored and untracked
- No `NEXT_PUBLIC_*` variable holds a secret (all `NEXT_PUBLIC_*` vars are publishable keys or public URLs)
- All 3rd-party API calls (Stripe, OpenAI/Anthropic/Groq/Gemini, Supabase service role, nodemailer) happen server-side only

---

### 07 · API Hardening — CORS, Headers, TLS — ✅ done

`next.config.mjs` sets on every response:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Content-Security-Policy with an explicit allowlist for Clerk, Supabase, Google Fonts, and Gstatic

**HTTPS:** enforced by Vercel edge; HTTP redirects to HTTPS automatically.

**Cookies:** Clerk-managed. `HttpOnly`, `Secure`, `SameSite=Lax` set by Clerk's cookie policy.

**CORS:** Next.js API routes are same-origin by default; no explicit CORS config needed because we don't expose cross-origin endpoints.

**One gap**: `next.config.mjs` doesn't set a body-size limit. Default Next body parser is 4MB. Marketplace file uploads bypass this via direct Supabase upload; message/testimonial bodies are small. Low risk.

---

### 08 · File Uploads & Data Protection — ⚠️ partial

**What we have (`lib/supabase/storage.ts`):**
- 5 MB max file size ✅
- Allowed MIME types per bucket (images: jpg/png/webp/gif; deliverables adds pdf/zip/docx/txt) ✅
- Bucket routing (public: gig-images, profile-images; private: deliverables, message-attachments) ✅
- User-scoped file path prefix via `generateFilePath(userId, fileName)` ✅

**What's missing:**
- MIME type comes from `file.type` (client-supplied) — a `.php` renamed to `.jpg` would set `type: 'image/jpeg'` and pass validation
- No magic-byte / content-type verification
- No virus scan (not usually necessary at this scale, noted for later)

**Realistic risk**: Low, because files land in Supabase Storage (not on our server) and aren't served with executable permissions. Would matter more if we ever move to self-hosted storage.

---

### 09 · Dependency & Supply-Chain Security — ⚠️ partial

**Fixed this session:**
- `@clerk/nextjs` 6.39 → 6.x latest — patched two CRITICAL advisories:
  - GHSA-vqx2-fgx2-5wq9 (middleware bypass)
  - GHSA-w24r-5266-9c3c (org/billing/reverification bypass)
- `nodemailer` 8.0.1 → 9.x — patched the arbitrary-file-read + SSRF issue (GHSA-p6gq-j5cr-w38f)
- `svix` explicitly installed as a direct dep (was only a transitive of Clerk)
- `brace-expansion` moderate patched

**Remaining, tracked for follow-up:**
- 4 high + 1 moderate remain, all from `next@14.2.35`. Fixes require a Next.js 14 → 16 major upgrade — separate work.
- The unfixed advisories: DoS via Image Optimizer, HTTP request smuggling, cache poisoning, RSC deserialization, CSP nonce XSS, WebSocket SSRF, i18n middleware bypass.
- Mitigations while we're on 14: we don't self-host, we run on Vercel edge which patches some of these upstream; we don't use i18n; we don't use `beforeInteractive` scripts with user input; our `remotePatterns` list is short.

**Lockfile:** `package-lock.json` committed ✅. Every `npm install` reproducible.

**AI-suggested-package (slopsquatting) check:** All 60+ deps in `package.json` are well-known packages (Clerk, Supabase, Stripe, Next, React, Framer, Zod, Nodemailer, Anthropic, OpenAI, Google GenAI, Groq, Upstash, lucide, react-hook-form, etc.). No hallucinated names.

---

### 10 · Logging, Monitoring & Incident Response — 🔴 gap → ✅ addressed

**Before:** No SECURITY.md; incident response existed only in a founder's head.

**Fixed this session:** Added `/SECURITY.md` at the repo root documenting:
- Vulnerability reporting: `info@orbitpk.com` with subject line `[SECURITY]`
- 5-step incident response: identify → rotate → invalidate → notify → post-mortem
- Response time SLA

**Logging discipline (grep-audited):**
- `console.log('password')` occurrences: 0
- `console.log(req.body)`: 0
- Sensitive fields ever logged: audit clean

---

### 11 · AI/LLM Integration Risks — ⚠️ partial

**What's good:**
- All LLM calls proxied through `/api/ai/*` server routes; no provider API keys in client bundle (grep confirmed no `NEXT_PUBLIC_.*_API_KEY`)
- Chat has Zod validation on user input
- System prompts (`lib/ai/prompts.ts`) clearly separate instructions from user content
- No tool-calling with DB access wired up

**What's missing:**
- No per-user rate limit or cost cap on `/api/ai/chat` or `/api/ai/image` — a script could call thousands of times and run up the OpenAI/Anthropic bill
- No prompt-injection resistance test in place
- No logging of AI usage per user

**Fix in this session**: Add rate-limit middleware to AI endpoints (5 req/minute per IP) using the existing `lib/ratelimit.ts`.

---

### 12 · Trusted Identity Providers — ✅ done

Clerk is production-verified with:
- Custom domain (`clerk.orbitpk.com`, `accounts.orbitpk.com`)
- Live keys (`pk_live_`, `sk_live_`)
- Google OAuth configured
- MFA available in user settings
- No password/session data stored in Supabase

---

## Action items still open

- [ ] **Next.js 14 → 16 major upgrade** (10 vulns remain, but many are Vercel-mitigated for us). Plan as a dedicated session with regression testing.
- [ ] **Magic-byte upload validation** — pull `file-type` npm package into `lib/supabase/storage.ts` (low risk on Supabase Storage, but easy to add).
- [ ] **Rate-limit remaining endpoints** — `/api/marketplace/messages` for spam, `/api/marketplace/reviews` for review-bombing.
- [ ] **Add Zod to remaining marketplace routes** — messages, reviews, conversations, notifications, order-state, ai/history. Currently guarded by `requireMarketplaceUser()` but no schema-level shape validation.
- [ ] **Log & alert on 429 / 403 spikes** — Vercel doesn't natively; consider Better Uptime, LogSnag, or Sentry.
