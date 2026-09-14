import * as THREE from 'three'
import type { OrbieEmotion } from './types'

/**
 * Orbie's body, as geometry rather than as a file.
 *
 * The mascot render is made of primitives — an egg, a torus, some spheres and
 * a few glowing panels — so there is no reason for a glTF here. That removes
 * the two things the 3D plan was actually blocked on: a modeller, and a model
 * that had to arrive under 1.5 MB Draco-compressed and stream in after the
 * page was interactive. Geometry described in code weighs nothing beyond the
 * code, and there is no second request to wait on.
 *
 * Everything is authored against a body one unit in radius, so the three size
 * slots scale the canvas rather than the model.
 */

/** Warm palette read off the mascot sheet. */
export const C = {
  body: '#e7dbd0',
  bodyDark: '#cbbcae',
  visor: '#2b1b11',
  glow: '#ffc06a',
  glowHot: '#ffe3b8',
  ringWarm: '#ffb347',
  ringHot: '#ef603c',
  planet: '#9c5433',
  planetDark: '#7d3f26',
} as const

/**
 * The silhouette: a sphere biased fatter toward the base.
 *
 * A lathe rather than a scaled sphere because the character reads as an egg,
 * and a uniformly scaled sphere reads as a ball — the difference is the whole
 * charm of the shape. `bias` widens the profile as it descends.
 */
export function eggProfile(segments = 28): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  // Bottom to top. LatheGeometry derives its normals from the direction the
  // profile travels, so a top-down list turns the body inside out.
  for (let i = 0; i <= segments; i++) {
    const y = -1 + (2 * i) / segments
    const circle = Math.sqrt(Math.max(0, 1 - y * y))
    const bias = 1 + 0.17 * ((1 - y) / 2)
    pts.push(new THREE.Vector2(circle * bias * 0.94, y))
  }
  return pts
}

/** A rounded rectangle, for the visor and the eyes. */
export function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape()
  const x = w / 2
  const y = h / 2
  const k = Math.min(r, x, y)
  s.moveTo(-x + k, -y)
  s.lineTo(x - k, -y)
  s.absarc(x - k, -y + k, k, -Math.PI / 2, 0, false)
  s.lineTo(x, y - k)
  s.absarc(x - k, y - k, k, 0, Math.PI / 2, false)
  s.lineTo(-x + k, y)
  s.absarc(-x + k, y - k, k, Math.PI / 2, Math.PI, false)
  s.lineTo(-x, -y + k)
  s.absarc(-x + k, -y + k, k, Math.PI, 1.5 * Math.PI, false)
  return s
}

/**
 * How each emotion deforms the face.
 *
 * The 2D character redraws its eye paths per emotion. Swapping geometry every
 * time a mood changes would mean rebuilding buffers mid-animation, so the 3D
 * character keeps one pair of eyes and scales them, which the GPU does for
 * free and which tweens continuously rather than snapping.
 *
 * `mouth` is the smile arc's scale; a negative value turns it upside down,
 * which is the whole of `sorry`.
 */
export interface FaceShape {
  /** Per-eye scale, x and y. */
  eyeL: [number, number]
  eyeR: [number, number]
  /** Eye vertical offset, in body units. */
  eyeY: number
  mouth: number
  /** Emissive multiplier for the face. `star` is simply brighter. */
  glow: number
}

export const FACES: Record<OrbieEmotion, FaceShape> = {
  neutral: { eyeL: [1, 1], eyeR: [1, 1], eyeY: 0, mouth: 1, glow: 1 },
  // Squinted, and the smile widens to meet them.
  happy: { eyeL: [1.1, 0.5], eyeR: [1.1, 0.5], eyeY: 0.02, mouth: 1.25, glow: 1.1 },
  // One eye open wider than the other. Asymmetry is what reads as a question.
  curious: { eyeL: [1.08, 1.2], eyeR: [0.92, 0.82], eyeY: 0.01, mouth: 0.85, glow: 1 },
  star: { eyeL: [1.3, 1.3], eyeR: [1.3, 1.3], eyeY: 0, mouth: 1.3, glow: 1.85 },
  // Lowered, flattened, and the arc inverts.
  sorry: { eyeL: [0.95, 0.62], eyeR: [0.95, 0.62], eyeY: -0.03, mouth: -0.85, glow: 0.72 },
}
