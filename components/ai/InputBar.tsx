'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Paperclip, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
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
  placeholder = 'Type a command or ask a question',
  isLoading,
  disabled,
  attachments = [],
  onAttach,
  onRemoveAttachment,
}: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading && !disabled) onSubmit()
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
    <div className="border-t border-[var(--color-card-border)] bg-[var(--color-bg)] px-4 pb-5 pt-3">
      <input {...getInputProps()} />

      {/* Attachment previews */}
      {attachments.length > 0 && onRemoveAttachment && (
        <div className="mx-auto mb-2 max-w-2xl">
          <AttachmentPreview files={attachments} onRemove={onRemoveAttachment} />
        </div>
      )}

      {/* ── Main input box ── */}
      <div
        className="mx-auto max-w-2xl overflow-hidden rounded-2xl border transition-all duration-200"
        style={{
          borderColor: value.length > 0
            ? 'rgba(255,117,31,0.35)'
            : 'var(--color-card-border)',
          background: 'var(--color-card-bg)',
          boxShadow: value.length > 0
            ? '0 0 0 3px rgba(255,117,31,0.08), 0 4px 24px rgba(0,0,0,0.12)'
            : '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          disabled={disabled}
          maxLength={10000}
          className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-sm leading-relaxed text-text-primary placeholder-text-tertiary focus:outline-none disabled:opacity-50"
        />

        {/* ── Bottom toolbar inside the box ── */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          {/* Left icons */}
          <div className="flex items-center gap-1.5">
            {/* Attach */}
            <button
              onClick={openFilePicker}
              disabled={isLoading || disabled}
              title="Attach file"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-text-tertiary transition-colors hover:bg-[var(--color-surface-2,rgba(255,255,255,0.05))] hover:text-text-primary disabled:opacity-40"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            {/* Keyboard shortcut badge */}
            <div className="flex h-8 items-center gap-1 rounded-xl px-2 text-[10px] text-text-tertiary/60">
              <span className="rounded border border-current px-1 py-0.5 font-mono leading-none">⌘</span>
              <span className="rounded border border-current px-1 py-0.5 font-mono leading-none">↵</span>
            </div>
          </div>

          {/* Right: Send / Stop */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.button
                key="stop"
                onClick={onStop}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex h-9 items-center gap-2 rounded-xl bg-[var(--color-card-border)] px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-400"
                title="Stop generating"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                <span>Stop</span>
              </motion.button>
            ) : (
              <motion.button
                key="send"
                onClick={onSubmit}
                disabled={!canSend}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                whileHover={canSend ? { scale: 1.04 } : undefined}
                whileTap={canSend ? { scale: 0.96 } : undefined}
                className="flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                  background: canSend ? '#FF751F' : 'var(--color-card-border)',
                  color: canSend ? '#fff' : 'var(--color-text-tertiary)',
                  boxShadow: canSend ? '0 0 16px rgba(255,117,31,0.35)' : 'none',
                }}
              >
                <ArrowUp className="h-3.5 w-3.5" />
                <span>Send</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer hint */}
      <p className="mx-auto mt-2 max-w-2xl text-center text-[10px] text-text-tertiary/40">
        ↵ to send · ⇧↵ new line · {value.length > 0 && `${value.length}/10000`}
      </p>
    </div>
  )
}
