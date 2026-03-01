'use client'

import { useState, useRef } from 'react'
import { Send, Paperclip, X } from 'lucide-react'
import { uploadFile, generateFilePath } from '@/lib/supabase/storage'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  onSend: (content: string, fileUrl?: string, fileName?: string) => Promise<void>
  userId: string
  disabled?: boolean
}

export function MessageInput({ onSend, userId, disabled }: MessageInputProps) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSend() {
    const content = text.trim()
    if (!content && !file) return

    setSending(true)
    try {
      let fileUrl: string | undefined
      let fileName: string | undefined

      if (file) {
        const path = generateFilePath(userId, file.name)
        fileUrl = await uploadFile('message-attachments', path, file)
        fileName = file.name
      }

      await onSend(content || (fileName ? `Sent a file: ${fileName}` : ''), fileUrl, fileName)
      setText('')
      setFile(null)
    } catch (err) {
      console.error('Send failed:', err)
    }
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-surface p-3">
      {file && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-xs text-text-secondary">
          <Paperclip className="h-3 w-3 shrink-0" />
          <span className="flex-1 truncate">{file.name}</span>
          <button type="button" onClick={() => setFile(null)} className="text-text-tertiary hover:text-text-primary">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 rounded-lg p-2 text-text-tertiary hover:bg-background hover:text-text-primary"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled || sending}
          placeholder="Type a message..."
          className="max-h-32 min-h-[40px] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-orange focus:outline-none"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || sending || (!text.trim() && !file)}
          className={cn(
            'shrink-0 rounded-lg p-2 transition-colors',
            text.trim() || file
              ? 'bg-orange text-white hover:bg-orange-hover'
              : 'bg-surface text-text-tertiary'
          )}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
