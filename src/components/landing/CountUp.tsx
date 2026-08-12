'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/** Splits "+38", "3.2", "100" into its animatable parts, preserving decimals. */
function parse(value: string) {
  const match = value.match(/^([+-]?)(\d+(?:\.(\d+))?)(.*)$/)
  if (!match) return null
  return {
    sign: match[1] ?? '',
    number: parseFloat(match[2]),
    decimals: match[3]?.length ?? 0,
    suffix: match[4] ?? '',
  }
}

type Props = {
  value: string
  label: string
  duration?: number
}

export default function CountUp({ value, label, duration = 1400 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const parsed = parse(value)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView || !parsed) return

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // ease-out cubic
      setCurrent(parsed.number * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, duration, value])

  return (
    <div ref={ref}>
      <dt className="sr-only">{label}</dt>
      <dd className="text-4xl font-semibold tracking-tight text-orbit-greyLight md:text-5xl">
        {parsed ? (
          <>
            {parsed.sign}
            {current.toFixed(parsed.decimals)}
            <span className="text-orbit-acc">{parsed.suffix}</span>
          </>
        ) : (
          value
        )}
      </dd>
      <p className="eyebrow mt-3">{label}</p>
    </div>
  )
}
