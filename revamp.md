# Orbitpk.com Revamp Plan — "Orbie": The Bot-Guided Website
 
**Project:** Complete revamp of orbitpk.com
**Concept:** Replace the conventional scroll-and-click website with an interactive walkthrough guided by a custom 3D AI robot ("Orbie")
**Date:** September 12, 2026
**Status:** Approved concept, planning phase
 
---
 
## 1. The Big Idea
 
When a visitor lands on orbitpk.com, there is no navbar-and-hero landing page. Instead, a friendly 3D robot — **Orbie** — floats into view and greets them:
 
> "Hello! I'm Orbie, the Orbit AI. Welcome to Orbit Innovations — let me show you around!"
 
Orbie then runs a short **orientation**: who Orbit is, what it does, its five core services, and how to get in touch. After the orientation, Orbie presents **3–4 option cards** (About Us, Our Services, Our Work, Contact Us). When the visitor picks one, the entire page **flips like a book page** — Orbie "carries" the visitor to that section, explains it in its own words, and then offers the next set of choices. The visitor never scrolls, never hunts through menus. Orbie drives everything.
 
Since Orbit *sells* AI chatbots, custom development, and design — the website itself becomes the best portfolio piece: a live demo of exactly what Orbit builds.
 
### Decisions locked in
 
| Decision | Choice |
|---|---|
| Bot intelligence | **Scripted + AI hybrid** — tour is scripted; free-form questions go to an LLM |
| Bot appearance | **3D robot** (Three.js), fitting the space/orbit theme |
| Fallback navigation | **Yes** — subtle "skip the tour" menu for returning visitors, SEO, accessibility |
| Bot voice | **Text + voice** — speech bubbles always; spoken audio available, muted by default |
 
---
 
## 2. Orbie — Character Design Spec
 
**Personality:** Friendly, warm, a little playful — a helpful junior team member, not a corporate assistant. Speaks simple, confident English (matching Orbit's honest, direct brand voice). Occasional light humor, never cringe.
 
**Visual concept (space theme):**
- A small, rounded astronaut-style robot: glossy white/off-white body, big expressive digital eyes on a dark visor face-screen, small antenna, no legs — it **hovers** with a soft thruster glow.
- A thin glowing **ring orbits its body** (the "orbit" — the brand mark built into the character).
- Accent colors pulled from the current Orbit brand palette.
- Idle animations: gentle bobbing, blinking, occasionally looking around. Reaction animations: wave (greeting), point (directing attention), thumbs-up, thinking (hand-to-chin), celebrate (contact form submitted).
- Emotions shown on the visor: happy eyes, curious eyes, star eyes, etc.
**Build approach:**
- Model in Blender → export as compressed **glTF/GLB** (target under ~1.5 MB with Draco compression).
- Render with **Three.js via React Three Fiber**, animations as named glTF clips triggered by the dialogue engine.
- A lightweight **2D fallback** (pre-rendered sprite/Lottie of the same character) for low-end devices, save-data mode, and WebGL-unsupported browsers — the experience must never break because of the 3D.
---
 
## 3. The Experience Flow
 
**Scene 0 — Arrival (first 3 seconds):** Space-themed backdrop (subtle starfield, not noisy). Orbie floats in, waves. Sound is OFF by default; a small "🔊 Hear Orbie" toggle sits near the speech bubble. A quiet "Skip tour" link sits in the corner.
 
**Scene 1 — Greeting & orientation (~30–45 sec):** Orbie introduces itself and Orbit in 3–4 short speech bubbles: Pakistan-based AI software studio, clients in 8 countries, weekly demos, fixed prices, honest process. Each bubble types out; the visitor taps/clicks to advance (or auto-advance with a progress dot). Keep it tight — visitors give you seconds, not minutes.
 
**Scene 2 — The crossroads:** Orbie presents four floating option cards:
1. **What we do** (Services)
2. **Our work** (Portfolio)
3. **Who we are** (About + Team)
4. **Talk to us** (Contact)
Plus a fifth, smaller prompt: *"...or just ask me anything!"* (opens free-form AI chat).
 
**Scene 3 — Page-flip navigation:** On selection, a **book-style page-flip transition** turns the current view; Orbie flies across during the flip and lands on the new "page." Each destination is a focused single screen (no scroll): Orbie narrates 2–3 key points, the content is displayed visually beside it, and Orbie ends with a question — "Want to see a project like this?" / "Shall I take you to the contact page?" — always offering the next step plus a "back to options" choice.
 
**Per-section beats:**
- **Services:** Orbie walks through the 5 services one card at a time (AI Chatbots, Model Training, Web Platforms, Mobile Apps, Brand & Design). On "AI Chatbots" Orbie winks: *"That's what I am, by the way — Orbit built me."*
- **Portfolio:** Orbie deals out project cards (CampAlpha, WearBlend, etc.) like a hand of cards; visitor flips through, Orbie gives a one-liner on each.
- **About/Team:** Orbie introduces the founder and the small-studio-on-purpose philosophy; testimonials and the 30 five-star Fiverr reviews appear as floating quotes.
- **Contact:** Orbie collects name → email/WhatsApp → project idea **conversationally**, one question at a time (replacing the boring form), confirms, submits, celebrates. Phone, email, hours, and the digital vCard are also displayed plainly for people who just want the number.
**Free-form chat mode:** Anytime the visitor types instead of clicking, the hybrid AI takes over — answering from a knowledge base of Orbit's real content (services, pricing approach, process, FAQs). Orbie's animations react to the conversation (thinking pose while generating). If asked something off-topic or unknown: a graceful scripted redirect to booking a call.
 
**Return visits:** Orbie remembers (localStorage) and shortens the greeting: *"Welcome back! Want the tour again, or shall I take you somewhere?"*
 
---
 
## 4. Architecture & Tech Stack
 
**Frontend:**
- **Next.js** (matches Orbit's own stack — the site dogfoods what Orbit sells)
- **React Three Fiber + drei** for the 3D Orbie scene
- **GSAP or Framer Motion** for the page-flip transition and UI choreography
- Dialogue engine: a simple **state machine (XState or hand-rolled)** driving script nodes → each node = Orbie animation + speech text + audio clip + options. The whole tour is a JSON script file, so copy edits never require code changes.
**AI layer (hybrid):**
- Scripted tour = zero API calls.
- Free-form chat = serverless API route → **Claude (or similar) with RAG** over a small curated knowledge base of Orbit content. Strict system prompt: Orbie persona, only Orbit topics, always steer to contact. Rate-limited per visitor to cap costs.
**Voice:**
- Pre-generate all **scripted lines as audio files** with a high-quality TTS voice (ElevenLabs or similar) — one-time cost, instant playback, consistent voice, no per-visit TTS spend.
- Free-form AI answers: text-only by default; optionally streamed TTS later (Phase 3).
- Muted by default; preference remembered.
**Fallback & SEO (critical for a JS-heavy concept):**
- Every section exists as a **real, statically-rendered route** (`/services`, `/about`, `/portfolio`, `/contact`) with full HTML content — Google indexes normal pages; the Orbie layer sits on top.
- "Skip tour" reveals a minimal classic menu that jumps straight to those routes (still styled to match, Orbie parks quietly in the corner and stays summonable).
- `prefers-reduced-motion` → transitions become simple fades, Orbie's movement calms down.
- Full keyboard navigation and screen-reader support: speech bubbles are live-region text, option cards are real buttons.
**Performance budget:**
- First meaningful paint under ~2s on 4G: load a lightweight poster/2D Orbie instantly, stream the GLB in the background, swap seamlessly.
- Total initial payload target: < 2.5 MB including the model.
- Mobile-first: the entire experience designed for a phone screen first (tap to advance, cards stack vertically, 3D scene simplified on low GPU).
**Contact pipeline:** Conversational form → API route → email to info@orbitpk.com + WhatsApp notification; leads also logged (simple DB or Google Sheet).
 
---
 
## 5. Content To Write (script-first project)
 
This site is 50% writing. Before any 3D work is final, the full **Orbie script** should be written and read aloud:
1. Greeting + orientation script (3 variants: first visit, return visit, skip-tour minimal)
2. Per-section narration (Services ×5, Portfolio per-project one-liners, About, Contact flow)
3. Option card labels and transitions ("Off we go!", "Flipping the page...")
4. AI chat system prompt + knowledge base document (services, process, pricing approach, FAQs, tone rules)
5. Edge lines: errors, offline, "I didn't get that," off-topic redirects
---
 
## 6. Phased Roadmap
 
**Phase 1 — Foundations (Weeks 1–3):**
Orbie character concept art → 3D model + core animations; full tour script written; static fallback routes built with real content (this alone is already a shippable classic site — de-risks the whole project).
 
**Phase 2 — The Walkthrough (Weeks 4–7):**
Dialogue engine + JSON script format; page-flip transition system; Scenes 0–3 wired end-to-end; conversational contact flow; pre-generated voice lines; mobile pass.
 
**Phase 3 — The Brain (Weeks 8–9):**
RAG knowledge base + free-form chat; rate limiting + cost caps; analytics events (which options are picked, where visitors drop off, chat questions asked — gold for iterating).
 
**Phase 4 — Polish & Launch (Week 10):**
Performance tuning, accessibility audit, cross-device QA, sound design (subtle SFX), soft-launch on a subdomain (orbie.orbitpk.com or beta.orbitpk.com) → gather reactions → switch DNS.
 
---
 
## 7. Risks & Mitigations
 
| Risk | Mitigation |
|---|---|
| 3D too heavy on cheap phones | 2D sprite fallback; simplified scene on low GPU; poster-first loading |
| Visitors in a hurry get annoyed | "Skip tour" always visible; tap-to-fast-forward every bubble; contact info reachable in ≤2 clicks |
| SEO loss from an app-like site | Real static routes with full content under the experience layer |
| AI chat says something wrong | Hybrid design keeps 90% scripted; strict prompt + curated KB + tested; off-topic → redirect |
| LLM API costs | Free chat only on demand, rate-limited, small model; scripted tour costs nothing |
| Novelty wears off for repeat visitors | Return-visit short greeting; skip menu; Orbie gets out of the way fast |
| Voice autoplay blocked / annoying | Muted by default, opt-in toggle, preference saved |
 
---
 
## 8. Open Questions (for next session)
 
1. Final name: **Orbie** vs **Orbit AI** vs **Orbe**? (Plan assumes Orbie — friendly, ownable, easy to say.)
2. Language: English only, or English + Urdu toggle for local clients?
3. Who builds the 3D model — in-house design capability or commission a 3D artist?
4. Which LLM/API for the chat layer, and monthly cost ceiling?
5. Keep the blog? (It doesn't fit the walkthrough naturally — could live as a classic sub-section Orbie links out to.)
6. Domain strategy for soft launch: beta subdomain vs staged rollout?
---
 
## 9. What's on the current site (reference)
 
Orbit Innovations — Pakistan-based AI software studio, Islamabad, founded by Shehriyar Ali Rustam. Services: AI Chatbots, Model Training (fine-tuning/RAG), Web Platforms (Next.js), Mobile Apps (React Native), Brand & Design. Sections: About, Team, Careers, Blog, Services, Portfolio (10 projects incl. CampAlpha, WearBlend), Testimonials, Contact, digital vCard. Voice: confident, honest, "small studio, narrow on purpose." Contact: +92 327 5362412 · info@orbitpk.com · Mon–Sat 10:00–19:00 PKT. Social proof: 30 five-star Fiverr reviews. All this content migrates into Orbie's script and the static fallback routes.
 

