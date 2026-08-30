import { projects } from './portfolio'

/**
 * The Story Mode script.
 *
 * This is the only file you edit to change what the story says. Nothing here
 * imports engine code, and the engine imports nothing else for its content.
 *
 * It is TypeScript rather than JSON for one reason: the site already states
 * contradictory facts about itself (10 projects on the landing page, "101+" on
 * the parked homepage, a 5.0 rating in two places and 4.9 in another). A
 * narrated tour is the worst possible place to add a fourth number, so the
 * count is derived from the actual project list instead of typed.
 */

export type SceneId = 'welcome' | 'software' | 'ai' | 'journey' | 'cta'

export interface CaptionLine {
  text: string
  /** Offset from the start of the scene, in ms, when this line appears. */
  atMs: number
}

export interface Scene {
  id: SceneId
  /** The full spoken line. Feed this to a TTS provider verbatim. */
  narration: string
  /** The same words, split for on-screen reveal. */
  lines: CaptionLine[]
  durationMs: number
  /** Populated only once audio ships. See STORY_AUDIO_ENABLED. */
  audio?: string
}

/** Spells a small number so narration reads as speech, not as a spec sheet. */
function spell(n: number): string {
  const words = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
    'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  ]
  return words[n] ?? String(n)
}

/** Derived, not typed. Add an eleventh project and the story says "Eleven". */
const SHIPPED = spell(projects.length)
const SHIPPED_TITLE = SHIPPED.charAt(0).toUpperCase() + SHIPPED.slice(1)

export const STORYBOARD: Scene[] = [
  {
    id: 'welcome',
    narration:
      "Hi, I'm Orbit AI. Welcome to Orbit Innovations. Give me thirty seconds and I'll show you what we build.",
    lines: [
      { text: "Hi, I'm Orbit AI.", atMs: 0 },
      { text: 'Welcome to Orbit Innovations.', atMs: 1400 },
      { text: "Give me thirty seconds and I'll show you what we build.", atMs: 2900 },
    ],
    durationMs: 5000,
  },
  {
    id: 'software',
    narration: `We engineer custom software end to end. ${SHIPPED_TITLE} products shipped for clients in eight countries.`,
    lines: [
      { text: 'We engineer custom software end to end.', atMs: 0 },
      { text: 'Next.js platforms. React Native apps.', atMs: 2200 },
      { text: `${SHIPPED_TITLE} shipped, for clients in eight countries.`, atMs: 4200 },
    ],
    durationMs: 6500,
  },
  {
    id: 'ai',
    // "voice assistants like me" is only true once Orbit AI actually speaks.
    // Add the two words when STORY_AUDIO_ENABLED flips, not before.
    narration:
      'AI is our home turf. Chatbots trained on your own documents, fine-tuned models, and voice assistants.',
    lines: [
      { text: 'AI is our home turf.', atMs: 0 },
      { text: 'Chatbots trained on your own documents.', atMs: 1600 },
      { text: 'Fine-tuned models. Voice assistants.', atMs: 3600 },
    ],
    durationMs: 7000,
  },
  {
    id: 'journey',
    narration:
      'From the first call to handover, we run the whole build. Code and accounts end up yours.',
    lines: [
      { text: 'From the first call to handover, we run the whole build.', atMs: 0 },
      { text: 'Code and accounts end up yours.', atMs: 2600 },
    ],
    durationMs: 5000,
  },
  {
    id: 'cta',
    narration: "Ready to build something? Let's talk, or explore at your own pace.",
    lines: [
      { text: 'Ready to build something?', atMs: 0 },
      { text: "Let's talk, or explore at your own pace.", atMs: 1500 },
    ],
    durationMs: 5000,
  },
]

/** Total runtime. */
export const STORY_DURATION_MS = STORYBOARD.reduce((sum, s) => sum + s.durationMs, 0)

// The gate advertises a length without importing this file (see STORY_SECONDS
// in lib/story-flags.ts). Catch the two drifting apart in development, where
// someone retiming a scene will actually see it.
if (process.env.NODE_ENV !== 'production') {
  const advertised = 29
  const actual = Math.round(STORY_DURATION_MS / 1000)
  if (actual !== advertised) {
    console.warn(
      `[storyboard] Runtime is ${actual}s but the gate advertises ${advertised}s. ` +
        'Update STORY_SECONDS in src/lib/story-flags.ts.'
    )
  }
}
