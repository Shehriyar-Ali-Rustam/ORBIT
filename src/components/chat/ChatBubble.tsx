'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  isOpen: boolean
  onClick: () => void
}

export function ChatBubble({ isOpen, onClick }: ChatBubbleProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-orange-glow transition-colors',
        'bg-orange hover:bg-orange-hover',
        'max-sm:h-12 max-sm:w-12'
      )}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isOpen ? 'close' : 'open'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
