import { FAQ } from '@/types'
import { Price } from '@/components/Price'

/**
 * `answer` renders on the page and may contain components; `answerText` is the
 * plain twin that feeds the FAQPage JSON-LD on /services. Keep the two saying
 * the same thing, or the structured data and the page disagree.
 */
export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How long does a project take?',
    answer:
      'A landing page is one to two weeks. A full application or AI build is four to eight. You get the date in writing before any money moves.',
    answerText:
      'A landing page is one to two weeks. A full application or AI build is four to eight. You get the date in writing before any money moves.',
  },
  {
    id: 'faq-2',
    question: 'What is your pricing model?',
    answer: (
      <>
        Fixed price per project. Small builds start from{' '}
        <Price usd={500} className="font-semibold text-text-primary" />, most applications land
        between <Price usd={2000} usdEnd={10000} className="font-semibold text-text-primary" />.
      </>
    ),
    answerText:
      'Fixed price per project. Small builds start from $500, most applications land between $2,000 and $10,000. Prices convert to your local currency on the site.',
  },
  {
    id: 'faq-3',
    question: 'Do you offer post-launch support?',
    answer:
      'Thirty days of bug fixes are included. Ongoing maintenance is available monthly, but it is optional.',
    answerText:
      'Thirty days of bug fixes are included. Ongoing maintenance is available monthly, but it is optional.',
  },
  {
    id: 'faq-4',
    // Was: "Our freelancer marketplace lets you browse and hire vetted
    // professionals individually." The marketplace is behind
    // MARKETPLACE_ENABLED = false and renders a Coming Soon screen, so that
    // answer invited people to do something the site cannot do.
    question: 'Can I hire one person rather than the studio?',
    answer:
      'Not yet. A marketplace for hiring individual Orbiters is in progress. For now, email us and we will scope it as a studio project.',
    answerText:
      'Not yet. A marketplace for hiring individual Orbiters is in progress. For now, email us and we will scope it as a studio project.',
  },
  {
    id: 'faq-5',
    question: 'Do you sign NDAs?',
    answer: 'Yes. Send yours over, or we will provide one.',
    answerText: 'Yes. Send yours over, or we will provide one.',
  },
  {
    id: 'faq-6',
    question: 'Where is your team based?',
    answer:
      'Islamabad, Pakistan, working remote-first. Most of our clients are in other time zones.',
    answerText:
      'Islamabad, Pakistan, working remote-first. Most of our clients are in other time zones.',
  },
]
