'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useTheme } from '@/components/ThemeProvider'

export function CursorGlow() {
  const { theme } = useTheme()
  const [visible, setVisible] = useState(false)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 })
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    if (!mediaQuery.matches) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    const handler = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [cursorX, cursorY, visible])

  if (theme !== 'dark' || !visible) return null

  return (
    <motion.div
      className="pointer-events-none fixed z-[9998] h-[300px] w-[300px] rounded-full"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        background:
          'radial-gradient(circle, rgba(255,117,31,0.06) 0%, transparent 70%)',
      }}
    />
  )
}
