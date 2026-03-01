import { getSupabase } from './client'

type Bucket = 'gig-images' | 'profile-images' | 'deliverables' | 'message-attachments'

export async function uploadFile(
  bucket: Bucket,
  path: string,
  file: File
): Promise<string> {
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
  const ext = fileName.split('.').pop() || 'jpg'
  const timestamp = Date.now()
  return `${userId}/${timestamp}.${ext}`
}
