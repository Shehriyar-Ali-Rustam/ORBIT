'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadGigImage } from '@/lib/firebase/storage'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  sellerId: string
  gigId: string
}

interface UploadProgress {
  fileName: string
  progress: number
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  sellerId,
  gigId,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxImages - images.length
      if (remaining <= 0) {
        toast.error(`Maximum ${maxImages} images allowed.`)
        return
      }

      const filesToUpload = acceptedFiles.slice(0, remaining)

      if (acceptedFiles.length > remaining) {
        toast.error(
          `Only ${remaining} more image${remaining === 1 ? '' : 's'} can be added.`
        )
      }

      setUploading(true)
      setUploadProgress(
        filesToUpload.map((f) => ({ fileName: f.name, progress: 0 }))
      )

      const newUrls: string[] = []

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        try {
          setUploadProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, progress: 50 } : p
            )
          )

          const url = await uploadGigImage(
            sellerId,
            gigId,
            file,
            images.length + i
          )

          newUrls.push(url)

          setUploadProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, progress: 100 } : p
            )
          )
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      if (newUrls.length > 0) {
        onImagesChange([...images, ...newUrls])
        toast.success(
          `${newUrls.length} image${newUrls.length === 1 ? '' : 's'} uploaded successfully!`
        )
      }

      setUploading(false)
      setUploadProgress([])
    },
    [images, maxImages, sellerId, gigId, onImagesChange]
  )

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onImagesChange(updated)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || images.length >= maxImages,
  })

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-all',
          isDragActive
            ? 'border-orange bg-orange/5'
            : 'border-border hover:border-orange/50',
          (uploading || images.length >= maxImages) &&
            'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            'mb-3 h-8 w-8',
            isDragActive ? 'text-orange' : 'text-text-tertiary'
          )}
        />
        {isDragActive ? (
          <p className="text-sm font-medium text-orange">
            Drop images here...
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-text-primary">
              Drag &amp; drop images here
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              or click to browse (JPG, PNG, WebP, max 5MB each)
            </p>
          </>
        )}
        <p className="mt-2 text-xs text-text-tertiary">
          {images.length}/{maxImages} images uploaded
        </p>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <Loader2 className="h-4 w-4 animate-spin text-orange" />
              <div className="flex-1">
                <p className="text-xs text-text-primary">{item.fileName}</p>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-orange transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-text-tertiary">
                {item.progress}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {images.map((url, index) => (
            <div
              key={index}
              className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Gig image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-orange/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                  Cover
                </span>
              )}
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: maxImages - images.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-surface/50"
            >
              <ImageIcon className="h-6 w-6 text-text-tertiary/30" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
