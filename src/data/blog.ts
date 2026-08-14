import type { BlogPost } from '@/types/blog'

export const posts: BlogPost[] = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'ai-chatbot-development-cost-pakistan',
    title: 'How Much Does AI Chatbot Development Cost in Pakistan?',
    excerpt:
      'Real numbers for what a custom AI chatbot costs in Pakistan in 2026, what changes the price, and how to avoid paying for things you do not need.',
    category: 'ai',
    author: 'Shehriyar Ali Rustam',
    publishedAt: '2026-07-13',
    readingMinutes: 7,
    keywords: [
      'AI chatbot development cost Pakistan',
      'chatbot price Pakistan',
      'custom AI chatbot cost',
      'WhatsApp chatbot development Pakistan',
      'AI development pricing',
    ],
    intro:
      'This is the first question almost every client asks us, and most agencies dodge it with "it depends." It does depend, but that is not a useful answer when you are trying to budget. So here are actual numbers, what drives them up or down, and where people waste money.',
    sections: [
      {
        heading: 'The short answer',
        paragraphs: [
          'In Pakistan, a custom AI chatbot typically costs between $200 and $2,000 depending on complexity. An enterprise system with custom model training runs higher. For comparison, the same build from a US or UK agency usually starts around $8,000.',
          'Here is how that breaks down in practice:',
        ],
        table: {
          head: ['Type of bot', 'Typical cost', 'Timeline'],
          rows: [
            ['FAQ bot on your website', '$200 to $500', '1 to 2 weeks'],
            ['Custom-trained business bot', '$500 to $2,000', '3 to 5 weeks'],
            ['WhatsApp or multi-channel bot', '$800 to $2,500', '3 to 6 weeks'],
            ['RAG system on your documents', '$3,000 to $15,000', '6 to 10 weeks'],
          ],
        },
      },
      {
        heading: 'What actually drives the price',
        paragraphs: [
          'The chat interface is the cheap part. Almost all of the cost sits in these five things:',
        ],
        bullets: [
          'Training data. If your knowledge lives in one clean FAQ document, this is fast. If it is scattered across PDFs, emails, and someone\'s head, expect real hours cleaning it up.',
          'Integrations. A bot that answers questions is simple. A bot that checks order status in your database, books appointments, or updates a CRM is a different project.',
          'Channels. Website only is straightforward. WhatsApp Business API adds Meta approval and per-message costs. Every extra channel adds work.',
          'Accuracy requirements. A bot that is usually right is cheap. A bot that must never give a wrong answer about pricing or medical information needs guardrails, testing, and fallback logic.',
          'Conversation design. Good bots feel natural because someone actually mapped out the flows. Bad bots feel like phone menus because nobody did.',
        ],
      },
      {
        heading: 'The running costs nobody mentions',
        paragraphs: [
          'Development is one payment. Running the bot is ongoing, and this catches people out. Budget for these monthly:',
        ],
        bullets: [
          'AI model API usage, roughly $10 to $200 per month depending on traffic and which model you use',
          'Hosting, often $0 to $20 for typical volume on modern platforms',
          'WhatsApp Business API messaging fees if you go that route, priced per conversation',
          'Maintenance and retraining as your business changes, since a bot trained on last year\'s pricing will confidently quote last year\'s pricing',
        ],
        callout:
          'A good rule of thumb: expect ongoing costs of roughly 5 to 10 percent of the build cost per month for a moderately busy bot.',
      },
      {
        heading: 'Where people waste money',
        paragraphs: [
          'Three patterns we see constantly:',
        ],
        bullets: [
          'Paying for a custom-trained model when a well-prompted off-the-shelf model would do the job. Fine-tuning is genuinely useful for narrow, specialised domains. It is overkill for answering questions about your services.',
          'Building for every channel on day one. Launch on your website, learn what people actually ask, then expand. You will build a better WhatsApp bot in month three than you would have in week one.',
          'Skipping the conversation design and then paying twice. Bots that were never mapped out get rebuilt. That is the most expensive kind of cheap.',
        ],
      },
      {
        heading: 'How to actually budget for this',
        paragraphs: [
          'Start by answering three questions before you talk to anyone:',
        ],
        bullets: [
          'What specific questions should this bot answer? Write down the top twenty. If you cannot, the bot is not ready to be built.',
          'What should happen when it does not know? Handoff to a human, take a message, or say it cannot help.',
          'Does it need to do anything, or only say things? Doing things costs meaningfully more than saying things.',
        ],
      },
    ],
    conclusion:
      'If you have a rough idea of what you want, we will give you an actual number rather than a range. We build AI chatbots from Islamabad for clients in Pakistan and abroad, and the first conversation is free. Tell us what you are trying to do and we will tell you what it costs and whether it is worth building.',
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: 'nextjs-vs-wordpress-business-website',
    title: 'Next.js vs WordPress: Which Should Your Business Website Use?',
    excerpt:
      'An honest comparison from a team that builds both. When WordPress is genuinely the right call, when it will hold you back, and how to decide.',
    category: 'web',
    author: 'Shehriyar Ali Rustam',
    publishedAt: '2026-07-10',
    readingMinutes: 8,
    keywords: [
      'Next.js vs WordPress',
      'best platform for business website',
      'WordPress alternative',
      'Next.js development Pakistan',
      'business website Pakistan',
    ],
    intro:
      'We build in both, so we have no religious attachment to either. WordPress powers a huge share of the web for good reasons. Next.js is what we reach for most often now, also for good reasons. Here is how to tell which one your project actually needs, without the usual sales pitch.',
    sections: [
      {
        heading: 'The honest summary',
        paragraphs: [
          'WordPress is right when non-technical people need to publish content constantly and the site is mostly pages and posts. Next.js is right when you need speed, custom functionality, or the site is closer to an application than a brochure.',
          'Most business sites in Pakistan default to WordPress out of habit, not analysis. Sometimes that is fine. Often it is not.',
        ],
        table: {
          head: ['', 'WordPress', 'Next.js'],
          rows: [
            ['Time to a simple site', 'Days', 'Weeks'],
            ['Speed out of the box', 'Slow without work', 'Fast by default'],
            ['Non-technical editing', 'Excellent', 'Needs a CMS added'],
            ['Custom features', 'Plugin dependent', 'Build anything'],
            ['Security maintenance', 'Constant', 'Minimal'],
            ['Hosting cost', '$5 to $50 per month', 'Often free tier'],
            ['Plugin ecosystem', 'Enormous', 'Write it yourself'],
          ],
        },
      },
      {
        heading: 'When WordPress is the right call',
        paragraphs: [
          'We will genuinely recommend WordPress if:',
        ],
        bullets: [
          'You publish content weekly and multiple non-technical people need to edit it',
          'Your budget is tight and the site is straightforward',
          'You need a specific plugin ecosystem, WooCommerce being the obvious example',
          'You want to be able to hire any of thousands of WordPress developers later',
        ],
        callout:
          'Choosing WordPress for a content-heavy site with a small budget is not a compromise. It is the correct decision.',
      },
      {
        heading: 'When WordPress will hold you back',
        paragraphs: [
          'The problems tend to show up six months in, not on launch day:',
        ],
        bullets: [
          'Speed. A typical WordPress site with a page builder and fifteen plugins is slow, and Google uses speed as a ranking factor. Fixing it properly costs more than building fast from the start.',
          'Plugin sprawl. Every plugin is code someone else maintains, or does not. Abandoned plugins are how most WordPress sites get hacked.',
          'Security. WordPress powers a huge share of the web, which makes it the biggest target. If you are not updating regularly, you will eventually have a bad week.',
          'Custom features. The moment you need something no plugin does, you are writing PHP inside someone else\'s architecture. That gets expensive fast.',
        ],
      },
      {
        heading: 'What Next.js actually gives you',
        paragraphs: [
          'The tradeoff is more upfront build time in exchange for these:',
        ],
        bullets: [
          'Genuinely fast pages, because the site is pre-rendered rather than assembled on every request',
          'No plugin security surface, because there are no plugins',
          'Any feature you can describe, because you are not working around a CMS\'s assumptions',
          'Modern hosting that is often free at typical business traffic',
          'A codebase that a competent developer can pick up in a week, versus untangling a decade of plugin decisions',
        ],
        callout:
          'You can also have both. Next.js for the site, a headless CMS like Sanity or Contentful behind it, so your team still edits content without touching code.',
      },
      {
        heading: 'How to decide in two minutes',
        paragraphs: [
          'Answer these honestly:',
        ],
        bullets: [
          'Will non-technical people edit content weekly? If yes and budget is tight, WordPress. If yes and budget allows, Next.js with a headless CMS.',
          'Is the site mostly pages and blog posts? WordPress is fine.',
          'Does it need custom logic, calculators, dashboards, integrations, or AI features? Next.js.',
          'Is speed or SEO commercially important? Next.js, or WordPress with a real performance budget and someone maintaining it.',
          'Do you already have a WordPress site that works? Then the question is not which platform. It is whether the pain justifies a rebuild.',
        ],
      },
    ],
    conclusion:
      'We build in both and we will tell you honestly which one your project needs, including when that answer is the cheaper one. If you are weighing a rebuild or starting fresh, send us what you are working with and we will give you a straight recommendation.',
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: 'how-we-built-campalpha-adventure-marketplace',
    title: 'How We Built CampAlpha, an Adventure Sports Marketplace',
    excerpt:
      'A build breakdown of CampAlpha: the problem, the architecture decisions we made, what we got wrong, and what we would do differently.',
    category: 'web',
    author: 'Shehriyar Ali Rustam',
    publishedAt: '2026-07-06',
    readingMinutes: 6,
    keywords: [
      'CampAlpha case study',
      'marketplace development Pakistan',
      'React Firebase marketplace',
      'adventure sports platform',
      'Orbit Innovations case study',
    ],
    intro:
      'CampAlpha is a marketplace for Pakistan\'s adventure sports community: gear, trips, and stories in one place. Here is how it actually got built, including the parts that did not go to plan.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Pakistan\'s adventure community was scattered across Facebook groups and WhatsApp. Gear sellers had no storefront. Trip organisers posted in groups that vanished into the feed within hours. Nobody had a home.',
          'The brief was to give that community one place that felt as good as the outdoors it served, and that worked on the phones people actually carry, on the connections they actually have.',
        ],
      },
      {
        heading: 'The decisions that mattered',
        paragraphs: [
          'Three calls shaped the whole build:',
        ],
        bullets: [
          'Photo-first design. Adventure sells on imagery. We built the layout around large photography from the start rather than fitting images into a text layout later.',
          'Firebase over a custom backend. The client needed to launch fast and iterate. Firebase gave real-time data and auth without us building or maintaining servers. For a marketplace at this stage, that was the right trade.',
          'Mobile-first, genuinely. Not "responsive as an afterthought." The primary user is on a mid-range Android on a patchy connection, so that was the target we designed and tested against.',
        ],
      },
      {
        heading: 'What we got wrong',
        paragraphs: [
          'The first version of the browse experience was too clever. We built rich filtering: by activity, region, difficulty, season. Users ignored almost all of it and just scrolled.',
          'We cut the filter panel down to two options and the engagement went up. That is a lesson we keep relearning: build the thing people asked for, not the thing that is interesting to build.',
        ],
        callout:
          'Every feature you add is a feature you maintain. The filters we removed were not a waste because we removed them. They were a waste because we built them before watching anyone use the site.',
      },
      {
        heading: 'The stack',
        paragraphs: [
          'Deliberately boring where it could be, so the interesting parts had room:',
        ],
        bullets: [
          'React for the interface, because the component model suited a catalogue of repeating cards',
          'Firebase for data, auth, and hosting, so no servers to maintain',
          'Aggressive image optimisation, because photo-first design on a slow connection is a contradiction unless you handle it',
        ],
      },
      {
        heading: 'What we would do differently',
        paragraphs: [
          'Two things:',
        ],
        bullets: [
          'Ship the browse page alone and watch people use it before building anything else. We would have found the filter problem in week one instead of week six.',
          'Plan for the community earlier. The stories section turned out to be what people came back for, and it was scoped as a nice-to-have. The thing you think is secondary is sometimes the product.',
        ],
      },
    ],
    conclusion:
      'CampAlpha is live at campalpha.web.app. If you are building a marketplace or a community platform and want a team that will tell you which features to cut, not just which to build, get in touch.',
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function getSortedPosts() {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}
