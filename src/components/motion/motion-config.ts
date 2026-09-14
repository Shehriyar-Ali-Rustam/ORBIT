/**
 * One motion vocabulary for the whole marketing site.
 *
 * Before this file, every section declared its own `ease` constant and its own
 * duration, so nothing on the site moved in a way that felt related. Import
 * from here instead of writing a transition inline — if a section needs a
 * curve that is not in this file, that is a signal the section is wrong, not
 * that the file is missing an entry.
 */

/** The site's signature curve. Fast out, long settle. Never `linear`. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Weighty spring for anything with visual mass — cards entering, panels
 * expanding, images settling. Slow enough to read as physical.
 */
export const SPRING_SOFT = { type: 'spring', stiffness: 100, damping: 20 } as const

/**
 * Tight spring for UI that must answer instantly — tab indicators, popovers,
 * anything the pointer is already touching.
 */
export const SPRING_TIGHT = { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 } as const

/** Hover and focus. Short enough that it never feels like a delay. */
export const SNAP = { duration: 0.15, ease: 'easeOut' } as const

/**
 * Stagger step for lists. Long lists cap their total lead-in rather than
 * running a 12-item cascade the visitor has to sit through — see `capDelay`.
 */
export const STAGGER_STEP = 0.06

/**
 * Delay for the nth item in a staggered group, capped so a long list never
 * makes the last item wait. Use for manually-delayed children; the `Stagger`
 * component handles its own timing.
 */
export function capDelay(index: number, step = STAGGER_STEP, cap = 0.3): number {
  return Math.min(index * step, cap)
}
