import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { requireStorage } from './config'

// ---------------------------------------------------------------------------
// Generic upload
// ---------------------------------------------------------------------------

/**
 * Upload a file to Firebase Storage at the given path and return its
 * public download URL.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  const storage = requireStorage()
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// ---------------------------------------------------------------------------
// Gig images
// ---------------------------------------------------------------------------

/**
 * Upload a gig image. Files are stored at:
 *   gigs/{sellerId}/{gigId}/{index}_{filename}
 *
 * Returns the download URL.
 */
export async function uploadGigImage(
  sellerId: string,
  gigId: string,
  file: File,
  index: number,
): Promise<string> {
  const path = `gigs/${sellerId}/${gigId}/${index}_${file.name}`
  return uploadImage(file, path)
}

// ---------------------------------------------------------------------------
// Profile photos
// ---------------------------------------------------------------------------

/**
 * Upload a user's profile photo. Files are stored at:
 *   profiles/{uid}/photo_{timestamp}_{filename}
 *
 * Returns the download URL.
 */
export async function uploadProfilePhoto(
  uid: string,
  file: File,
): Promise<string> {
  const timestamp = Date.now()
  const path = `profiles/${uid}/photo_${timestamp}_${file.name}`
  return uploadImage(file, path)
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Delete a file from Firebase Storage using its download URL.
 *
 * The download URL is decoded and a storage reference is created via
 * `ref(storage, url)` which handles both gs:// and https:// URLs
 * returned by `getDownloadURL`.
 */
export async function deleteImage(url: string): Promise<void> {
  const storage = requireStorage()
  const storageRef = ref(storage, url)
  await deleteObject(storageRef)
}
