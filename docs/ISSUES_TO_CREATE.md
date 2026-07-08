# GitHub Issues to Create

Create these issues manually at https://github.com/Shehriyar-Ali-Rustam/ORBIT/issues

---

## Issue 1: Add search filters to marketplace (category, price range, rating)

**Labels:** `enhancement`, `marketplace`

The marketplace search page currently only supports text search. Add advanced filters:
- Category dropdown (AI, Web Dev, Mobile, Design, Writing, Video)
- Price range slider (min/max)
- Minimum rating filter (1-5 stars)
- Delivery time filter (1 day, 3 days, 7 days, 14+ days)
- Sort by: relevance, price low-high, price high-low, rating, newest

Filters should update the URL query params so results are shareable.

---

## Issue 2: Add unit tests with Jest and React Testing Library

**Labels:** `testing`, `good first issue`

The project currently has no test suite. Set up:
- Jest + React Testing Library for component tests
- Test coverage for critical paths:
  - AI provider fallback logic (`lib/ai/`)
  - Marketplace queries and mutations (`lib/marketplace/`)
  - Zod validation schemas
  - GigCard, ContactForm, and key UI components
- Add `npm test` script to package.json
- Target: 60%+ coverage on `lib/` directory

---

## Issue 3: Implement email notifications for order updates

**Labels:** `enhancement`, `marketplace`

Users should receive email notifications for key order events:
- Buyer: order confirmed, delivery received, revision requested
- Seller: new order placed, revision requested, review received
- Both: message received (digest, not every message)

Use the existing nodemailer setup in `lib/email/`. Create HTML email templates with the ORBIT branding. Add a notification preferences page in the dashboard.

---

## Issue 4: Add multi-language support (i18n)

**Labels:** `enhancement`, `internationalization`

Add support for multiple languages starting with English and Urdu:
- Use `next-intl` or similar i18n library compatible with App Router
- Extract all hardcoded strings into translation files
- Add language switcher to the navbar
- RTL support for Urdu
- Persist language preference in localStorage

Priority pages: landing page, marketplace browse, AI tools.

---

## Issue 5: Improve mobile responsiveness on AI tools pages

**Labels:** `bug`, `ui`, `good first issue`

The AI tools pages (`/ai/*`) have several mobile issues:
- Chat input area overlaps with keyboard on iOS
- Sidebar navigation doesn't collapse properly on phones
- Code blocks in Orbit Code overflow horizontally
- Image generation results are too large on small screens
- Tool selector grid needs responsive columns

Test on: iPhone SE (375px), iPhone 14 (390px), Samsung Galaxy (360px).

---

## Issue 6: Add seller analytics dashboard with charts

**Labels:** `enhancement`, `marketplace`

Create an analytics page at `/freelancers/dashboard/analytics` with:
- Revenue over time (line chart — last 7 days, 30 days, 90 days)
- Orders by status (pie chart — pending, in progress, completed, cancelled)
- Top performing gigs (bar chart — by revenue and order count)
- Profile views over time
- Average rating trend
- Response time metrics

Use a lightweight chart library (Recharts or Chart.js). Data should come from existing Supabase tables.

---

## Issue 7: Implement gig favorites/wishlist feature

**Labels:** `enhancement`, `marketplace`, `good first issue`

Allow buyers to save gigs to a wishlist:
- Heart icon on GigCard (toggle favorite)
- Favorites page at `/freelancers/dashboard/buyer/favorites`
- Store in Supabase `favorites` table (user_id, gig_id, created_at)
- Show favorite count on gig detail page
- Optimistic UI updates on toggle

---

## Issue 8: Add rate limiting to API routes

**Labels:** `security`, `enhancement`

The rate limiter exists in `lib/ratelimit.ts` but is not applied to any routes. Apply it to:
- `/api/ai/*` — 20 requests/minute per IP
- `/api/contact` — 5 requests/minute per IP
- `/api/marketplace/gigs` POST — 10 requests/minute per user
- `/api/marketplace/orders` POST — 5 requests/minute per user
- `/api/marketplace/messages` POST — 30 requests/minute per user

Requires setting up Upstash Redis. Return 429 status with `Retry-After` header when rate limited. Add the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` env vars to `.env.example`.
