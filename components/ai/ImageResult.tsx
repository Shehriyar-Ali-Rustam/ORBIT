'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, RotateCcw, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface ImageResultProps {
  imageUrl: string
  enhancedPrompt: string
  originalPrompt: string
  onRegenerate: () => void
  isRegenerating?: boolean
}

export function ImageResult({
  imageUrl,
  enhancedPrompt,
  originalPrompt,
  onRegenerate,
  isRegenerating,
}: ImageResultProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  const handleDownload = async () => {
    try {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orbit-ai-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: open in new tab
      window.open(imageUrl, '_blank')
    }
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-text-secondary">
          Image generation failed. Try a different description.
        </p>
        <button
          onClick={onRegenerate}
          className="mt-3 text-sm font-medium text-[#FF751F] hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-xl border border-border"
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF751F]" />
            <p className="mt-3 text-xs text-text-secondary">Generating your image...</p>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={originalPrompt}
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>

      {/* Controls */}
      <div className="bg-surface p-4">
        {/* Enhanced prompt toggle */}
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          className="flex w-full items-center justify-between text-xs text-text-secondary transition-colors hover:text-text-primary"
        >
          <span>Enhanced prompt</span>
          {showPrompt ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        {showPrompt && (
          <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
            {enhancedPrompt}
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={!loaded}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FF751F] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:border-[#FF751F]/40 hover:text-text-primary disabled:opacity-50"
          >
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Regenerate
          </button>
        </div>
      </div>
    </motion.div>
  )
}
