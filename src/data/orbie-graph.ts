import { STORYBOARD, type CaptionLine } from './storyboard'
import type { Advance } from '@/components/story/useStoryClock'
import type { OrbieEmotion, OrbiePose } from '@/components/orbie/character/types'

/**
 * Orbie's script, as a graph.
 *
 * Story Mode is a line: five scenes, one after another, done. Orbie is a map —
 * orientation, then a crossroads, then a section, then back to the crossroads —
 * so the script needs edges rather than an order.
 *
 * The orientation chapter is not rewritten here. It reuses Story Mode's scenes
 * directly, so the arrival narration exists in exactly one place and editing
 * `storyboard.ts` changes both experiences. Only the ending differs: Story Mode
 * finishes on a call to action, Orbie hands over to the crossroads.
 *
 * Facts still come from `src/data`, never from this file. See the no-digits
 * assertion at the bottom of `storyboard.ts` — it applies to the same writing
 * rule these nodes follow.
 */

export type ChapterId =
  | 'orientation'
  | 'services'
  | 'work'
  | 'about'
  | 'contact'

/**
 * Which component renders the node. Deliberately separate from the node id so
 * several nodes can share one view — the five service beats are one component
 * with a different `focus` each, not five components.
 */
export type ViewId =
  | 'arrival'
  | 'beat'
  | 'crossroads'
  | 'services'
  | 'work'
  | 'about'
  | 'contact'

/**
 * Every node id, listed once.
 *
 * This array is why `to:` and `next:` can be checked at compile time. Deriving
 * `NodeId` from it turns a mistyped edge into a type error rather than a dead
 * end a visitor discovers at runtime — which matters more than usual here,
 * because there is no test suite and no browser automation to catch one.
 */
export const NODE_IDS = [
  'arrival',
  'orient-build',
  'orient-ai',
  'orient-process',
  'crossroads',
  // Services is walked one practice at a time, per the spec. Five beats
  // sharing one view, distinguished by `focus`, not five components.
  'svc-chatbots',
  'svc-models',
  'svc-web',
  'svc-mobile',
  'svc-design',
  'svc-done',
  'work',
  'about',
  'contact',
] as const

export type NodeId = (typeof NODE_IDS)[number]

/** Where the tour starts. */
export const ORBIE_ENTRY: NodeId = 'arrival'

export interface OptionCard {
  id: string
  /** What the visitor reads on the card. */
  label: string
  /** One short line under it. Derive counts from data rather than typing them. */
  hint?: string
  to: NodeId
  /**
   * The classic route this mirrors. Used to prefetch, and to offer a real link
   * for anyone who would rather read the page than be walked through it.
   */
  href?: string
}

export interface StoryNode {
  id: NodeId
  chapter: ChapterId
  view: ViewId
  /** The full spoken line. Feed this to a TTS provider verbatim. */
  narration: string
  /** The same words, split for on-screen reveal. */
  lines: CaptionLine[]
  advance: Advance
  /** Where an `auto` node goes when it has no options. */
  next?: NodeId
  /** Choices on a `hold` node. A hold with no options is a dead end. */
  options?: OptionCard[]
  pose?: OrbiePose
  emotion?: OrbieEmotion
  /** A service or project slug, for views that render one item. */
  focus?: string
  /** Populated only once narration audio ships. */
  audio?: string
  /**
   * Shorter narration for a visitor who has already heard this node.
   *
   * Cheap to carry now, expensive to retrofit across every node later — and
   * without it, someone who comes back to the crossroads a third time sits
   * through the same introduction each time.
   */
  repeat?: { narration: string; lines: CaptionLine[] }
}

// ── Orientation ──────────────────────────────────────────────────────
// Reused from Story Mode rather than rewritten. `cta` is deliberately not
// mapped: that is where the two experiences diverge.
const [welcome, software, ai, journey] = STORYBOARD

export const ORBIE_GRAPH: Record<NodeId, StoryNode> = {
  arrival: {
    id: 'arrival',
    chapter: 'orientation',
    view: 'arrival',
    narration: welcome.narration,
    lines: welcome.lines,
    advance: { kind: 'auto', durationMs: welcome.durationMs },
    next: 'orient-build',
    pose: 'wave',
    emotion: 'happy',
    repeat: {
      narration: 'Welcome back. Where would you like to go?',
      lines: [{ text: 'Welcome back.', atMs: 0 }],
    },
  },

  'orient-build': {
    id: 'orient-build',
    chapter: 'orientation',
    view: 'beat',
    narration: software.narration,
    lines: software.lines,
    advance: { kind: 'auto', durationMs: software.durationMs },
    next: 'orient-ai',
    pose: 'idle',
    emotion: 'neutral',
  },

  'orient-ai': {
    id: 'orient-ai',
    chapter: 'orientation',
    view: 'beat',
    narration: ai.narration,
    lines: ai.lines,
    advance: { kind: 'auto', durationMs: ai.durationMs },
    next: 'orient-process',
    pose: 'idle',
    emotion: 'curious',
  },

  'orient-process': {
    id: 'orient-process',
    chapter: 'orientation',
    view: 'beat',
    narration: journey.narration,
    lines: journey.lines,
    advance: { kind: 'auto', durationMs: journey.durationMs },
    next: 'crossroads',
    pose: 'idle',
    emotion: 'neutral',
  },

  // ── The crossroads ─────────────────────────────────────────────────
  // The first `hold` node: it narrates, then stops and waits. Everything
  // returns here, so it is the one node that must never be a dead end.
  crossroads: {
    id: 'crossroads',
    chapter: 'orientation',
    view: 'crossroads',
    narration: 'So, where would you like to start?',
    lines: [{ text: 'So, where would you like to start?', atMs: 0 }],
    advance: { kind: 'hold', durationMs: 1800 },
    pose: 'point',
    emotion: 'happy',
    repeat: {
      narration: 'Anywhere else?',
      lines: [{ text: 'Anywhere else?', atMs: 0 }],
    },
    options: [
      { id: 'services', label: 'What we do', hint: 'Five practices', to: 'svc-chatbots', href: '/services' },
      { id: 'work', label: 'Our work', hint: 'Shipped projects', to: 'work', href: '/portfolio' },
      { id: 'about', label: 'Who we are', hint: 'The studio', to: 'about', href: '/about' },
      { id: 'contact', label: 'Talk to us', hint: 'Usually same day', to: 'contact', href: '/contact' },
    ],
  },

  // ── Services ───────────────────────────────────────────────────────
  // Five auto beats, one practice each, then a hold. Roughly twenty seconds
  // for the chapter: short enough that nobody is waiting for it to end, long
  // enough that each practice gets a sentence of its own.
  //
  // `focus` is a slug from services.ts. The view resolves it, so the names and
  // descriptions have exactly one home and adding a sixth service adds a beat
  // rather than a component.
  'svc-chatbots': {
    id: 'svc-chatbots',
    chapter: 'services',
    view: 'services',
    focus: 'ai-chatbot',
    // The wink the spec asks for, and the only line in the tour where Orbie
    // is the product being described.
    narration: 'Assistants trained on your own documents. That is what I am, by the way. Orbit built me.',
    lines: [
      { text: 'Assistants trained on your own documents.', atMs: 0 },
      { text: 'That is what I am, by the way.', atMs: 2100 },
    ],
    advance: { kind: 'auto', durationMs: 4600 },
    next: 'svc-models',
    pose: 'wave',
    emotion: 'happy',
  },

  'svc-models': {
    id: 'svc-models',
    chapter: 'services',
    view: 'services',
    focus: 'model-training',
    narration: 'Fine-tuning and retrieval pipelines on your data, rather than a generic API call.',
    lines: [
      { text: 'Fine-tuning and retrieval on your data.', atMs: 0 },
      { text: 'Not a generic API call.', atMs: 2200 },
    ],
    advance: { kind: 'auto', durationMs: 4400 },
    next: 'svc-web',
    pose: 'idle',
    emotion: 'curious',
  },

  'svc-web': {
    id: 'svc-web',
    chapter: 'services',
    view: 'services',
    focus: 'web-development',
    narration: 'Next.js platforms and marketing sites, built to load fast and to rank.',
    lines: [
      { text: 'Next.js platforms and marketing sites.', atMs: 0 },
      { text: 'Built to load fast, and to rank.', atMs: 2100 },
    ],
    advance: { kind: 'auto', durationMs: 4200 },
    next: 'svc-mobile',
    pose: 'idle',
    emotion: 'neutral',
  },

  'svc-mobile': {
    id: 'svc-mobile',
    chapter: 'services',
    view: 'services',
    focus: 'mobile-development',
    narration: 'One React Native codebase, shipped to both the App Store and Play.',
    lines: [
      { text: 'One React Native codebase.', atMs: 0 },
      { text: 'Shipped to both stores.', atMs: 1900 },
    ],
    advance: { kind: 'auto', durationMs: 4000 },
    next: 'svc-design',
    pose: 'idle',
    emotion: 'neutral',
  },

  'svc-design': {
    id: 'svc-design',
    chapter: 'services',
    view: 'services',
    focus: 'graphic-design',
    narration: 'And the brand work around all of it, built to survive contact with code.',
    lines: [
      { text: 'And the brand work around all of it,', atMs: 0 },
      { text: 'built to survive contact with code.', atMs: 1800 },
    ],
    advance: { kind: 'auto', durationMs: 4200 },
    next: 'svc-done',
    pose: 'idle',
    emotion: 'happy',
  },

  'svc-done': {
    id: 'svc-done',
    chapter: 'services',
    view: 'services',
    narration: 'That is all five. If your project falls outside them, we will say so on the first call.',
    lines: [
      { text: 'That is all five.', atMs: 0 },
      { text: 'Outside them, we say so on the first call.', atMs: 1700 },
    ],
    advance: { kind: 'hold', durationMs: 4400 },
    pose: 'point',
    emotion: 'neutral',
    repeat: {
      narration: 'The same five. Where next?',
      lines: [{ text: 'The same five. Where next?', atMs: 0 }],
    },
    options: [
      { id: 'work', label: 'See the work', to: 'work', href: '/portfolio' },
      { id: 'contact', label: 'Talk to us', to: 'contact', href: '/contact' },
      { id: 'back', label: 'Back to options', to: 'crossroads' },
    ],
  },

  // ── Work ───────────────────────────────────────────────────────────
  work: {
    id: 'work',
    chapter: 'work',
    view: 'work',
    narration:
      'A marketplace, a virtual try-on tool, a delivery platform. Every one of them live, with real users.',
    lines: [
      { text: 'A marketplace. A virtual try-on tool.', atMs: 0 },
      { text: 'A delivery platform.', atMs: 2100 },
      { text: 'Every one live, with real users.', atMs: 3600 },
    ],
    advance: { kind: 'hold', durationMs: 6000 },
    pose: 'point',
    emotion: 'star',
    repeat: {
      narration: 'The same four. Want the full list?',
      lines: [{ text: 'The same four. Want the full list?', atMs: 0 }],
    },
    options: [
      { id: 'all', label: 'See every project', hint: 'The full portfolio', to: 'crossroads', href: '/portfolio' },
      { id: 'contact', label: 'Talk to us', to: 'contact', href: '/contact' },
      { id: 'back', label: 'Back to options', to: 'crossroads' },
    ],
  },

  // ── About ──────────────────────────────────────────────────────────
  about: {
    id: 'about',
    chapter: 'about',
    view: 'about',
    narration:
      'Three founders, in Islamabad. The people who scope your project are the people who write it.',
    lines: [
      { text: 'Three founders, in Islamabad.', atMs: 0 },
      { text: 'The people who scope your project', atMs: 2000 },
      { text: 'are the people who write it.', atMs: 3300 },
    ],
    advance: { kind: 'hold', durationMs: 5600 },
    pose: 'idle',
    emotion: 'happy',
    repeat: {
      narration: 'Still the same three of us.',
      lines: [{ text: 'Still the same three of us.', atMs: 0 }],
    },
    options: [
      { id: 'team', label: 'Meet the team', to: 'crossroads', href: '/team' },
      { id: 'contact', label: 'Talk to us', to: 'contact', href: '/contact' },
      { id: 'back', label: 'Back to options', to: 'crossroads' },
    ],
  },

  contact: {
    id: 'contact',
    chapter: 'contact',
    view: 'contact',
    narration: 'Tell me what you are trying to build, and you will get a straight answer.',
    lines: [
      { text: 'Tell me what you are trying to build.', atMs: 0 },
      { text: 'You will get a straight answer.', atMs: 2000 },
    ],
    advance: { kind: 'hold', durationMs: 4000 },
    pose: 'thumbsUp',
    emotion: 'happy',
    options: [{ id: 'back', label: 'Back to options', to: 'crossroads' }],
  },
}

/**
 * The node order the clock indexes into.
 *
 * The clock addresses nodes by array index because that is what it has always
 * done and there was no reason to teach it about ids. The navigator resolves
 * an id to an index through this and calls `seekScene`.
 */
export const ORBIE_ORDER: NodeId[] = [...NODE_IDS]

export function nodeIndex(id: NodeId): number {
  return ORBIE_ORDER.indexOf(id)
}

// ── Dev-time graph integrity ─────────────────────────────────────────
// Everything here is a mistake that costs a visitor a dead end and throws
// nothing. The `NodeId` union already catches typos; these catch the shape
// errors a type cannot: a node nothing links to, a hold with no way out.
if (process.env.NODE_ENV !== 'production') {
  const warn = (msg: string) => console.warn(`[orbie-graph] ${msg}`)

  for (const id of NODE_IDS) {
    const node = ORBIE_GRAPH[id]

    if (node.advance.kind === 'hold' && !node.options?.length) {
      warn(`"${id}" holds but offers no options. A visitor reaching it cannot leave.`)
    }
    if (node.advance.kind === 'auto' && !node.next) {
      warn(`"${id}" advances automatically but has no next. The tour stops here.`)
    }
  }

  // Reachability from the entry node. An unreachable node is dead weight that
  // still typechecks, still ships, and is never seen.
  const seen = new Set<NodeId>()
  const queue: NodeId[] = [ORBIE_ENTRY]
  while (queue.length) {
    const id = queue.shift()!
    if (seen.has(id)) continue
    seen.add(id)
    const node = ORBIE_GRAPH[id]
    if (node.next) queue.push(node.next)
    for (const opt of node.options ?? []) queue.push(opt.to)
  }
  for (const id of NODE_IDS) {
    if (!seen.has(id)) warn(`"${id}" is unreachable from "${ORBIE_ENTRY}".`)
  }

  for (const id of NODE_IDS) {
    const node = ORBIE_GRAPH[id]
    const texts = [node.narration, ...node.lines.map((l) => l.text)]
    for (const t of texts) {
      if (/\d/.test(t)) {
        warn(`"${id}" has a digit in its narration: ${JSON.stringify(t)}. Derive it from src/data.`)
      }
    }
  }
}
