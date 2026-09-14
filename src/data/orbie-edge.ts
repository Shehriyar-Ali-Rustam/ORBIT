/**
 * What Orbie says when something breaks.
 *
 * These are script, not strings in a `catch` block. The reason is voice: a
 * failure is the moment a character is most likely to drop, and until now
 * chat's failures were written in three different places by three different
 * authors. Two of them were not even in this file's language.
 *
 * `ChatView` used to render `data.error` straight from the API, so on a 503 a
 * visitor was told "Orbit AI is not configured right now" by a character who
 * has spent the last minute calling itself Orbie, and on a 429 got an
 * exclamation mark Orbie has never used. Those strings are correct for an API
 * response and wrong coming out of a face. The view maps status codes to these
 * lines instead and ignores the server's copy entirely.
 *
 * Every line ends with a way to reach a human that does not depend on the
 * thing that just failed. That rule is why `offline` points at the phone
 * number rather than at WhatsApp: a `tel:` link places a call with no data
 * connection at all, which is exactly the situation being described.
 *
 * Kept beside `orbie-contact.ts` rather than in `orbie-graph.ts`. The graph is
 * navigable nodes and asserts that every one of them is reachable from
 * `arrival`; edge lines are reachable from anywhere and from nothing, so they
 * would either break that assertion or quietly weaken it.
 */

export const CHAT_SCRIPT = {
  /** Before the first question, in place of an empty panel. */
  intro: 'Ask about what we build, how a project runs, or what something costs.',
  placeholder: 'Ask me anything',
} as const

export const EDGE_LINES = {
  /** No network at all. Named rather than blamed on Orbie, because telling
   *  someone their own connection dropped is the one piece of information
   *  that lets them fix it. */
  offline:
    'Looks like your connection dropped. I will be right here when it comes back, and the number on the dock still dials without one.',

  /** 429, the per-IP cap on the chat endpoint. */
  rateLimited:
    'That is a lot of questions in a short window. Give it a minute, or reach the team on WhatsApp.',

  /** 503: chat is flagged off, or the key or the rate limiter is missing. */
  unavailable:
    'My chat is not switched on yet. WhatsApp or email will reach the team directly.',

  /** Everything else: a 500, a malformed stream, a request that never landed. */
  failed: 'That did not come back. WhatsApp is the fastest way through right now.',
} as const

export type EdgeLine = keyof typeof EDGE_LINES
