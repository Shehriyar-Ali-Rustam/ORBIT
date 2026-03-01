import { getSupabase } from './client'

type Bucket = 'gig-images' | 'profile-images' | 'deliverables' | 'message-attachments'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_DELIVERY_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function validateFile(bucket: Bucket, file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  const allowedTypes = bucket === 'gig-images' || bucket === 'profile-images'
    ? ALLOWED_IMAGE_TYPES
    : ALLOWED_DELIVERY_TYPES

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type "${file.type}" is not allowed`)
  }
}

export async function uploadFile(
  bucket: Bucket,
  path: string,
  file: File
): Promise<string> {
  validateFile(bucket, file)

  const supabase = getSupabase()
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: '3600', upsert: true })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  return getPublicUrl(bucket, path)
}

export function getPublicUrl(bucket: Bucket, path: string): string {
  const supabase = getSupabase()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(bucket: Bucket, path: string): Promise<void> {
  const supabase = getSupabase()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw new Error(`Delete failed: ${error.message}`)
}

export function generateFilePath(userId: string, fileName: string): string {
  // Sanitize extension — only allow alphanumeric
  const ext = (fileName.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '')
  const timestamp = Date.now()
  return `${userId}/${timestamp}.${ext}`
}
