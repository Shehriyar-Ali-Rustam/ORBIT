'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Square, Paperclip } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { VoiceInput } from './VoiceInput'
import { AttachmentPreview, type AttachmentFile } from './AttachmentPreview'

interface InputBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onStop?: () => void
  placeholder?: string
  isLoading?: boolean
  disabled?: boolean
  attachments?: AttachmentFile[]
  onAttach?: (files: AttachmentFile[]) => void
  onRemoveAttachment?: (index: number) => void
}

export function InputBar({
  value,
  onChange,
  onSubmit,
  onStop,
  placeholder = 'Message Orbit AI...',
  isLoading,
  disabled,
  attachments = [],
  onAttach,
  onRemoveAttachment,
}: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading && !disabled) {
        onSubmit()
      }
    }
  }

  const { open: openFilePicker, getInputProps } = useDropzone({
    onDrop: (accepted) => {
      const mapped: AttachmentFile[] = accepted.map((file) => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        type: file.type.startsWith('image/') ? 'image' : 'document',
      }))
      onAttach?.(mapped)
    },
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
  })

  const canSend = (value.trim().length > 0 || attachments.length > 0) && !isLoading && !disabled

  return (
    <div className="border-t border-border bg-background">
      {/* Attachment previews */}
      {attachments.length > 0 && onRemoveAttachment && (
        <AttachmentPreview files={attachments} onRemove={onRemoveAttachment} />
      )}

      <div className="px-4 py-3">
      <input {...getInputProps()} />
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        {/* Attach button */}
        <button
          onClick={openFilePicker}
          disabled={isLoading || disabled}
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 text-text-secondary transition-colors hover:text-text-primary hover:border-accent disabled:opacity-40"
          title="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Textarea */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            maxLength={10000}
            className="w-full resize-none rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm leading-relaxed text-text-primary placeholder-text-tertiary transition-colors focus:border-[#FF751F]/50 focus:outline-none focus:ring-1 focus:ring-[#FF751F]/20 disabled:opacity-50"
          />
        </div>

        {/* Voice input */}
        <VoiceInput
          onTranscript={(text) => onChange(value ? value + ' ' + text : text)}
          disabled={disabled || isLoading}
        />

        {/* Send / Stop button */}
        {isLoading ? (
          <motion.button
            onClick={onStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-red-500 text-white transition-opacity hover:bg-red-600"
            title="Stop generating"
          >
            <Square className="h-4 w-4 fill-current" />
          </motion.button>
        ) : (
          <motion.button
            onClick={onSubmit}
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.05 } : undefined}
            whileTap={canSend ? { scale: 0.95 } : undefined}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-opacity disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </div>

      {/* Footer hints */}
      <div className="mx-auto mt-1.5 flex max-w-3xl items-center justify-between px-1">
        <span className="text-[10px] text-text-disabled">
          ⏎ Send &middot; ⇧⏎ New line
        </span>
        <span className="text-[10px] text-text-disabled">
          {value.length}/10000
        </span>
      </div>
      </div>
    </div>
  )
}
