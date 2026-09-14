/**
 * The model's identity, in a module that imports nothing.
 *
 * It cannot live in `anthropic.ts`: that module constructs the SDK client, and
 * the SDK reaches for `node:fs` and `node:path`. `ModelBadge` is a client
 * component, so importing a value from there pulls the whole Node-only SDK
 * into the browser bundle and webpack fails on the unhandled `node:` scheme.
 *
 * The previous code imported `AIProvider` from the router and got away with
 * it only because `import type` is erased before webpack ever sees it.
 */
export const ANTHROPIC_MODEL = 'claude-sonnet-4-6'

/** Shown in the composer badge. Kept beside the id so the two cannot drift. */
export const MODEL_LABEL = 'Sonnet 4.6 · Claude'
