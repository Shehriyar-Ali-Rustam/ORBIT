'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { C, eggProfile, roundedRect, FACES } from './orbie-geometry'
import { POSE_SECONDS, poseFrame } from './orbie-poses'
import { ORBIE_SIZE_PX, type OrbieProps, type OrbiePose } from './types'

/**
 * Orbie, in WebGL, built out of primitives.
 *
 * The plan for this file assumed a glTF model and named two conditions for
 * shipping it: a modeller had to deliver one, and it had to come in under
 * about 1.5 MB Draco-compressed and stream in after the page was interactive.
 * The mascot design makes both moot. It is an egg, a ring, some spheres and a
 * few glowing panels, all describable in geometry, so there is no file to
 * author, none to download, and no second request to wait on. The only weight
 * is `three` itself, in a chunk `/` does not load.
 *
 * The contract in `types.ts` is honoured exactly, because the engine above is
 * not allowed to be able to tell which renderer is live:
 *
 *  - One-shot poses play once, fire `onPoseEnd`, and settle back to idle by
 *    themselves, at the same durations the SVG uses. That is what
 *    `POSE_SECONDS` is copied from rather than re-invented.
 *  - `emotion` deforms the face instead of swapping geometry, so a mood change
 *    tweens rather than snapping and no buffer is rebuilt mid-animation.
 *  - `speaking` is read with `.get()` inside `useFrame` and never touches React
 *    state, which is the entire reason it is a MotionValue.
 *  - `size` picks one of three fixed canvases, never pixels.
 *
 * The canvas is `alpha: true` because the tour's surface is light and the
 * character has to sit on it rather than inside a black box.
 */

const EYE = roundedRect(0.145, 0.25, 0.066)
const EYE_EXTRUDE = { depth: 0.02, bevelEnabled: false }

/**
 * Where the visor sits, as a patch of a sphere rather than a plate stuck to
 * one. A flat panel on a curved face either floats at the centre or sinks at
 * the edges, and at hero size both are visible.
 */
const VISOR = {
  phiStart: Math.PI / 2 - 0.52,
  phiLength: 1.04,
  thetaStart: 1.2 - 0.36,
  thetaLength: 0.72,
}

/**
 * Image-based lighting, which is what the look actually depends on.
 *
 * Three hand-placed lights were never going to get there. The soft studio
 * finish these mascot renders have comes from lighting a surface with a whole
 * environment rather than with a few points - every direction contributes
 * something, so the shading rolls instead of banding, and there is no single
 * intensity number to get wrong. The last three attempts at the body colour
 * were all really attempts to hand-balance what an environment does for free.
 *
 * `RoomEnvironment` is procedural: a box with some emissive panels in it,
 * built in memory and prefiltered by `PMREMGenerator`. No HDR to download, no
 * CDN, nothing added to the payload beyond the code.
 *
 * Disposed on unmount because both the render target and the generator hold
 * GPU memory, and this component mounts and unmounts as the tour moves.
 */
function Studio() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const target = pmrem.fromScene(room, 0.04)
    scene.environment = target.texture
    return () => {
      scene.environment = null
      target.dispose()
      pmrem.dispose()
      room.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
      })
    }
  }, [gl, scene])

  return null
}

function Model({ pose, emotion = 'neutral', direction, speaking, onPoseEnd }: OrbieProps) {
  const root = useRef<THREE.Group>(null)
  const eyeL = useRef<THREE.Mesh>(null)
  const eyeR = useRef<THREE.Mesh>(null)
  const mouth = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Group>(null)
  const thruster = useRef<THREE.Mesh>(null)
  const faceMat = useRef<THREE.MeshStandardMaterial>(null)

  // Which pose is playing, versus which was last asked for. This mirrors the
  // 2D character: a one-shot returns to idle on its own, so the two cannot be
  // one ref, or the return to idle would immediately restart the pose.
  const asked = useRef<OrbiePose>(pose)
  const playing = useRef<OrbiePose>(pose)
  const startedAt = useRef(0)
  const fired = useRef(false)

  // The face eases toward its target rather than cutting to it.
  const face = useRef({ lx: 1, ly: 1, rx: 1, ry: 1, y: 0, mouth: 1, glow: 1 })

  const profile = useMemo(() => eggProfile(), [])

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime

    if (asked.current !== pose) {
      asked.current = pose
      playing.current = pose
      startedAt.current = now
      fired.current = false
    }

    const active = playing.current
    const t = now - startedAt.current
    const runs = POSE_SECONDS[active]

    if (runs !== undefined && t >= runs) {
      if (!fired.current) {
        fired.current = true
        onPoseEnd?.(active)
      }
      playing.current = 'idle'
      startedAt.current = now
    }

    const f = poseFrame(active, runs !== undefined ? Math.min(t, runs) : t, direction)
    if (root.current) {
      root.current.position.set(f.x, f.y, 0)
      root.current.rotation.set(0, f.rotY, f.rotZ)
      root.current.scale.setScalar(f.scale)
    }

    // The ring turns regardless of pose. It is the one thing that says "orbit"
    // without anybody having to narrate it. About Z, the torus's own axis, so
    // the ring holds its attitude and the planets travel around it.
    if (ring.current) ring.current.rotation.z += delta * 0.4

    // Ease the face at a fixed rate rather than with a spring: it has to be
    // frame-rate independent, and nobody is watching closely enough to want
    // overshoot on an eyelid.
    const target = FACES[emotion]
    const k = Math.min(1, delta * 9)
    const c = face.current
    c.lx += (target.eyeL[0] - c.lx) * k
    c.ly += (target.eyeL[1] - c.ly) * k
    c.rx += (target.eyeR[0] - c.rx) * k
    c.ry += (target.eyeR[1] - c.ry) * k
    c.y += (target.eyeY - c.y) * k
    c.mouth += (target.mouth - c.mouth) * k
    c.glow += (target.glow - c.glow) * k

    if (eyeL.current) {
      eyeL.current.scale.set(c.lx, c.ly, 1)
      eyeL.current.position.y = 0.34 + c.y
    }
    if (eyeR.current) {
      eyeR.current.scale.set(c.rx, c.ry, 1)
      eyeR.current.position.y = 0.34 + c.y
    }
    // A negative mouth scale turns the smile upside down. That is the whole of
    // `sorry`, and it passes through flat on the way, which reads correctly.
    if (mouth.current) mouth.current.scale.set(1, c.mouth, 1)

    // Speech drives the glow. With no MotionValue supplied Orbie pulses gently
    // on its own timing, so it never looks switched off.
    const amp = speaking ? speaking.get() : 0.5 + Math.sin(now * 1.6) * 0.18
    if (faceMat.current) faceMat.current.emissiveIntensity = c.glow * (0.85 + amp * 0.9)
    if (thruster.current) {
      const s = 1 + amp * 0.22
      thruster.current.scale.set(s, 0.85 + amp * 0.3, s)
    }
  })

  return (
    <group ref={root}>
      <mesh>
        <latheGeometry args={[profile, 48]} />
        <meshStandardMaterial
          color={C.body}
          roughness={0.85}
          metalness={0}
          envMapIntensity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh>
        <sphereGeometry
          args={[
            1.008,
            40,
            28,
            VISOR.phiStart - 0.07,
            VISOR.phiLength + 0.14,
            VISOR.thetaStart - 0.05,
            VISOR.thetaLength + 0.1,
          ]}
        />
        <meshStandardMaterial color={C.bodyDark} roughness={0.8} metalness={0} envMapIntensity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry
          args={[1.022, 40, 28, VISOR.phiStart, VISOR.phiLength, VISOR.thetaStart, VISOR.thetaLength]}
        />
        <meshStandardMaterial
          color={C.visor}
          roughness={0.12}
          metalness={0.15}
          envMapIntensity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={eyeL} position={[-0.185, 0.34, 1.01]}>
        <extrudeGeometry args={[EYE, EYE_EXTRUDE]} />
        <meshStandardMaterial
          ref={faceMat}
          color={C.glowHot}
          emissive={C.glow}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={eyeR} position={[0.185, 0.34, 1.01]}>
        <extrudeGeometry args={[EYE, EYE_EXTRUDE]} />
        <meshStandardMaterial
          color={C.glowHot}
          emissive={C.glow}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
      {/* The arc is rotated on the mesh and mirrored on the group above it.
          Flipping inside the rotation reflects about a rotated axis and the
          smile lands askew; flipping outside it mirrors the finished shape,
          which is what `sorry` actually wants. */}
      <group ref={mouth} position={[0, 0.16, 1.04]}>
        <mesh rotation={[0, 0, -Math.PI / 2 - 1]}>
          <torusGeometry args={[0.13, 0.019, 10, 28, 2]} />
          <meshStandardMaterial
            color={C.glowHot}
            emissive={C.glow}
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* A curved stalk: a straight one reads as an aerial rather than as part
          of a character. */}
      <mesh position={[0.02, 1.16, 0.02]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.014, 0.018, 0.42, 10]} />
        <meshStandardMaterial color={C.bodyDark} roughness={0.8} metalness={0} envMapIntensity={0.9} />
      </mesh>
      <mesh position={[-0.02, 1.4, 0.03]}>
        <sphereGeometry args={[0.072, 20, 20]} />
        <meshStandardMaterial
          color={C.glowHot}
          emissive={C.glow}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      {/* Arms. The first pass put these at x = 0.92 with a 0.14 radius, which
          reaches 1.06 - and the body is already 1.02 wide at that height, so
          they were two dimples rather than two arms. They sit clear of the
          surface now and are stubbier, which is what the mascot sheet shows. */}
      <mesh position={[-1.09, -0.02, 0.08]} rotation={[0, 0, 0.26]} scale={[1.35, 0.92, 0.92]}>
        <sphereGeometry args={[0.205, 20, 20]} />
        <meshStandardMaterial color={C.body} roughness={0.85} metalness={0} envMapIntensity={0.9} />
      </mesh>
      <mesh position={[1.09, -0.02, 0.08]} rotation={[0, 0, -0.26]} scale={[1.35, 0.92, 0.92]}>
        <sphereGeometry args={[0.205, 20, 20]} />
        <meshStandardMaterial color={C.body} roughness={0.85} metalness={0} envMapIntensity={0.9} />
      </mesh>

      <mesh position={[0, -0.34, 0.96]} scale={[0.5, 0.82, 0.3]}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial
          color={C.glowHot}
          emissive={C.glow}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, -0.93, 0]}>
        <cylinderGeometry args={[0.3, 0.26, 0.16, 24]} />
        <meshStandardMaterial color={C.bodyDark} roughness={0.8} metalness={0} envMapIntensity={0.9} />
      </mesh>
      <mesh ref={thruster} position={[0, -1.08, 0]}>
        <sphereGeometry args={[0.2, 22, 18]} />
        <meshStandardMaterial
          color={C.glowHot}
          emissive={C.glow}
          emissiveIntensity={1.9}
          toneMapped={false}
        />
      </mesh>

      {/* The ring and its planets share a group, so they tilt and turn as one
          system rather than as three things that have to be kept in step.
          
          Two groups, not one, and the outer rotation is the fix for a ring
          that came out vertical. `torusGeometry` is built in the XY plane -
          it faces the camera - so the first pass tilted it as though it were
          already lying flat, and a small tilt on a vertical ring leaves it
          vertical. The outer group lays it down with -PI/2 about X and then
          opens it back toward the viewer, because a perfectly level ring seen
          from a level camera is a straight line.
          
          The inner group spins, and about Z rather than Y. Z is the torus's
          own axis, so the ring stays put and the planets ride around it,
          which is the motion that reads as an orbit. Spinning about Y just
          tumbles the whole thing end over end. */}
      <group rotation={[-Math.PI / 2 + 0.38, 0, 0.16]}>
        <group ref={ring}>
        <mesh>
          <torusGeometry args={[1.3, 0.036, 12, 64, Math.PI]} />
          <meshStandardMaterial
            color={C.ringWarm}
            emissive={C.ringWarm}
            emissiveIntensity={0.85}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[1.3, 0.036, 12, 64, Math.PI]} />
          <meshStandardMaterial
            color={C.ringHot}
            emissive={C.ringHot}
            emissiveIntensity={0.85}
            toneMapped={false}
          />
        </mesh>
        {/* Both planets must sit at z = 0 and radius 1.3, or they are not on
            the ring - they are near it. Placed by angle for that reason. */}
        <mesh position={[-1.3, 0, 0]}>
          <sphereGeometry args={[0.16, 22, 22]} />
          <meshStandardMaterial color={C.planet} roughness={0.45} metalness={0} />
        </mesh>
        <mesh position={[1.207, 0.482, 0]}>
          <sphereGeometry args={[0.13, 22, 22]} />
          <meshStandardMaterial color={C.planetDark} roughness={0.45} metalness={0} />
        </mesh>
        </group>
      </group>
    </group>
  )
}

export function Orbie3D({ size = 'dock', className, ...rest }: OrbieProps) {
  const px = ORBIE_SIZE_PX[size]

  return (
    <div className={className} style={{ width: px, height: px }} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        // `flat` turns off tone mapping. R3F defaults to ACES Filmic, which is
        // built for photographic scenes with real highlights and which rolls
        // the life out of a flat pastel - the body was authored beige and came
        // out grey. A stylised character wants its colours delivered as
        // written.
        flat
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0.05, 5.8], fov: 32 }}
        style={{ width: px, height: px }}
      >
        <Studio />
        {/* One key on top of the environment, and a soft one. The environment
            is doing the lighting; this only gives the form a direction so it
            does not read flat. */}
        <directionalLight position={[2.2, 3, 4]} intensity={0.55} />
        {/* Warms the body from the chest and the thruster, so the glows look
            like they are lighting the character rather than painted on it. */}
        <pointLight position={[0, -0.5, 1.4]} color={C.glow} intensity={1.1} distance={3} />
        <Model {...rest} />
      </Canvas>
    </div>
  )
}
