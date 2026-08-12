import Image from 'next/image'
import Link from 'next/link'
import MotionReveal from './MotionReveal'
import { projects } from '@/data/portfolio'

/**
 * Hand-picked rather than filtered on `featured`: these four are the shots that
 * are real product screenshots, which is what convinces someone holding a card.
 */
const PICKS = ['campalpha', 'cheezy-heaven', 'wearblend', 'movie-recommendation-engine'] as const

const selected = PICKS.map((slug) => projects.find((p) => p.slug === slug)).filter(
  (p): p is NonNullable<typeof p> => Boolean(p)
)

export default function SelectedWork() {
  return (
    <section id="work" className="border-t border-white/5">
      <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-6 md:px-10 md:py-28">
        <MotionReveal>
          <p className="eyebrow accent-rule">Selected work</p>
        </MotionReveal>

        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <MotionReveal from="left">
            <h2 className="h-section max-w-xl font-semibold text-orbit-greyLight">
              Ten projects out the door.{' '}
              <span className="text-orbit-acc">Four of them here.</span>
            </h2>
          </MotionReveal>
          <MotionReveal from="right" delay={0.1}>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 font-spacemono text-[10px] font-bold uppercase tracking-[0.24em] text-orbit-greyLight/70 transition-colors hover:text-orbit-acc"
            >
              Full portfolio
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </MotionReveal>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {selected.map((project, i) => (
            <li key={project.slug}>
              <MotionReveal delay={Math.min(i * 0.06, 0.3)} className="h-full">
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="card group block h-full overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orbit-black/70 via-transparent to-orbit-black/30"
                    />
                    <span className="eyebrow absolute left-4 top-3 !text-orbit-greyLight/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="eyebrow absolute right-4 top-3 !text-orbit-greyLight/70">
                      {project.completedAt.slice(0, 4)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between px-5 py-5">
                    <div className="min-w-0 flex-1">
                      <h3 className="h-card font-semibold text-orbit-greyLight transition-colors group-hover:text-orbit-acc">
                        {project.title.split(' - ')[0]}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-orbit-greyLight/60">
                        {project.shortDescription}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <li
                            key={tech}
                            className="border border-white/15 px-2.5 py-1 font-spacemono text-[9px] uppercase tracking-[0.2em] text-orbit-greyLight/65 transition-colors group-hover:border-orbit-acc/40"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span
                      aria-hidden
                      className="ml-3 mt-1 text-orbit-greyLight/40 transition-all group-hover:translate-x-1 group-hover:text-orbit-acc"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </MotionReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
