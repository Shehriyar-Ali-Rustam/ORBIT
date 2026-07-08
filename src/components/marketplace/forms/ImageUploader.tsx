'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadFile, deleteFile, generateFilePath } from '@/lib/supabase/storage'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  bucket: 'gig-images' | 'profile-images'
  userId: string
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  label?: string
  className?: string
}

export function ImageUploader({
  bucket,
  userId,
  value,
  onChange,
  maxImages = 5,
  label = 'Upload Images',
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const remaining = maxImages - value.length
    const toUpload = files.slice(0, remaining)

    setUploading(true)
    try {
      const urls = await Promise.all(
        toUpload.map(async (file) => {
          const path = generateFilePath(userId, file.name)
          return uploadFile(bucket, path, file)
        })
      )
      onChange([...value, ...urls])
    } catch (err) {
      console.error('Upload failed:', err)
    }
    setUploading(false)

    if (inputRef.current) inputRef.current.value = ''
  }

  function handleRemove(index: number) {
    const url = value[index]
    const updated = value.filter((_, i) => i !== index)
    onChange(updated)

    // Try to delete from storage (non-blocking)
    try {
      const path = new URL(url).pathname.split('/').slice(-2).join('/')
      deleteFile(bucket, path).catch(() => {})
    } catch {}
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-text-primary">{label}</label>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-video overflow-hidden rounded-lg border border-border">
            <Image src={url} alt="" fill className="object-cover" sizes="200px" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-orange/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                Cover
              </span>
            )}
          </div>
        ))}

        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border transition-colors hover:border-orange hover:bg-orange-dim',
              uploading && 'pointer-events-none opacity-50'
            )}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-orange" />
            ) : (
              <Upload className="h-5 w-5 text-text-tertiary" />
            )}
            <span className="text-xs text-text-tertiary">
              {uploading ? 'Uploading...' : 'Add Image'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <p className="mt-2 text-xs text-text-tertiary">
        {value.length}/{maxImages} images. First image is the cover. Max 5MB each.
      </p>
    </div>
  )
}
