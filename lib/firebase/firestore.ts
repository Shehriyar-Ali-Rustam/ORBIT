import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter as firestoreStartAfter,
  serverTimestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'
import { requireDb } from './config'
import type {
  MarketplaceUser,
  Gig,
  GigCategory,
  Order,
  Review,
} from '@/types/marketplace'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract typed data + id from a DocumentSnapshot. Returns null if it doesn't exist. */
function snapToData<T>(snap: DocumentSnapshot): (T & { id: string }) | null {
  if (!snap.exists()) return null
  return { ...(snap.data() as T), id: snap.id }
}

/** Map an array of QueryDocumentSnapshots to typed objects with id. */
function docsToData<T>(snaps: QueryDocumentSnapshot[]): (T & { id: string })[] {
  return snaps.map((s) => ({ ...(s.data() as T), id: s.id }))
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

/** Get a single user document by UID. */
export async function getUserDoc(uid: string) {
  const db = requireDb()
  const snap = await getDoc(doc(db, 'users', uid))
  return snapToData<MarketplaceUser>(snap)
}

/** Update fields on an existing user document. */
export async function updateUserDoc(uid: string, data: Partial<DocumentData>) {
  const db = requireDb()
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// ---------------------------------------------------------------------------
// Gigs
// ---------------------------------------------------------------------------

/** Create a new gig (auto-generated ID). Returns the new document ID. */
export async function createGig(data: Omit<Gig, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = requireDb()
  const ref = await addDoc(collection(db, 'gigs'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

/** Update fields on an existing gig document. */
export async function updateGig(gigId: string, data: Partial<DocumentData>) {
  const db = requireDb()
  await updateDoc(doc(db, 'gigs', gigId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/** Delete a gig document. */
export async function deleteGig(gigId: string) {
  const db = requireDb()
  await deleteDoc(doc(db, 'gigs', gigId))
}

/** Get a single gig by ID. */
export async function getGig(gigId: string) {
  const db = requireDb()
  const snap = await getDoc(doc(db, 'gigs', gigId))
  return snapToData<Gig>(snap)
}

/** Get a single gig by its slug field. Returns the first match or null. */
export async function getGigBySlug(slug: string) {
  const db = requireDb()
  const q = query(collection(db, 'gigs'), where('slug', '==', slug), firestoreLimit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const d = snapshot.docs[0]
  return { ...(d.data() as Gig), id: d.id }
}

/** Get all gigs belonging to a seller, ordered by createdAt descending. */
export async function getSellerGigs(sellerId: string) {
  const db = requireDb()
  const q = query(
    collection(db, 'gigs'),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  return docsToData<Gig>(snapshot.docs)
}

/** Options for the getActiveGigs query. */
export interface ActiveGigsOptions {
  category?: GigCategory
  limit?: number
  startAfter?: DocumentSnapshot
}

/**
 * Query active gigs with optional category filter, pagination limit, and
 * cursor-based pagination via startAfter.
 */
export async function getActiveGigs(options: ActiveGigsOptions = {}) {
  const db = requireDb()
  const constraints: QueryConstraint[] = [
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
  ]

  if (options.category) {
    constraints.push(where('category', '==', options.category))
  }

  if (options.limit) {
    constraints.push(firestoreLimit(options.limit))
  }

  if (options.startAfter) {
    constraints.push(firestoreStartAfter(options.startAfter))
  }

  const q = query(collection(db, 'gigs'), ...constraints)
  const snapshot = await getDocs(q)
  return docsToData<Gig>(snapshot.docs)
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

/** Create a new order (auto-generated ID). Returns the new document ID. */
export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = requireDb()
  const ref = await addDoc(collection(db, 'orders'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

/** Update fields on an existing order document. */
export async function updateOrder(orderId: string, data: Partial<DocumentData>) {
  const db = requireDb()
  await updateDoc(doc(db, 'orders', orderId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/** Get a single order by ID. */
export async function getOrder(orderId: string) {
  const db = requireDb()
  const snap = await getDoc(doc(db, 'orders', orderId))
  return snapToData<Order>(snap)
}

/**
 * Get all orders for a user. The `role` parameter determines whether we
 * query by `buyerId` or `sellerId`.
 */
export async function getUserOrders(userId: string, role: 'buyer' | 'seller') {
  const db = requireDb()
  const field = role === 'buyer' ? 'buyerId' : 'sellerId'
  const q = query(
    collection(db, 'orders'),
    where(field, '==', userId),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  return docsToData<Order>(snapshot.docs)
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

/** Create a new review (auto-generated ID). Returns the new document ID. */
export async function createReview(data: Omit<Review, 'id' | 'createdAt'>) {
  const db = requireDb()
  const ref = await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

/** Get all reviews for a given gig, ordered by createdAt descending. */
export async function getGigReviews(gigId: string) {
  const db = requireDb()
  const q = query(
    collection(db, 'reviews'),
    where('gigId', '==', gigId),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  return docsToData<Review>(snapshot.docs)
}

/** Get all reviews for a given seller, ordered by createdAt descending. */
export async function getSellerReviews(sellerId: string) {
  const db = requireDb()
  const q = query(
    collection(db, 'reviews'),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  return docsToData<Review>(snapshot.docs)
}

/** Get a review by its associated order ID. Returns the first match or null. */
export async function getReviewByOrderId(orderId: string) {
  const db = requireDb()
  const q = query(
    collection(db, 'reviews'),
    where('orderId', '==', orderId),
    firestoreLimit(1),
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const d = snapshot.docs[0]
  return { ...(d.data() as Review), id: d.id }
}

/** Update fields on an existing review document. */
export async function updateReview(reviewId: string, data: Partial<DocumentData>) {
  const db = requireDb()
  await updateDoc(doc(db, 'reviews', reviewId), data)
}
