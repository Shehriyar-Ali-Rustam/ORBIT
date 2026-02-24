'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { Send, Paperclip, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MessageType } from '@/types/marketplace'

interface MessageInputProps {
  onSend: (content: string, type: MessageType, file?: File) => void
  disabled?: boolean
}

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/20'

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleSend() {
    const trimmed = text.trim()

    if (selectedFile) {
      onSend(trimmed || selectedFile.name, 'file', selectedFile)
      setSelectedFile(null)
      setText('')
      return
    }

    if (!trimmed) return

    onSend(trimmed, 'text')
    setText('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function clearFile() {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      {/* File preview */}
      {selectedFile && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Paperclip className="h-4 w-4 shrink-0 text-text-tertiary" />
          <span className="min-w-0 flex-1 truncate text-sm text-text-secondary">
            {selectedFile.name}
          </span>
          <button
            type="button"
            onClick={clearFile}
            className="shrink-0 rounded p-0.5 text-text-tertiary transition-colors hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        {/* File attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={cn(
            'shrink-0 rounded-lg p-2.5 text-text-tertiary transition-colors hover:bg-surface hover:text-text-primary',
            disabled && 'cursor-not-allowed opacity-40'
          )}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className={cn(inputClass, disabled && 'cursor-not-allowed opacity-40')}
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !selectedFile)}
          className={cn(
            'shrink-0 rounded-lg bg-orange p-2.5 text-white transition-colors hover:bg-orange/90',
            (disabled || (!text.trim() && !selectedFile)) && 'cursor-not-allowed opacity-40'
          )}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
