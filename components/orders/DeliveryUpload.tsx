'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { uploadImage } from '@/lib/firebase/storage'
import { updateOrder } from '@/lib/firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'
import type { OrderDeliverable } from '@/types/marketplace'

interface DeliveryUploadProps {
  orderId: string
  onDelivered: () => void
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function DeliveryUpload({ orderId, onDelivered }: DeliveryUploadProps) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && files.length === 0) {
      toast.error('Please add a delivery message or upload files.')
      return
    }

    setUploading(true)

    try {
      // Upload all files
      const deliverables: OrderDeliverable[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const path = `orders/${orderId}/deliverables/${Date.now()}_${file.name}`
        const url = await uploadImage(file, path)
        deliverables.push({
          url,
          name: file.name,
          uploadedAt: serverTimestamp() as unknown as OrderDeliverable['uploadedAt'],
        })
      }

      // Update order status and add deliverables
      await updateOrder(orderId, {
        status: 'delivered',
        deliverables,
        deliveryMessage: message,
      })

      toast.success('Delivery submitted successfully!')
      onDelivered()
    } catch (err) {
      console.error('Failed to deliver:', err)
      toast.error('Failed to submit delivery. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h3 className="mb-4 text-sm font-semibold text-text-primary">
        Submit Delivery
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Message */}
        <div>
          <label
            htmlFor="delivery-message"
            className="mb-1.5 block text-xs font-medium text-text-secondary"
          >
            Delivery Message
          </label>
          <textarea
            id="delivery-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what you are delivering..."
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
            disabled={uploading}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">
            Attachments
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 text-sm text-text-secondary transition-colors hover:border-orange hover:text-orange',
              uploading && 'cursor-not-allowed opacity-40'
            )}
          >
            <Upload className="h-5 w-5" />
            Click to upload files
          </button>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
              >
                <FileText className="h-4 w-4 shrink-0 text-text-tertiary" />
                <span className="min-w-0 flex-1 truncate text-xs text-text-primary">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-text-tertiary">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="shrink-0 text-text-tertiary transition-colors hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={uploading}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Submit Delivery'}
        </Button>
      </form>
    </motion.div>
  )
}
