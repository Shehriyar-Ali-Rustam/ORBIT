# BOTCORE Design System — Portable Implementation Prompt

> **How to use this file:** Drop it into any project and tell Claude Code:
> *"Read DESIGN-SYSTEM-PROMPT.md and apply this design system to this app."*
> Everything below is extracted from a production React + Vite + Tailwind site. Values are exact — copy them literally, do not approximate.

---

## 0. Design Thesis (read this first)

This is a **technical-brutalist dark aesthetic**: near-black canvas, one screaming neon-green accent, monospace micro-labels, **zero border-radius**, hairline 1px borders instead of shadows, and generous vertical rhythm. It reads like a terminal that went to art school.

Five rules that define the whole look. If you break these, it stops being this design:

1. **Sharp corners everywhere.** No `rounded-*` on cards, buttons, inputs, badges, or images. The single exception is the fullscreen menu overlay panel (`rounded-2xl`).
2. **Borders, not shadows.** Depth comes from `1px solid rgba(255,255,255,0.08)` hairlines and near-invisible surface tints — never from drop shadows. (Shadows appear only on floating collage tiles.)
3. **One accent colour, used sparingly.** `#00FF00` is for accents, hovers, one highlighted word per heading, and CTAs. Never for body text. Never two accents in one component.
4. **Monospace is a UI material, not a code font.** Every label, badge, tag, button, stat caption, and nav item is uppercase monospace at 9–11px with 0.2–0.28em letter-spacing.
5. **Everything reveals on scroll.** No element just appears. All content fades + translates in via a shared reveal wrapper with staggered delays.

---

## 1. Dependencies

```bash
npm i react react-dom react-router-dom framer-motion lucide-react
npm i -D tailwindcss postcss autoprefixer
```

| Package | Role |
|---|---|
| `framer-motion` | All reveals, overlays, hero entrance, count-up in-view detection |
| `lucide-react` | Icon set — always `strokeWidth={1.25}` – `1.75`, never filled |
| `tailwindcss` v3 | Styling (utility-first + a small `@layer utilities` block) |
| `react-router-dom` v7 | Routing, scroll restoration |

Adapt for the target stack: Next.js → same Tailwind config, replace `react-router-dom` `Link`/`useLocation` with `next/link` + `usePathname`. React Native / Flutter → port the token table in §2 and the component recipes in §6, keeping zero corner radius and hairline borders.

---

## 2. Design Tokens

### 2.1 Colour

```js
// tailwind.config.js → theme.extend.colors
botcore: {
  green:     '#00FF00',  // the accent. Loud on purpose.
  greenDark: '#006400',  // rare, deep-state accent
  black:     '#0D0D0D',  // page canvas — NOT pure black
  ink:       '#151515',  // raised surface
  grey:      '#4D4D4D',  // muted dividers
  greyLight: '#E8E8E8',  // primary text — NOT pure white
  white:     '#FFFFFF',
}
```

**Opacity ladder** — the whole design is one text colour at varying alpha. Memorise this:

| Usage | Value |
|---|---|
| Headings / primary text | `text-botcore-greyLight` (100%) |
| Hero & lead paragraphs | `/85` |
| Body copy on sections | `/65` |
| Card body / secondary copy | `/60` |
| Eyebrow labels | `/55` |
| Inert arrows, meta | `/40` |
| Input placeholders | `/30` |

**Surfaces & borders**

| Token | Value |
|---|---|
| Section divider | `border-white/5` |
| Card border (rest) | `rgba(255,255,255,0.08)` |
| Card border (hover) | `rgba(0,255,0,0.4)` |
| Card fill (rest) | `rgba(255,255,255,0.018)` |
| Card fill (hover) | `rgba(255,255,255,0.035)` |
| Input / neutral chip border | `border-white/15` |
| Accent chip border | `border-botcore-green/40` |

**Text selection is branded** — do not skip this, it's a signature detail:
```css
*::selection { background: #00ff00; color: #0d0d0d; }
```

### 2.2 Typography

Load exactly these three families:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
```

```js
// tailwind.config.js → theme.extend.fontFamily
sans:    ['"Space Grotesk"', 'system-ui', 'sans-serif'],  // everything by default
mono:    ['"Space Mono"', 'ui-monospace', 'monospace'],   // labels, buttons, tags, meta
display: ['Syne', '"Space Grotesk"', 'sans-serif'],       // oversized uppercase display only
```

**Base body:** `font-size: 15px`, `line-height: 1.6`, `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`.

**Heading scale** — fluid `clamp()` utilities, negative tracking on all of them:

| Class | font-size | line-height | letter-spacing |
|---|---|---|---|
| `.h-hero` | `clamp(2.5rem, 5.5vw, 4.25rem)` | `0.95` | `-0.035em` |
| `.h-section` | `clamp(1.75rem, 2.5vw + 0.25rem, 2.25rem)` | `1.05` | `-0.025em` |
| `.h-card` | `clamp(1.125rem, 1vw + 0.25rem, 1.25rem)` | `1.2` | `-0.01em` |
| `.h-menu` | `clamp(1.75rem, 3vw + 0.25rem, 2.5rem)` | `1` | `-0.02em` |

Global: `h1,h2,h3,h4 { text-wrap: balance; letter-spacing: -0.02em; }` and `p { text-wrap: pretty; }`.

**Display type** (capability hero titles): Syne, uppercase, `font-size: clamp(3.5rem, 11vw, 9rem)`, `line-height: 0.95`, `tracking-tight`.

**The eyebrow** — the most-used element in the system:
```css
.eyebrow {
  font-family: 'Space Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(232, 232, 232, 0.55);
}
```
Recolour inline with `!important` variants: `.eyebrow !text-botcore-green`, `.eyebrow !text-botcore-black/70`.

### 2.3 Layout & Spacing

| Token | Value |
|---|---|
| Content max-width | `max-w-[1280px]` centred with `mx-auto` |
| Horizontal padding | `px-6 md:px-10` (hero uses `px-5 sm:px-6 md:px-10`) |
| Standard section padding | `py-24 md:py-28` |
| Tall section | `py-24 md:py-32` |
| Compact section | `py-16 md:py-20` |
| Top-of-page hero (fixed nav clearance) | `pt-36 md:pt-44` |
| Card grid gap | `gap-4` or `gap-5` |
| Section divider | `border-t border-white/5` on every section |

**Grid patterns actually used:**
- Label-left / content-right: `grid-cols-1 lg:grid-cols-12` + `lg:col-span-4` / `lg:col-span-8`, `gap-12 lg:gap-20`
- Asymmetric split: `lg:grid-cols-[1fr_1.4fr]` or `lg:grid-cols-[1fr_1.2fr]`
- Project cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-5`
- Capability cards: `grid-cols-2 lg:grid-cols-4`, `gap-4` (two-up on mobile, never one-up)
- Footer: `md:grid-cols-[1.5fr_1fr_1fr_1fr]`

### 2.4 Motion

| Token | Value |
|---|---|
| Signature easing | `cubic-bezier(0.22, 1, 0.36, 1)` (`[0.22, 1, 0.36, 1]`) |
| Reveal duration | `0.6s` |
| Stagger step | `0.04s` – `0.06s` per item (cap at `0.3s` for long lists) |
| Hover transitions | `0.25s` – `0.3s ease` |
| Image zoom | `duration-500` / `duration-700` |
| Card lift on hover | `hover:-translate-y-1` |
| Image scale on hover | `group-hover:scale-[1.04]` – `[1.05]` |

Always honour `@media (prefers-reduced-motion: reduce)` for looping/float animations.

---

## 3. Global CSS — copy verbatim

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { min-height: 100%; }

body {
  margin: 0;
  background: #0d0d0d;
  color: #e8e8e8;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

h1, h2, h3, h4 { text-wrap: balance; letter-spacing: -0.02em; }
p { text-wrap: pretty; }
*::selection { background: #00ff00; color: #0d0d0d; }

@layer utilities {
  .h-hero    { font-size: clamp(2.5rem, 5.5vw, 4.25rem);         line-height: 0.95; letter-spacing: -0.035em; }
  .h-section { font-size: clamp(1.75rem, 2.5vw + 0.25rem, 2.25rem); line-height: 1.05; letter-spacing: -0.025em; }
  .h-card    { font-size: clamp(1.125rem, 1vw + 0.25rem, 1.25rem);  line-height: 1.2;  letter-spacing: -0.01em; }
  .h-menu    { font-size: clamp(1.75rem, 3vw + 0.25rem, 2.5rem);    line-height: 1;    letter-spacing: -0.02em; }

  .eyebrow {
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(232, 232, 232, 0.55);
  }

  /* Neon tick to the LEFT of an eyebrow */
  .accent-rule::before {
    content: ''; display: inline-block;
    width: 28px; height: 1px; background: #00ff00;
    vertical-align: middle; margin-right: 12px;
  }

  /* Ticks on BOTH sides — for centred eyebrows */
  .accent-rule-both::before, .accent-rule-both::after {
    content: ''; display: inline-block;
    width: 28px; height: 1px; background: #00ff00;
    vertical-align: middle;
  }
  .accent-rule-both::before { margin-right: 12px; }
  .accent-rule-both::after  { margin-left: 12px; }

  /* Faint blueprint grid — layer behind hero/feature sections at 25–40% opacity */
  .grid-faint {
    background-image:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  .glow-green { text-shadow: 0 0 28px rgba(0, 255, 0, 0.35); }

  .card {
    background: rgba(255,255,255,0.018);
    border: 1px solid rgba(255,255,255,0.08);
    transition: border-color .3s ease, background .3s ease, transform .3s ease;
  }
  .card:hover {
    border-color: rgba(0,255,0,0.4);
    background: rgba(255,255,255,0.035);
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: #00ff00; color: #0d0d0d;
    padding: 14px 22px;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.24em; text-transform: uppercase;
    transition: transform .25s ease, background .25s ease;
  }
  .btn-primary:hover { background: #e8e8e8; transform: translateY(-1px); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    background: transparent; color: #e8e8e8;
    padding: 14px 22px;
    border: 1px solid rgba(232,232,232,0.25);
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.24em; text-transform: uppercase;
    transition: border-color .25s ease, color .25s ease;
  }
  .btn-ghost:hover { border-color: #00ff00; color: #00ff00; }

  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .animate-marquee { animation: marquee 40s linear infinite; }

  @keyframes float-a { 0%,100% { transform: translate(-50%,-50%) translateY(0); }  50% { transform: translate(-50%,-50%) translateY(-10px); } }
  @keyframes float-b { 0%,100% { transform: rotate(-4deg) translateY(0); }         50% { transform: rotate(-4deg) translateY(8px); } }
  @keyframes float-c { 0%,100% { transform: rotate(4deg) translateY(0); }          50% { transform: rotate(4deg) translateY(-8px); } }
  .collage-tile-centre { animation: float-a 7s ease-in-out infinite; }
  .collage-tile-left   { animation: float-b 6s ease-in-out infinite; }
  .collage-tile-right  { animation: float-c 8s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .collage-tile-centre, .collage-tile-left, .collage-tile-right { animation: none; }
  }
}
```

---

## 4. Tailwind Config

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        botcore: {
          green: '#00FF00', greenDark: '#006400',
          black: '#0D0D0D', ink: '#151515',
          grey: '#4D4D4D', greyLight: '#E8E8E8', white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        display: ['Syne', '"Space Grotesk"', 'sans-serif'],
      },
      dropShadow: { glow: '0 0 14px rgba(0,255,0,0.45)' },
    },
  },
  plugins: [],
};
```

> Rename the `botcore` namespace to the target project's brand name, and swap `#00FF00` for its accent if the brand demands. **Everything else stays.** If you change the accent, keep it high-chroma and use it at the same low frequency.

---

## 5. Signature Visual Devices

These are what make the design recognisable. Use at least four of the seven.

**1. Neon tick eyebrow** — `<div className="eyebrow accent-rule">Section label</div>`. Left-aligned sections use `accent-rule`; centred sections use `accent-rule-both`. Precedes almost every heading in the system.

**2. One green word per heading** — headings are `text-botcore-greyLight` with exactly one clause wrapped in `<span className="text-botcore-green">`. Hero-level headings add `glow-green`.
```jsx
<h2 className="h-section font-semibold text-botcore-greyLight">
  Everything your brand needs{' '}
  <span className="text-botcore-green glow-green">under one roof.</span>
</h2>
```

**3. Diagonal hazard stripes** — repeating 135° green dashes. Used as corner ticks on cards (growing on hover) and as decorative crop marks on heroes.
```jsx
<span aria-hidden
  className="absolute left-4 top-3 h-[3px] w-12 transition-all duration-300 group-hover:w-20"
  style={{ background: 'repeating-linear-gradient(135deg, rgba(0,255,0,0.7) 0 6px, transparent 6px 10px)' }} />
```

**4. Cursor-tracking radial glow** — cards light up under the pointer. Set CSS vars on mousemove:
```jsx
function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}
// inside the card, absolutely positioned, opacity-0 → group-hover:opacity-100:
style={{ background: 'radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(0,255,0,0.18), transparent 70%)' }}
```

**5. Green ambient bloom** — a soft radial wash bleeding from a section edge, always `pointer-events-none absolute inset-0`:
```jsx
style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,0,0.06) 0%, transparent 55%)' }}
```
Vary the origin per page: `20% 0%`, `80% 0%`, `50% 0%`.

**6. Blueprint grid overlay** — `<div className="grid-faint pointer-events-none absolute inset-0 opacity-30" aria-hidden />` behind heroes and feature sections.

**7. Diagonal texture bands** — near-invisible 125° stripes filling card backgrounds:
```jsx
style={{ background: 'repeating-linear-gradient(125deg, transparent 0 38px, rgba(255,255,255,0.025) 38px 76px)' }}
```

---

## 6. Component Recipes

### 6.1 `MotionReveal` — build this first, use it everywhere

```jsx
import { motion } from 'framer-motion';

const variants = {
  up:    { opacity: 0, y: 40 },
  down:  { opacity: 0, y: -40 },
  left:  { opacity: 0, x: -40 },
  right: { opacity: 0, x: 40 },
  scale: { opacity: 0, scale: 0.92 },
  fade:  { opacity: 0 },
};

export default function MotionReveal({
  children, delay = 0, y, from = 'up',
  duration = 0.6, amount = 0.2, once = true, className = '',
}) {
  const initial = y != null ? { opacity: 0, y } : variants[from] || variants.up;
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

Wrap every content block. Stagger lists with `delay={i * 0.05}`; cap long lists at `Math.min(i * 0.03, 0.3)`.

### 6.2 Fixed Navbar

- `fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[canvas]/80 backdrop-blur-md`
- Fixed `h-[80px]`, `px-6 md:px-10`, logo left, actions right
- Contextual **Back** button appears on all non-home routes: green-outlined, `border-botcore-green/50 bg-botcore-green/5`, fills solid green on hover. Uses `navigate(-1)` with a `/` fallback when there's no history.
- Primary CTA: solid green pill, `font-mono text-[10px] tracking-[0.2em]`, `hover:scale-[1.03]`, hidden below `sm`
- Menu toggle: `border-white/15`, label flips `Menu` ⇄ `Close`, icon swaps `Menu` ⇄ `X`
- Page content clears it via `pt-36 md:pt-44` on the first section

### 6.3 Fullscreen Menu Overlay

- `AnimatePresence` wrapper; backdrop fades `0.25s`
- Panel is **inset, not edge-to-edge**: `absolute inset-x-3 bottom-3 top-[88px] md:inset-x-6 md:bottom-6 md:top-[92px]`, `rounded-2xl border border-white/10 bg-[canvas]/95 backdrop-blur-xl`
- Panel slides in `y: -24 → 0` over `0.4s` with the signature easing
- Inside: green corner bloom + `grid-faint` at `opacity-40`
- Links in two columns, `.h-menu` scale, `border-b border-white/5` per row, `↗` glyph on the right that translates `+1` and turns green on hover
- Staggered entry: each `<li>` slides `x: -16 → 0` at `delay + i * 0.05`
- Locks `document.body.style.overflow`, closes on `Escape`, auto-closes on route change

### 6.4 Card

```jsx
<article className="card flex h-full flex-col gap-3 p-6">
  <span className="eyebrow !text-botcore-green">01</span>
  <h3 className="h-card font-semibold text-botcore-greyLight">Title</h3>
  <p className="text-sm leading-relaxed text-botcore-greyLight/60">Body copy.</p>
</article>
```
Numbered cards (`01`, `02`, …) as green eyebrows are a core motif — use them for values, steps, and process lists.

### 6.5 Feature / Capability Card (the showpiece)

Composition, bottom layer to top: diagonal texture band → cursor-glow layer (`opacity-0`, `group-hover:opacity-100`) → hazard-stripe corner tick (`w-12` → `group-hover:w-20`) → large outline icon (`h-10 w-10 sm:h-12 md:h-14`, `strokeWidth={1.25}`) → uppercase Syne title (`tracking-[0.16em]`) → `max-w-[22ch]` blurb → `mt-auto` green-outlined `9×9` arrow box that inverts to solid green on hover.

Container: `group relative flex h-full flex-col items-center gap-4 overflow-hidden border border-white/8 bg-white/[0.02] p-4 text-center transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-botcore-green/60 hover:bg-white/[0.04] sm:gap-5 sm:p-6 md:p-7`

Close the grid with an inverted **"See all"** card: `border-botcore-green/40 bg-botcore-green/[0.06]`, stronger glow (`0.28` alpha), arrow that slides on hover.

### 6.6 Project / Portfolio Card

```jsx
<Link className="card group block overflow-hidden">
  <div className="relative aspect-[4/3] overflow-hidden">
    <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
    <span className="eyebrow absolute left-4 top-4 !text-botcore-greyLight/70">01</span>
    <span className="eyebrow absolute right-4 top-4 !text-botcore-greyLight/70">2026</span>
  </div>
  <div className="flex items-center justify-between px-5 py-5">
    <div className="min-w-0 flex-1">
      <h3 className="h-card truncate font-semibold text-botcore-greyLight transition-colors group-hover:text-botcore-green">Name</h3>
      <ul className="mt-3 flex flex-wrap gap-1.5">{/* tag chips */}</ul>
    </div>
    <span aria-hidden className="ml-4 text-botcore-greyLight/40 transition-all group-hover:translate-x-1 group-hover:text-botcore-green">→</span>
  </div>
</Link>
```

Tag chip: `border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-botcore-greyLight/65 transition-colors group-hover:border-botcore-green/40`

**Missing-image fallback** — never show a grey box. Generate a hue-driven gradient:
```jsx
style={{ background: `linear-gradient(135deg, hsl(${hue} 42% 18%) 0%, #0d0d0d 75%)` }}
```
overlaid with a green radial at `opacity-40` and a `32px` white grid at `opacity-[0.07]`.

### 6.7 Buttons & Toggle Chips

- Primary: `.btn-primary` — solid green, **inverts to light grey on hover** (not a darker green)
- Secondary: `.btn-ghost` — transparent, `white/25` border, border+text go green on hover
- Both always carry a trailing `↗` or `→` glyph
- Filter / multi-select chips:
```jsx
className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${
  active
    ? 'border-botcore-green bg-botcore-green text-botcore-black'
    : 'border-white/15 text-botcore-greyLight/70 hover:border-botcore-green hover:text-botcore-green'
}`}
```
Pair filter rows with a live count in the corner: `<span className="ml-auto eyebrow">{filtered.length} / {total}</span>`

### 6.8 Forms

- The whole form is one `.card` with `p-6 md:p-8` and `gap-6`
- Header row inside the card: `<span className="eyebrow !text-botcore-green">// Project brief</span>` on the left, a muted eyebrow on the right. The `//` prefix is a deliberate code-comment motif.
- Labels are eyebrows: `className="eyebrow !text-botcore-greyLight/70"`, required marker `<span className="text-botcore-green">*</span>`
- Inputs: `border border-white/15 bg-transparent px-4 py-3 text-sm placeholder:text-botcore-greyLight/30 focus:border-botcore-green focus:outline-none` — **transparent fill, square corners, green focus border, no ring**
- Textareas add `resize-none`, `rows={5}`
- Multi-select uses the toggle chips from §6.7 with `aria-pressed`
- Submit is `.btn-primary` and swaps label + icon to `Sent ✓` on success

### 6.9 Inverted CTA Band

The one place the palette flips — a full-bleed green section, high impact, used once per page near the end:

```jsx
<section className="relative border-t border-white/5 bg-botcore-green text-botcore-black">
  <div className="pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden
    style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
    }} />
  <div className="relative mx-auto flex max-w-[1280px] flex-col items-start gap-8 px-6 py-24 md:flex-row md:items-end md:justify-between md:px-10 md:py-28">
    <MotionReveal from="left" className="max-w-2xl">
      <span className="eyebrow !text-botcore-black/70">Get in touch</span>
      <h2 className="h-hero mt-4 font-bold text-botcore-black">Ready to build?</h2>
      <p className="mt-6 max-w-md text-base leading-relaxed text-botcore-black/80">Supporting line.</p>
    </MotionReveal>
    <MotionReveal from="right" delay={0.15}>
      <a className="inline-flex items-center gap-2 border-2 border-botcore-black bg-transparent px-7 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-botcore-black transition-colors hover:bg-botcore-black hover:text-botcore-green">
        Start a project <span aria-hidden>↗</span>
      </a>
    </MotionReveal>
  </div>
</section>
```

Note the reciprocal reveal: left block enters from the left, right block from the right with a `0.15s` lag.

### 6.10 `CountUp` Stats

Animated numbers that fire once when scrolled into view, easing `1 - (1-t)³` over `1.4s`. Parses a string value into `{sign, number, decimals, suffix}` so `"+38"`, `"3.2"`, `"100"` all work, preserving decimal places.

```jsx
import { useInView } from 'framer-motion';
// ref + useInView(ref, { once: true, amount: 0.4 }) → requestAnimationFrame loop
```

Presentation: number in `text-4xl md:text-5xl font-semibold tracking-tight`, suffix in `text-botcore-green`, caption as `.eyebrow mt-3`. Lay out as a semantic `<dl>` grid: `grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10`.

### 6.11 Media Hero

- Fullscreen autoplay video: `autoPlay muted loop playsInline preload="metadata" aria-hidden`, `object-cover`, `pointer-events-none`
- **Three stacked scrims** — this is what keeps text readable over any footage:
  1. Vertical: `bg-gradient-to-b from-black/25 via-black/5 to-black`
  2. Radial hotspot behind the copy: `radial-gradient(ellipse 70% 70% at 22% 78%, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0.55) 35%, transparent 70%)`
  3. Mobile-only bottom fade: `absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-black`
- **Mobile ≠ desktop layout.** Mobile: video is a static `aspect-video` block with copy stacked underneath. Desktop (`md:`): video goes `absolute inset-0`, section becomes `md:flex md:min-h-[92vh] md:items-end` with copy overlaid bottom-left.
- Entrance stagger: eyebrow `0`, h1 `0.15`, paragraph `0.35`, buttons `0.5`
- Scroll cue: `.eyebrow` reading `scroll` above a `h-6 w-px bg-green/60` bar looping `y: [0, 5, 0]` over `1.6s`
- Detect video by extension so the same component handles images and video: `/\.(mp4|webm|mov)$/i.test(src)`

### 6.12 Footer

`border-t border-white/5`, grid `md:grid-cols-[1.5fr_1fr_1fr_1fr]`, `gap-12`, `py-16`. Brand block: wordmark in `text-2xl font-semibold uppercase tracking-[0.2em] text-botcore-green`, a `max-w-xs` description at `/55`, then square `10×10` social buttons (`border-white/10`, green on hover). Link columns are headed by `.eyebrow !text-botcore-green`. A second bar below, separated by another `border-white/5`, carries two eyebrow lines (copyright left, tagline right).

### 6.13 Timeline / Process Steps

Vertical list of cards where **each step carries its own accent colour** overriding the green — the only sanctioned multi-colour moment:
- `border-left: 3px solid {accent}` on the card
- A `12×12` diamond (`rotate-45`, `-translate-x-1/2`) pinned to the left edge, filled with the accent
- Header row: `STEP` in muted mono + `// 01` in the accent colour
- Title in Syne, `text-3xl md:text-4xl`, uppercase
- Reference ramp: `#FF3355 → #C13BFF → #7A3BFF → #3B7AFF → #3BD4D4`

### 6.14 Floating Collage

Three overlapping bordered tiles with independent float loops. Centre tile `w-[68%]` at `z-10` centred via `translate(-50%,-50%)`; left tile `w-[52%]` at `z-20` offset `-left-4 bottom-0`; right tile `w-[54%]` at `z-20` offset `-right-4 top-0`. Each: `border-2 border-botcore-green/70 shadow-[0_40px_120px_rgba(0,0,0,0.7)]`, on hover `border-botcore-green shadow-[0_50px_160px_rgba(0,255,0,0.25)]` and `z-30`. Container heights `h-[440px] sm:h-[640px] md:h-[820px] lg:h-[900px]`.

---

## 7. Page Composition Rules

**Home:** Hero (media) → About + stats → Capabilities grid → Portfolio → Inverted CTA → secondary showcase.

**Inner pages:** every one opens with the same header block — centred `eyebrow accent-rule-both`, `.h-hero` title with one green clause, `max-w-2xl` intro at `/65`, optional button pair. Wrapped in `border-b border-white/5` with a corner green bloom. Padding `pt-36 md:pt-44 pb-12 md:pb-16`.

**Case-study / detail pages** follow a fixed rhythm: full-bleed media hero with layered scrims → `<dl>` meta bar bordered `border-y border-white/10` → alternating label-left/content-right sections (`lg:col-span-4` / `lg:col-span-8`), each headed by an `accent-rule` eyebrow → stats → deliverables as a `divide-y divide-white/10` list with green `01` numbers → gallery → **next-item link** as a full-width hover row.

**Every page ends with the inverted green CTA band**, then the footer.

---

## 8. Behaviour & Accessibility

- Scroll to top on every route change (`behavior: 'instant'`)
- Route-level code splitting with `lazy()` + `<Suspense fallback={<div className="min-h-[60vh]" />} />` — the fallback reserves height to stop layout shift
- All decorative layers get `aria-hidden` **and** `pointer-events-none`
- Every icon-only control has an `aria-label`; menu button carries `aria-expanded` + `aria-controls`; overlay is `role="dialog" aria-modal="true"`
- Toggle chips use `aria-pressed`
- Stat blocks are real `<dl>/<dt>/<dd>`; nav and card lists are real `<ul>/<li>`
- All non-hero images use `loading="lazy"`
- Focus is shown by the **green border**, never a default ring — `focus:border-botcore-green focus:outline-none`
- Social icons are inline SVG, not an icon-font dependency
- URL-encode spaces in asset paths (`%20`) so filenames with spaces resolve

---

## 9. Implementation Order

1. Install deps, add the font `<link>`, write `tailwind.config.js` (§4) and the global CSS (§3).
2. Build `MotionReveal` (§6.1) — nothing else lands right without it.
3. Build the fixed Navbar + Menu Overlay (§6.2–6.3).
4. Build the inverted CTA band (§6.9) and Footer (§6.12) — they close every page.
5. Build Card, Feature Card, Project Card (§6.4–6.6).
6. Compose pages using the header pattern from §7.
7. Sweep for compliance with the checklist below.

---

## 10. Compliance Checklist

- [ ] Zero `rounded-*` outside the menu overlay panel
- [ ] Zero `shadow-*` outside floating collage tiles
- [ ] Canvas is `#0D0D0D`, text is `#E8E8E8` — neither is pure black or pure white
- [ ] Every section separated by `border-t border-white/5`
- [ ] Every section headed by an `.eyebrow` with `accent-rule` or `accent-rule-both`
- [ ] Every heading has exactly one green-highlighted clause
- [ ] Every label / button / tag / badge is uppercase `font-mono` at 9–11px with ≥0.2em tracking
- [ ] Every content block wrapped in `MotionReveal`, lists staggered
- [ ] Every card hover: border → green, background lifts, arrow translates `+1`
- [ ] All images `object-cover` with `group-hover:scale-[1.04]`
- [ ] Content capped at `max-w-[1280px]`, padded `px-6 md:px-10`
- [ ] Sections use `py-24 md:py-28`
- [ ] Custom `::selection` colours are set
- [ ] Decorative layers are `aria-hidden` + `pointer-events-none`
- [ ] `prefers-reduced-motion` disables looping animations
- [ ] Page ends with the inverted green CTA band

---

## 11. Adapting to Another Brand

Change **only** these; keep every structural rule:

| Swap | Constraint |
|---|---|
| Accent `#00FF00` | Must be high-chroma and legible against `#0D0D0D`. Used at low frequency only. |
| Canvas `#0D0D0D` | Stay in `#0A0A0A`–`#121212`. Never pure black. |
| Text `#E8E8E8` | Stay in `#E0E0E0`–`#F0F0F0`. Never pure white. |
| Sans `Space Grotesk` | Must be geometric with tight apertures. |
| Mono `Space Mono` | Must be a genuine monospace — this carries the whole UI-label layer. |
| Display `Syne` | Must be a wide, high-contrast display face. Optional; falls back to the sans. |
| Namespace `botcore` | Rename freely across the config and classnames. |

**Do not change:** zero radius, hairline borders, the opacity ladder, mono labels, `accent-rule` eyebrows, one-green-word headings, `MotionReveal` on everything, the `[0.22, 1, 0.36, 1]` easing, or the inverted CTA band.
