// ── Story mode flags ─────────────────────────────────────────────────
// Story mode is a layer over the landing page, not a replacement for it.
// Both flags are build-time constants so the dead branch is dropped from
// the client bundle rather than shipped and skipped.

/**
 * Master switch. While `false`, `/` renders exactly as it always has and the
 * story is reachable only at `/?story=1`.
 *
 * While `true`, the walkthrough IS the landing: a first-time visitor arrives
 * inside it rather than being offered it. The landing page still renders
 * underneath in the same HTML document, which is what keeps `/` indexable and
 * gives anyone who exits somewhere to land.
 */
export const STORY_ENABLED = true

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

/** localStorage key recording that this visitor has already seen the tour. */
export const STORY_SEEN_KEY = 'orbit-story-seen-v1'

/**
 * Replay the walkthrough on every single visit, not just the first.
 *
 * Left `false` deliberately. Someone who scanned the business card to get a
 * phone number should not sit through the tour a second time to reach it, and
 * a repeat visitor who has already watched it has told you they are past the
 * introduction. Set to `true` if you want it unconditional.
 */
export const STORY_REPLAY_EVERY_VISIT = false

/**
 * The tour length, in seconds, as advertised on the entry gate.
 *
 * Deliberately a literal rather than derived from the storyboard. The gate ships
 * in the landing page's bundle and `/` is the printed QR code's destination, so
 * it must not drag the script and the project data in with it just to render the
 * word "thirty". `storyboard.ts` asserts in development that the two agree.
 */
export const STORY_SECONDS = 29
