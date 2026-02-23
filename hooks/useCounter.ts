'use client'

import { useEffect, useState } from 'react'

export function useCounter(target: number, duration: number = 2000, enabled: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!enabled) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration, enabled])

  return count
}
