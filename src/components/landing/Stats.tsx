import MotionReveal from './MotionReveal'
import CountUp from './CountUp'
import { STATS } from '@/data/landing'

export default function Stats() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 md:px-10 md:py-20">
        <MotionReveal>
          <p className="eyebrow accent-rule">By the numbers</p>
        </MotionReveal>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <MotionReveal key={stat.label} delay={i * 0.06}>
              <CountUp value={stat.value} label={stat.label} />
            </MotionReveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
