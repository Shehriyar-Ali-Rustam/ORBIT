// ── Story mode flags ─────────────────────────────────────────────────
// Story mode is a layer over the landing page, not a replacement for it.
// Both flags are build-time constants so the dead branch is dropped from
// the client bundle rather than shipped and skipped.

/**
 * Master switch. While `false`, `/` renders exactly as it always has and the
 * story is reachable only at `/?story=1` — which is how it stays testable in
 * production without being shown to visitors.
 */
export const STORY_ENABLED = false

/**
 * Narration audio. The engine runs on a timeline clock while this is `false`;
 * flipping it swaps in an audio-driven clock (see `useStoryClock.ts`). Nothing
 * else in the story needs to change.
 *
 * Turning this on requires MP3s in `public/story/audio/` — see STORY-MODE.md.
 */
export const STORY_AUDIO_ENABLED = false

/** Query param that force-opens the player regardless of `STORY_ENABLED`. */
export const STORY_QUERY_PARAM = 'story'

/** localStorage key holding the visitor's "no thanks" choice. */
export const STORY_CHOICE_KEY = 'orbit-story-choice-v1'

/**
 * The tour length, in seconds, as advertised on the entry gate.
 *
 * Deliberately a literal rather than derived from the storyboard. The gate ships
 * in the landing page's bundle and `/` is the printed QR code's destination, so
 * it must not drag the script and the project data in with it just to render the
 * word "thirty". `storyboard.ts` asserts in development that the two agree.
 */
export const STORY_SECONDS = 29
