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
  'services',
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
      { id: 'services', label: 'What we do', hint: 'Five practices', to: 'services', href: '/services' },
      { id: 'work', label: 'Our work', hint: 'Shipped projects', to: 'work', href: '/portfolio' },
      { id: 'about', label: 'Who we are', hint: 'The studio', to: 'about', href: '/about' },
      { id: 'contact', label: 'Talk to us', hint: 'Usually same day', to: 'contact', href: '/contact' },
    ],
  },

  // ── Section stubs ──────────────────────────────────────────────────
  // Phase 2 wires the graph; Phase 3 writes these properly. Each one already
  // narrates and returns to the crossroads, so the loop is complete and
  // navigable now rather than after the content lands.
  services: {
    id: 'services',
    chapter: 'services',
    view: 'services',
    narration: 'Chatbots, model training, web platforms, mobile apps, and the brand work around them.',
    lines: [
      { text: 'Chatbots, model training, web platforms,', atMs: 0 },
      { text: 'mobile apps, and the brand work around them.', atMs: 1800 },
    ],
    advance: { kind: 'hold', durationMs: 4000 },
    pose: 'point',
    emotion: 'neutral',
    options: [{ id: 'back', label: 'Back to options', to: 'crossroads' }],
  },

  work: {
    id: 'work',
    chapter: 'work',
    view: 'work',
    narration: 'Marketplaces, try-on tools, booking platforms. Every one of them shipped.',
    lines: [
      { text: 'Marketplaces, try-on tools, booking platforms.', atMs: 0 },
      { text: 'Every one of them shipped.', atMs: 2200 },
    ],
    advance: { kind: 'hold', durationMs: 4000 },
    pose: 'idle',
    emotion: 'star',
    options: [{ id: 'back', label: 'Back to options', to: 'crossroads' }],
  },

  about: {
    id: 'about',
    chapter: 'about',
    view: 'about',
    narration: 'A small studio in Islamabad. The people who scope your project are the people who write it.',
    lines: [
      { text: 'A small studio in Islamabad.', atMs: 0 },
      { text: 'The people who scope your project write it.', atMs: 1900 },
    ],
    advance: { kind: 'hold', durationMs: 4200 },
    pose: 'idle',
    emotion: 'happy',
    options: [{ id: 'back', label: 'Back to options', to: 'crossroads' }],
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
