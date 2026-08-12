'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import QuickActions from './QuickActions'
import { DS_EASE } from './MotionReveal'

/**
 * Phone-only dock. Nearly every visit to this page comes from a camera pointed
 * at a printed card, so once the hero's action row scrolls away we keep call /
 * WhatsApp / email / save permanently within thumb reach.
 */
export default function StickyActionBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: DS_EASE }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-orbit-black/95 backdrop-blur-md md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <QuickActions variant="bar" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
