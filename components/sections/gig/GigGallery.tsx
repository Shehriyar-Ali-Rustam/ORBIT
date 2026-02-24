'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface GigGalleryProps {
  images: string[]
}

export function GigGallery({ images }: GigGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) return null

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={`Gig image ${activeIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                idx === activeIndex
                  ? 'border-orange'
                  : 'border-border hover:border-text-tertiary'
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
