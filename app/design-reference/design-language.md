# Design Language Reference (Bigfolio.co Style)

Apply this to all webapp projects unless told otherwise.

## Color Palette
- Background: dark base `#121212` (near-black) + white
- Accent cyan: `#70E6ED`
- Accent lime-green: `#CAF291` / `#a3ff91` / `#d7ffae`
- Accent pink: `#FFB3DB`
- Use accents sparingly for hover states, highlights, CTAs

## Typography
- Clean sans-serif font family
- Large hero headlines for impact
- Consistent sizing across body sections for scannability
- Professional hierarchy: hero > section headings > body

## Layout
- Grid-based with generous whitespace
- Minimalist, clean aesthetic
- Responsive — disable heavier animations on mobile (<=768px)

## Animation Philosophy: CSS-First, Lightweight
No heavy JS animation libraries (no GSAP, Framer Motion, AOS, Lenis).
All motion via CSS transitions + minimal @keyframes. React state toggles CSS classes.

### Timing & Easing Standards
- Micro-interactions: 0.3s duration
- Layout shifts (expand/collapse, card reveals): 0.35s-0.45s
- Header/nav transforms: 0.45s-0.9s
- Standard easing: `ease-in-out` or `cubic-bezier(.4, 0, .2, 1)` (Material Design)
- Looping animations: 3s+ with `ease-in-out`

### Animation Patterns to Use

**Header:**
- Hide/show on scroll with `transition: transform 0.9s ease`
- Background morphing: `transition: background-color 0.15s ease-in-out, width 0.45s cubic-bezier(.4,0,.2,1)`

**Buttons/CTAs:**
- Color transitions on hover: `transition: background-color, border-color, color 0.3s ease-in-out`
- Outline/border reveal on hover: opacity 0->1 with position offset animation
- Loading state: spinning loader `@keyframes spin { to { rotate(360deg) } }` at 0.8s linear infinite

**Cards:**
- Image area height change on hover: `transition: height 0.4s cubic-bezier(.4,0,.2,1)`
- Hidden content slide-up reveal: `transform: translateY(100%) -> translateY(0)` + `opacity: 0 -> 1` at 0.45s
- Link color shift to accent green on hover

**Accordions:**
- Height + opacity transitions: `transition: height 0.35s ease, opacity 0.3s ease`
- Plus-to-minus icon: rotate + fade the vertical bar

**Video/Media:**
- Pulsing rings: `@keyframes waves` scaling 0.3->1 with opacity pulse, 3s infinite, staggered delays (0s, 1s, 2s)
- Play button scale-up on hover (1.1x)
- Thumbnail brightness shift on hover (0.8 -> 1.0)

**Footer:**
- Logo slide-up: `translateY(35%) -> translateY(0)` on hover
- Link opacity 0.8 -> 1.0 with color transition

**Navigation:**
- Burger icon: 3-line to X morph via rotate(45deg) / scaleX(0) / rotate(-45deg)
- Mobile menu: fade + expand to full viewport
- Smooth scroll: `window.scrollTo({ behavior: "smooth" })`

### What NOT to Use
- No parallax effects
- No scroll-triggered reveal/fade-in animations
- No text typing or counter animations
- No page transition animations between routes
- No cursor/mouse-follow effects
- No infinite marquee/ticker
- No third-party animation libraries

## UI Components
- Card-based layouts for case studies / features
- Dropdown navigation with service categories
- Accordion sections for FAQ / expandable content
- Swiper/carousel for media galleries
- Pricing comparison tables
- Inline code snippet displays (if relevant)

## Responsive Strategy
- Mobile: disable card hover animations (`animation: none !important; transition: none !important`)
- Calendar/interactive elements: minimal 0.2s transitions
- Full viewport mobile menu with fade transition
