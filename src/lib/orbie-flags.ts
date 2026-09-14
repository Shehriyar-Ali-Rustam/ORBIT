// ── Orbie flags ──────────────────────────────────────────────────────
// Orbie is the bot-guided walkthrough (see revamp.md). It is built as an
// extension of Story Mode rather than a replacement, so these flags exist
// alongside the ones in story-flags.ts rather than superseding them.
//
// All build-time constants, so a disabled branch is dropped from the client
// bundle rather than shipped and skipped. `/` is the URL printed on the
// company's business card, so its bundle is the one that matters most.

/**
 * Master switch. While `false`, `/` behaves exactly as it does today — Story
 * Mode or the classic landing page, depending on STORY_ENABLED — and Orbie is
 * reachable only at `/?orbie=1`. That is how it stays reviewable in production
 * before it is shown to anyone.
 */
export const ORBIE_ENABLED = true

/**
 * Free-form chat. Gated separately from the tour because it is the only part
 * that costs money per visit: the scripted walkthrough makes zero API calls.
 *
 * Deliberately NOT wired to AI_ENABLED in flags.ts — that one gates seven
 * public /ai/* tool pages with a different product and cost profile, and
 * flipping it would expose all of them.
 */
export const ORBIE_CHAT_ENABLED = false

/**
 * The 3D character. While `false`, `Orbie.tsx` renders the SVG character and
 * `three` never enters the module graph at all — the dynamic import for the
 * 3D renderer sits behind this constant, so the branch is eliminated.
 *
 * Do not flip this for a GLB that misses the size budget. The 2D character is
 * the shipped product, not a placeholder waiting to be replaced.
 */
export const ORBIE_3D_ENABLED = false

/** Query param that force-opens Orbie regardless of `ORBIE_ENABLED`. */
export const ORBIE_QUERY_PARAM = 'orbie'

/** localStorage key recording that this visitor has already taken the tour. */
export const ORBIE_SEEN_KEY = 'orbie-seen-v1'

/** localStorage key for the sound preference. Muted until the visitor opts in. */
export const ORBIE_SOUND_KEY = 'orbie-sound-v1'

/**
 * Narration audio.
 *
 * While `false` the tour runs on a timeline clock and the captions carry the
 * narration alone. Flipping it swaps in `useOrbieAudioClock`, which returns the
 * identical `OrbieClock` shape — nothing downstream changes.
 *
 * Two things must be true before this goes on:
 *  1. `public/orbie/audio/<nodeId>.mp3` exists for every node, generated from
 *     each node's `narration` string verbatim.
 *  2. The script is frozen. Regenerating twenty-five clips after every copy
 *     edit is the failure mode this flag exists to defer.
 *
 * A node with no clip still works — the clock falls back to its duration — so
 * a partial set degrades rather than breaks.
 */
export const ORBIE_AUDIO_ENABLED = false
