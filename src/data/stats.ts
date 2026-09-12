import { projects } from './portfolio'
import { testimonials } from './testimonials'

/**
 * The numbers on the landing page.
 *
 * The first two are derived, not typed. They read "10" and "30" today, which
 * happens to be correct — and stays correct only until someone ships an
 * eleventh project and updates the portfolio but not this array. That is
 * exactly how the site came to claim ten projects on one page and "101+" on
 * another. Derived, the number moves everywhere at once.
 *
 * This lives in its own module rather than in `landing.ts` for a specific
 * reason: `landing.ts` exports `CARD`, which small components like the nav and
 * the sticky action bar import for a phone number. Putting these imports there
 * made every one of them pull in the full portfolio and testimonial datasets,
 * which cost about 6 kB on `/` — the page whose bundle matters most, since it
 * is the URL printed on the business card.
 */
export const STATS = [
  { value: String(projects.length), label: 'Projects shipped' },
  { value: String(testimonials.length), label: 'Five-star reviews' },
  { value: '8', label: 'Countries served' },
  { value: '24h', label: 'Reply window' },
] as const
