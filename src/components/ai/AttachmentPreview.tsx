'use client'

import { X, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface AttachmentFile {
  file: File
  preview?: string
  type: 'image' | 'document'
}

interface AttachmentPreviewProps {
  files: AttachmentFile[]
  onRemove: (index: number) => void
}

export function AttachmentPreview({ files, onRemove }: AttachmentPreviewProps) {
  if (files.length === 0) return null

  return (
    <div className="border-t border-border bg-surface px-4 py-2">
      <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto">
        <AnimatePresence>
          {files.map((attachment, index) => (
            <motion.div
              key={`${attachment.file.name}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative flex-shrink-0"
            >
              {attachment.type === 'image' && attachment.preview ? (
                <div className="h-16 w-16 overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attachment.preview}
                    alt={attachment.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-border bg-surface-2">
                  <FileText className="h-5 w-5 text-text-secondary" />
                  <span className="mt-1 max-w-[56px] truncate text-[9px] text-text-tertiary">
                    {attachment.file.name.split('.').pop()?.toUpperCase()}
                  </span>
                </div>
              )}
              <button
                onClick={() => onRemove(index)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
