# 21st.dev — UI Component Reference

Platform: https://21st.dev
A community-driven marketplace for React UI components, built on Radix UI + Tailwind CSS + Framer Motion.
700+ components from creators like Aceternity, shadcn, Designali, Reaviz, and more.

## Tech Stack (All Components)
- **Framework:** React 18+ (Next.js App Router compatible, "use client" directives)
- **Styling:** Tailwind CSS with CSS variables for theming
- **Primitives:** Radix UI (headless, accessible components)
- **Animation:** Framer Motion (primary), motion/react, CSS keyframes
- **Icons:** Lucide React, Tabler Icons
- **Utility:** `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- **Theme:** Dark/light mode via CSS variables + system preference detection

---

## Component Categories

### 1. Heros
Visual hero sections for landing pages.

### 2. Shaders
WebGL/shader-based backgrounds and effects.

### 3. Features
Feature showcase sections and grids.

### 4. AI Chat Components
Chat interfaces and AI-powered input components.

### 5. Calls to Action
CTA sections and conversion-focused blocks.

### 6. Buttons
Interactive button variants with micro-interactions.

### 7. Testimonials
Social proof and quote display components.

### 8. Pricing Sections
Pricing cards, comparison tables, tier displays.

### 9. Text Components
Typography effects, animated text, split-text reveals.

---

## Key Components (Detailed)

### BackgroundBeamsWithCollision (Aceternity)
Animated gradient beams falling from above with collision detection and particle explosion effects.

```tsx
<BackgroundBeamsWithCollision>
  <h2 className="text-4xl font-bold">Content Here</h2>
</BackgroundBeamsWithCollision>
```

**Props:** `children` (ReactNode), `className` (string)
**Beam config:** `initialX`, `translateX`, `duration` (3-11s), `delay`, `repeatDelay`, `rotate`, `className`
**Deps:** framer-motion, cn utility
**Features:** Real-time collision detection (50ms interval), 20 particles per explosion, dark/light mode, responsive height

---

### Timeline (Aceternity)
Chronological event display with sticky headers and scroll-animated gradient beam.

```tsx
const data = [
  { title: "2024", content: <div>...</div> },
  { title: "2023", content: <div>...</div> }
];
<Timeline data={data} />
```

**Props:** `data: { title: string, content: ReactNode }[]`
**Deps:** framer-motion (useScroll, useTransform, useMotionValueEvent)
**Features:** Scroll-progress gradient beam (purple->blue), sticky titles at `top: 40`, responsive (desktop large titles on left, mobile inline), dark mode

---

### Lamp (Aceternity)
Animated glowing lamp/light effect inspired by Linear's design. Great for section headers.

```tsx
<LampContainer>
  <motion.h1>Your content</motion.h1>
</LampContainer>
```

**Props:** `children` (ReactNode), `className` (string)
**Deps:** framer-motion
**Features:** Conic gradient light rays from both sides, blur layers (2xl, 3xl) for glow, cyan-400 light source, animates opacity + width on viewport entry, dark background (slate-950)

---

### Carousel (Aceternity)
3D perspective carousel with mouse-tracking parallax and smooth slide transitions.

```tsx
const slides = [
  { title: "Slide 1", button: "Explore", src: "image-url" }
];
<Carousel slides={slides} />
```

**Props:** `slides: { title: string, button: string, src: string }[]`
**Deps:** @tabler/icons-react, Tailwind
**Features:** 3D perspective transforms with scale + rotation, mouse-tracking parallax on active slide, 0.5s cubic-bezier transitions, responsive sizing (vmin units), image lazy-loading with fade-in, ARIA labels

---

### GlowingEffect (Aceternity)
Animated glowing border that follows mouse movement with configurable spread, blur, and interaction zones.

```tsx
<div className="relative h-full rounded-2xl border">
  <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
  {/* Card content */}
</div>
```

**Props:**
| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| blur | number | 0 | Blur intensity |
| inactiveZone | number | 0.7 | Inactive center radius multiplier |
| proximity | number | 0 | Detection range beyond element |
| spread | number | 20 | Gradient glow angle (degrees) |
| variant | "default" \| "white" | "default" | Color scheme |
| glow | boolean | false | Always-visible glow |
| disabled | boolean | true | Disable tracking |
| movementDuration | number | 2 | Animation duration (s) |
| borderWidth | number | 1 | Border thickness (px) |

**Deps:** motion/react, cn utility
**How it works:** Tracks pointermove + scroll events -> calculates distance via Math.hypot() -> inactive zone check -> angle via Math.atan2() -> animates conic-gradient mask

---

### FollowerPointerCard (Aceternity)
Custom animated cursor that follows mouse within a container, showing a directional arrow with colored label.

```tsx
<FollowerPointerCard title="Click me">
  <div>Your content</div>
</FollowerPointerCard>
```

**Props:** `children` (ReactNode), `className` (string), `title` (string | ReactNode)
**Deps:** framer-motion (AnimatePresence, motion, useMotionValue)
**Features:** 7-color random palette (sky, neutral, teal, green, blue, red, yellow), SVG arrow rotated -70deg, animated scale + opacity, z-index 50, hides default cursor

---

### Compare (Aceternity)
Interactive image comparison slider with drag/hover modes, autoplay, and sparkle particle effects.

```tsx
<Compare
  firstImage="/before.jpg"
  secondImage="/after.jpg"
  slideMode="hover"
  autoplay={true}
  autoplayDuration={5000}
/>
```

**Props:**
| Prop | Type | Default |
|------|------|---------|
| firstImage | string | - |
| secondImage | string | - |
| initialSliderPercentage | number | 50 |
| slideMode | "hover" \| "drag" | "hover" |
| showHandlebar | boolean | true |
| autoplay | boolean | false |
| autoplayDuration | number | 5000 |

**Deps:** framer-motion, @tabler/icons-react, @tsparticles/react + slim
**Features:** Gradient divider line, sparkle particles along divider, CSS clipPath for image reveal, requestAnimationFrame for smooth performance, stops autoplay on user interaction

---

### CodeBlock (Aceternity)
Syntax-highlighted code display with tabbed samples and copy-to-clipboard.

```tsx
<CodeBlock language="typescript" filename="app.ts" code={codeString} highlightLines={[1, 3]} />
// OR with tabs:
<CodeBlock tabs={[{ name: "index.ts", code: "...", language: "typescript" }]} />
```

**Props:** `language` (string), `filename` (string), `highlightLines` (number[]), `code` (string), `tabs` ({ name, code, language?, highlightLines? }[])
**Deps:** react-syntax-highlighter (atom-dark theme), lucide-react (Check, Copy)
**Features:** Prism.js highlighting, multi-tab support, auto-reset copy state (2s), line numbers, dark slate-900 bg

---

### HeroShader (Designali)
Animated mesh gradient background with glass effect SVG filters.

```tsx
<ShaderBackground>
  <h1>Your content</h1>
</ShaderBackground>
```

**Props:** `children` (ReactNode)
**MeshGradient config:** `colors` (hex[]), `speed` (number), `wireframe` (boolean), `backgroundColor` (hex)
**Deps:** @paper-design/shaders-react
**Features:** SVG feTurbulence + feDisplacementMap + feGaussianBlur filters, dual MeshGradient layers with opacity blending, mouse enter/leave interactivity, min-height 650px

---

## shadcn/ui Base Components

### Tabs
Layered tab panels built on Radix UI primitives.
**Exports:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
**Deps:** @radix-ui/react-tabs
**Features:** Keyboard nav, focus management, active state shadow, muted background

### Calendar
Date picker built on react-day-picker with DayPicker.
**Exports:** `Calendar`
**Deps:** react-day-picker, lucide-react (ChevronLeft/Right), buttonVariants
**Features:** Month/year nav, selection states (selected, today, outside, disabled, range), responsive flex, ARIA attributes

### HoverCard
Preview content behind a link on hover.
**Exports:** `HoverCard`, `HoverCardTrigger`, `HoverCardContent`
**Deps:** @radix-ui/react-hover-card
**Features:** Animate in/out (fade + zoom + slide from side), z-50, rounded border, shadow-md, configurable align + sideOffset

### Input
Standard form input with full HTML attribute support.
**Exports:** `Input`
**Deps:** cn utility
**Features:** h-10, rounded-md, ring focus states, disabled styling, file input support, forwardRef

### Skeleton
Loading placeholder component.
**Exports:** `Skeleton`
**Features:** Animated pulse effect, customizable dimensions via className

### Select
Dropdown select built on Radix primitives.
**Deps:** @radix-ui/react-select

---

## Common Patterns Across 21st.dev Components

### Utility Function (Required by all)
```tsx
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Standard Dependencies
```json
{
  "framer-motion": "^11.x",
  "@radix-ui/react-*": "various",
  "lucide-react": "^0.400+",
  "class-variance-authority": "^0.7",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "tailwindcss": "^3.4+"
}
```

### Component Conventions
- All use `"use client"` directive for Next.js App Router
- All use `React.forwardRef` for DOM ref forwarding
- All set `displayName` for DevTools debugging
- All accept `className` prop for composition
- All use `cn()` utility for class merging
- Styling via Tailwind CSS utility classes
- CSS variables for theme tokens (--background, --foreground, --primary, etc.)
- ARIA attributes for accessibility
- Dark mode via `dark:` Tailwind prefix or CSS variable switching

### Theme Variables (shadcn convention)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... inverted values */
}
```
