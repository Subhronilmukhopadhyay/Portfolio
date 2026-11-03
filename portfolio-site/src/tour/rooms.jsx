import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { B, Cyl, Glow, Frame, Plant, Desk, Monitor, Chair, PAL, useCanvasTexture, drawScreen } from './primitives'
import { ACCENT } from './scenes'

// Every room is modelled in room-local space: floor at y 0, back wall at
// z -3, open front at z +3, side walls at x ±3. Hotspot positions in
// scenes.js line up with the props placed here.

const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

// ------------------------------------------------------------
// Shared furniture
// ------------------------------------------------------------

/** Bookcase with instanced books. `tints` colours the books per row. */
export function Bookcase({ w = 1.7, h = 2.4, d = 0.42, rows = 4, seed = 3, tints = ['#3de8ff'], ...props }) {
  const books = useRef()
  const rowH = (h - 0.1) / rows
  const items = useMemo(() => {
    const r = rng(seed)
    const out = []
    for (let row = 0; row < rows; row++) {
      let x = -w / 2 + 0.08
      while (x < w / 2 - 0.16) {
        const bw = 0.05 + r() * 0.06
        const bh = rowH * (0.55 + r() * 0.3)
        const tilt = r() > 0.92 ? 0.25 : 0
        const tint = tints[row % tints.length]
        const base = new THREE.Color(PAL.cream).lerp(new THREE.Color(PAL.fabric), r())
        out.push({ x: x + bw / 2, y: 0.06 + row * rowH + bh / 2, bw, bh, tilt, color: base.lerp(new THREE.Color(tint), 0.25 + r() * 0.5) })
        x += bw + 0.008 + (r() > 0.9 ? 0.12 : 0)
      }
    }
    return out
  }, [w, rows, rowH, seed, tints])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    items.forEach((b, i) => {
      q.setFromEuler(new THREE.Euler(0, 0, b.tilt))
      m.compose(new THREE.Vector3(b.x, b.y, 0.02), q, new THREE.Vector3(b.bw, b.bh, d * 0.75))
      books.current.setMatrixAt(i, m)
      books.current.setColorAt(i, b.color)
    })
    books.current.instanceMatrix.needsUpdate = true
    if (books.current.instanceColor) books.current.instanceColor.needsUpdate = true
  }, [items, d])

  return (
    <group {...props}>
      <B size={[w, h, 0.04]} color={PAL.woodDark} position={[0, h / 2, -d / 2 + 0.02]} />
      <B size={[0.05, h, d]} color={PAL.wood} position={[-w / 2, h / 2, 0]} />
      <B size={[0.05, h, d]} color={PAL.wood} position={[w / 2, h / 2, 0]} />
      {Array.from({ length: rows + 1 }, (_, i) => (
        <B key={i} size={[w, 0.04, d]} color={PAL.wood} position={[0, 0.02 + i * rowH, 0]} />
      ))}
      <instancedMesh ref={books} args={[null, null, items.length]} castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
    </group>
  )
}

export function Armchair({ color = PAL.fabric, ...props }) {
  return (
    <group {...props}>
      <B size={[0.95, 0.38, 0.85]} color={color} round={0.08} position={[0, 0.3, 0]} />
      <B size={[0.95, 0.7, 0.2]} color={color} round={0.08} position={[0, 0.7, -0.35]} />
      <B size={[0.16, 0.5, 0.85]} color={color} round={0.06} position={[-0.47, 0.5, 0]} />
      <B size={[0.16, 0.5, 0.85]} color={color} round={0.06} position={[0.47, 0.5, 0]} />
    </group>
  )
}

function FloorLamp({ color = '#ffcf8a', ...props }) {
  return (
    <group {...props}>
      <Cyl r={0.16} h={0.04} position={[0, 0.02, 0]} />
      <Cyl r={0.02} h={1.5} position={[0, 0.77, 0]} />
      <Cyl r={0.14} r2={0.22} h={0.28} color={color} emissive={color} ei={1.6} position={[0, 1.58, 0]} />
    </group>
  )
}

function Rug({ r = 1.4, color = '#1d3550', ...props }) {
  return (
    <mesh receiveShadow position={[0, 0.012, 0]} {...props}>
      <cylinderGeometry args={[r, r, 0.02, 48]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  )
}

/** Slowly spinning thing (used for holograms, globes, trophies). */
function Spin({ speed = 0.5, axis = 'y', children, ...props }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation[axis] += dt * speed
  })
  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  )
}

// ------------------------------------------------------------
// 01 · About — The Study
// ------------------------------------------------------------
export function Study() {
  const portrait = useCanvasTexture(
    (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#0d2a44')
      g.addColorStop(0.55, '#231a4d')
      g.addColorStop(1, '#3b1336')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(61,232,255,0.5)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(w / 2, h * 0.42, w * 0.3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = '#eaf2ff'
      ctx.textAlign = 'center'
      ctx.font = `700 ${w * 0.3}px "Space Grotesk", sans-serif`
      ctx.fillText('SM', w / 2, h * 0.5)
      ctx.fillStyle = '#3de8ff'
      ctx.font = `500 ${w * 0.06}px "JetBrains Mono", monospace`
      ctx.fillText('SUBHRONIL · AGENTIC AI', w / 2, h * 0.86)
    },
    [],
    { w: 384, h: 480 },
  )
  const degree = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#efe6cf'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#b08b3e'
      ctx.lineWidth = 6
      ctx.strokeRect(14, 14, w - 28, h - 28)
      ctx.fillStyle = '#2a2131'
      ctx.textAlign = 'center'
      ctx.font = `700 ${h * 0.13}px "Space Grotesk", serif`
      ctx.fillText('VIT · Vellore', w / 2, h * 0.28)
      ctx.font = `500 ${h * 0.09}px "Inter", sans-serif`
      ctx.fillText('B.Tech · Computer Science', w / 2, h * 0.46)
      ctx.fillStyle = '#b08b3e'
      ctx.font = `700 ${h * 0.1}px "JetBrains Mono", monospace`
      ctx.fillText('CGPA 8.88 / 10', w / 2, h * 0.64)
      ctx.fillStyle = '#2a2131'
      ctx.font = `600 ${h * 0.07}px "JetBrains Mono", monospace`
      ctx.fillText('GRADUATED · MAY 2026', w / 2, h * 0.81)
    },
    [],
    { w: 480, h: 340 },
  )
  const screen = useCanvasTexture(
    (ctx, w, h) => drawScreen(ctx, w, h, { title: '~ $ status --now', color: ACCENT.accent }),
    [],
  )

  return (
    <group>
      <Rug r={1.5} position={[0.4, 0.012, 0.6]} />
      <Desk w={2} d={0.8} position={[-0.85, 0, -2.05]} />
      <Monitor map={screen} position={[-0.85, 0.79, -2.2]} />
      <B size={[0.42, 0.02, 0.14]} color={PAL.dark} position={[-0.85, 0.8, -1.85]} />
      <Cyl r={0.05} h={0.12} color="#e8c275" metal={0.8} rough={0.3} position={[-0.25, 0.85, -1.9]} />
      <Chair position={[-0.85, 0, -1.25]} />
      <Frame size={[1.2, 1.5]} map={portrait} position={[1.35, 2.25, -2.94]} />
      <Frame size={[0.9, 0.64]} map={degree} color="#6b5226" position={[-1.55, 2.45, -2.94]} />
      <Bookcase w={1.7} h={2.3} rows={4} seed={7} tints={[ACCENT.accent, ACCENT.agent]} position={[-2.65, 0, 0.7]} rotation={[0, Math.PI / 2, 0]} />
      <Armchair color="#33406f" position={[1.45, 0, 1.0]} rotation={[0, -0.5, 0]} />
      <FloorLamp position={[2.5, 0, 0.1]} />
      <Plant position={[2.45, 0, -2.45]} scale={1.15} />
    </group>
  )
}

// ------------------------------------------------------------
// 02 · Work — The Agent Lab
// ------------------------------------------------------------
function Holotable({ color = ACCENT.agent, ...props }) {
  const sats = useMemo(
    () => Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2
      return [Math.cos(a) * 0.55, Math.sin(i * 1.3) * 0.18, Math.sin(a) * 0.55]
    }),
    [],
  )
  const lines = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(sats.flatMap((p) => [0, 0, 0, ...p]), 3))
    return g
  }, [sats])
  return (
    <group {...props}>
      <Cyl r={0.55} r2={0.7} h={0.85} color={PAL.dark} metal={0.6} rough={0.35} position={[0, 0.425, 0]} />
      <mesh position={[0, 0.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.58, 48]} />
        <meshBasicMaterial color={new THREE.Color(color).multiplyScalar(2)} toneMapped={false} />
      </mesh>
      {/* light cone */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.7, 0.45, 0.8, 32, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <Spin speed={0.6} position={[0, 1.55, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.22, 1]} />
          <meshBasicMaterial color={new THREE.Color(ACCENT.accent).multiplyScalar(1.6)} wireframe toneMapped={false} />
        </mesh>
        <lineSegments geometry={lines}>
          <lineBasicMaterial color={color} transparent opacity={0.7} />
        </lineSegments>
        {sats.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={new THREE.Color(i % 2 ? ACCENT.mint : color).multiplyScalar(2)} toneMapped={false} />
          </mesh>
        ))}
      </Spin>
    </group>
  )
}

function InspectionRig(props) {
  const parcel = useRef()
  useFrame(({ clock }) => {
    if (parcel.current) parcel.current.position.x = ((clock.elapsedTime * 0.25) % 1.2) - 0.6
  })
  return (
    <group {...props}>
      <B size={[1.4, 0.7, 0.6]} color={PAL.metal} metal={0.4} position={[0, 0.35, 0]} />
      <B size={[1.45, 0.04, 0.5]} color="#111" rough={0.9} position={[0, 0.72, 0]} />
      <group ref={parcel}>
        <B size={[0.26, 0.2, 0.26]} color="#9b7a52" position={[0, 0.84, 0]} />
      </group>
      <Cyl r={0.035} h={1.25} position={[0, 1.32, -0.3]} />
      <B size={[0.06, 0.06, 0.5]} color={PAL.metal} position={[0, 1.92, -0.08]} />
      <B size={[0.18, 0.14, 0.2]} color={PAL.dark} position={[0, 1.82, 0.12]} />
      <Cyl r={0.05} h={0.04} color={ACCENT.mint} emissive={ACCENT.mint} ei={3} position={[0, 1.73, 0.12]} />
      {/* scan beam */}
      <mesh position={[0, 1.28, 0.12]}>
        <coneGeometry args={[0.28, 0.9, 24, 1, true]} />
        <meshBasicMaterial color={ACCENT.mint} transparent opacity={0.09} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <Cyl r={0.04} h={0.03} color={ACCENT.live} emissive={ACCENT.live} ei={3} position={[0.6, 0.73, 0.22]} />
    </group>
  )
}

function DebatePods(props) {
  const a = useCanvasTexture((ctx, w, h) => drawScreen(ctx, w, h, { title: 'agent_A: 42', color: ACCENT.accent }), [])
  const b = useCanvasTexture((ctx, w, h) => drawScreen(ctx, w, h, { title: 'agent_B: 41?', color: ACCENT.live }), [])
  return (
    <group {...props}>
      <Cyl r={0.5} h={0.04} color={PAL.wood} metal={0} rough={0.5} position={[0, 0.74, 0]} />
      <Cyl r={0.05} h={0.72} position={[0, 0.36, 0]} />
      <Monitor w={0.55} h={0.34} map={a} position={[-0.25, 0.76, 0]} rotation={[0, Math.PI / 2 - 0.5, 0]} />
      <Monitor w={0.55} h={0.34} map={b} position={[0.25, 0.76, 0]} rotation={[0, -Math.PI / 2 + 0.5, 0]} />
    </group>
  )
}

function Rack({ seed = 1, ...props }) {
  const leds = useCanvasTexture(
    (ctx, w, h) => {
      const r = rng(seed)
      ctx.fillStyle = '#05070f'
      ctx.fillRect(0, 0, w, h)
      for (let y = 0; y < 14; y++) {
        ctx.fillStyle = '#141a33'
        ctx.fillRect(10, 12 + y * 35, w - 20, 28)
        for (let x = 0; x < 6; x++) {
          const on = r()
          ctx.fillStyle = on > 0.75 ? ACCENT.mint : on > 0.5 ? ACCENT.agent : on > 0.35 ? ACCENT.accent : '#1d2340'
          ctx.fillRect(18 + x * 14, 22 + y * 35, 8, 8)
        }
      }
    },
    [seed],
    { w: 160, h: 512 },
  )
  return (
    <group {...props}>
      <B size={[0.66, 2.05, 0.8]} color={PAL.dark} metal={0.5} rough={0.4} position={[0, 1.025, 0]} />
      <Glow size={[0.56, 1.9]} map={leds} position={[0, 1.03, 0.405]} />
    </group>
  )
}

function RobotArm(props) {
  const j1 = useRef()
  const j2 = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (j1.current) j1.current.rotation.y = Math.sin(t * 0.5) * 0.9
    if (j2.current) j2.current.rotation.z = -0.6 + Math.sin(t * 0.8) * 0.35
  })
  const orange = '#e07a3a'
  return (
    <group {...props}>
      <Cyl r={0.3} h={0.18} color={PAL.dark} position={[0, 0.09, 0]} />
      <group ref={j1} position={[0, 0.18, 0]}>
        <Cyl r={0.14} h={0.9} color={orange} metal={0.2} rough={0.45} position={[0, 0.45, 0]} />
        <mesh position={[0, 0.92, 0]} castShadow>
          <sphereGeometry args={[0.15, 20, 20]} />
          <meshStandardMaterial color={PAL.metal} metalness={0.6} roughness={0.35} />
        </mesh>
        <group ref={j2} position={[0, 0.92, 0]}>
          <B size={[0.75, 0.16, 0.16]} color={orange} rough={0.45} position={[0.38, 0, 0]} />
          <B size={[0.1, 0.22, 0.2]} color={PAL.metal} metal={0.6} position={[0.8, -0.06, 0]} />
          <Cyl r={0.03} h={0.03} color={ACCENT.live} emissive={ACCENT.live} ei={3} position={[0.8, 0.08, 0]} />
        </group>
      </group>
      <B size={[0.2, 0.2, 0.2]} color="#7c5d9e" position={[0.75, 0.1, 0.1]} />
    </group>
  )
}

export function AgentLab() {
  const wall = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#060818'
      ctx.fillRect(0, 0, w, h)
      ctx.font = `600 ${h * 0.08}px "JetBrains Mono", monospace`
      ctx.fillStyle = ACCENT.agent
      ctx.fillText('// gpu → trainium · feasibility', w * 0.05, h * 0.12)
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 8; x++) {
          const blocked = (x + y * 3) % 7 === 0
          ctx.fillStyle = blocked ? ACCENT.live : x < 4 ? '#2a3a80' : '#3a2a80'
          ctx.globalAlpha = blocked ? 1 : 0.85
          ctx.fillRect(w * 0.05 + x * w * 0.113, h * 0.22 + y * h * 0.18, w * 0.1, h * 0.15)
        }
      }
      ctx.globalAlpha = 1
    },
    [],
    { w: 768, h: 420 },
  )
  return (
    <group>
      <Holotable position={[0, 0, 0.55]} />
      <InspectionRig position={[2.05, 0, 1.4]} />
      <DebatePods position={[-2.1, 0, 1.25]} />
      <Rack seed={11} position={[1.75, 0, -2.5]} />
      <Rack seed={23} position={[2.47, 0, -2.5]} />
      <RobotArm position={[-2.0, 0, -1.9]} />
      <Frame size={[2.2, 1.2]} map={wall} color={PAL.dark} position={[0, 2.85, -2.94]} />
      {/* floor guide lines toward the holotable */}
      {[-1, 1].map((s) => (
        <Glow key={s} size={[0.04, 2.2]} color={ACCENT.agent} intensity={1.2} rotation={[-Math.PI / 2, 0, 0]} position={[s * 0.9, 0.015, 1.9]} />
      ))}
    </group>
  )
}

// ------------------------------------------------------------
// 03 · Internships — The R&D Bay
// ------------------------------------------------------------
function ATM(props) {
  const screen = useCanvasTexture(
    (ctx, w, h) => drawScreen(ctx, w, h, { title: 'ATM-07 · EJ log', color: ACCENT.mint, bars: true }),
    [],
  )
  return (
    <group {...props}>
      <B size={[0.9, 1.75, 0.75]} color="#2b3a5c" rough={0.5} metal={0.3} position={[0, 0.875, 0]} round={0.04} />
      <B size={[0.92, 0.22, 0.77]} color={ACCENT.mint} emissive={ACCENT.mint} ei={0.9} position={[0, 1.86, 0]} />
      <B size={[0.7, 0.5, 0.08]} color={PAL.dark} position={[0, 1.35, 0.36]} rotation={[-0.2, 0, 0]} />
      <Glow size={[0.6, 0.4]} map={screen} position={[0, 1.36, 0.41]} rotation={[-0.2, 0, 0]} />
      <B size={[0.5, 0.06, 0.3]} color={PAL.metal} position={[0, 0.98, 0.42]} />
      <B size={[0.3, 0.03, 0.02]} color={ACCENT.mint} emissive={ACCENT.mint} ei={2} position={[0, 0.82, 0.38]} />
    </group>
  )
}

function Laptop({ map, ...props }) {
  return (
    <group {...props}>
      <B size={[0.62, 0.025, 0.42]} color={PAL.metal} metal={0.6} rough={0.35} position={[0, 0.0125, 0]} />
      <group position={[0, 0.02, -0.2]} rotation={[-0.25, 0, 0]}>
        <B size={[0.62, 0.4, 0.02]} color={PAL.metal} metal={0.6} rough={0.35} position={[0, 0.2, 0]} />
        <Glow size={[0.56, 0.34]} map={map} position={[0, 0.2, 0.012]} />
      </group>
    </group>
  )
}

export function RnDBay() {
  const s1 = useCanvasTexture((ctx, w, h) => drawScreen(ctx, w, h, { title: 'etl: 227k journals', color: ACCENT.mint }), [])
  const s2 = useCanvasTexture((ctx, w, h) => drawScreen(ctx, w, h, { title: 'lgbm auc 0.83', color: ACCENT.mint, bars: true }), [])
  const s3 = useCanvasTexture((ctx, w, h) => drawScreen(ctx, w, h, { title: 'video → SOP', color: ACCENT.accent }), [])
  const logos = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#070a1c'
      ctx.fillRect(0, 0, w, h)
      const cols = ['#3de8ff', '#8b6cff', '#ff5fa2', '#7cffc4', '#e8c275']
      for (let i = 0; i < 27; i++) {
        const x = i % 9
        const y = Math.floor(i / 9)
        ctx.fillStyle = cols[i % 5]
        ctx.globalAlpha = 0.75
        ctx.beginPath()
        ctx.arc(w * 0.08 + x * w * 0.105, h * 0.25 + y * h * 0.27, h * 0.08, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    },
    [],
  )
  const board = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#e9edf7'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#2a3a80'
      ctx.lineWidth = 4
      const pts = [
        [0.12, 0.5],
        [0.32, 0.3],
        [0.32, 0.7],
        [0.55, 0.5],
        [0.75, 0.3],
        [0.88, 0.55],
      ]
      ;[
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        [3, 4],
        [4, 5],
      ].forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(pts[a][0] * w, pts[a][1] * h)
        ctx.lineTo(pts[b][0] * w, pts[b][1] * h)
        ctx.stroke()
      })
      pts.forEach(([x, y], i) => {
        ctx.fillStyle = i % 2 ? '#ff5fa2' : '#0f9e74'
        ctx.beginPath()
        ctx.arc(x * w, y * h, 16, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.fillStyle = '#2a3a80'
      ctx.font = `600 ${h * 0.08}px "JetBrains Mono", monospace`
      ctx.fillText('petri-net conformance', w * 0.05, h * 0.12)
    },
    [],
    { w: 640, h: 360 },
  )
  return (
    <group>
      <Rug r={1.2} color="#173a36" position={[1.2, 0.012, 0.9]} />
      <Desk w={2.4} d={0.85} position={[-1.0, 0, -2.2]} />
      <Monitor w={0.7} h={0.42} map={s1} position={[-1.75, 0.79, -2.3]} rotation={[0, 0.35, 0]} />
      <Monitor w={0.7} h={0.42} map={s2} position={[-1.0, 0.79, -2.4]} />
      <Monitor w={0.7} h={0.42} map={s3} position={[-0.25, 0.79, -2.3]} rotation={[0, -0.35, 0]} />
      {/* 4-mic acoustic array */}
      <group position={[-2.0, 0.79, -1.95]}>
        <Cyl r={0.16} h={0.02} color={PAL.dark} />
        {[0, 1, 2, 3].map((i) => (
          <Cyl key={i} r={0.02} h={0.08} color={ACCENT.mint} emissive={ACCENT.mint} ei={1.5} position={[Math.cos(i * 1.57) * 0.11, 0.05, Math.sin(i * 1.57) * 0.11]} />
        ))}
      </group>
      <Chair position={[-1.0, 0, -1.35]} />
      <ATM position={[2.15, 0, -2.2]} />
      <Desk w={1.4} d={0.7} position={[1.3, 0, 0.75]} color="#33303f" />
      <Laptop map={logos} position={[1.3, 0.79, 0.8]} />
      <Chair position={[1.3, 0, 1.45]} color="#2c5b52" />
      <group position={[-2.92, 1.9, 0.4]} rotation={[0, Math.PI / 2, 0]}>
        <B size={[2.0, 1.15, 0.04]} color="#c9cfdf" />
        <Glow size={[1.9, 1.05]} map={board} position={[0, 0, 0.025]} />
      </group>
      <Plant position={[-2.4, 0, 1.9]} />
    </group>
  )
}

// ------------------------------------------------------------
// 04 · Projects — The Workshop
// ------------------------------------------------------------
function CrowdTable(props) {
  const people = useRef([])
  const walkers = useMemo(() => {
    const r = rng(5)
    return Array.from({ length: 14 }, (_, i) => ({ rad: 0.15 + r() * 0.5, sp: (r() - 0.5) * 1.2, ph: r() * 6.28, c: i % 3 }))
  }, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    walkers.forEach((w, i) => {
      const p = people.current[i]
      if (!p) return
      const a = w.ph + t * w.sp
      p.position.set(Math.cos(a) * w.rad, 0.79, Math.sin(a) * w.rad)
    })
  })
  const cols = [ACCENT.live, ACCENT.accent, ACCENT.gold]
  return (
    <group {...props}>
      <Cyl r={0.78} h={0.06} color="#1a1f3d" metal={0} position={[0, 0.74, 0]} />
      <Cyl r={0.08} h={0.72} position={[0, 0.36, 0]} />
      <mesh position={[0, 0.775, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.74, 48]} />
        <meshBasicMaterial color={new THREE.Color(ACCENT.live).multiplyScalar(1.6)} toneMapped={false} />
      </mesh>
      {walkers.map((w, i) => (
        <group key={i} ref={(el) => (people.current[i] = el)}>
          <mesh position={[0, 0.05, 0]}>
            <capsuleGeometry args={[0.022, 0.06, 4, 8]} />
            <meshBasicMaterial color={new THREE.Color(cols[w.c]).multiplyScalar(1.4)} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Workshop() {
  const dash = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#070a1c'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = ACCENT.live
      ctx.font = `600 ${h * 0.09}px "JetBrains Mono", monospace`
      ctx.fillText('almanac · spending trend', w * 0.05, h * 0.13)
      ctx.strokeStyle = ACCENT.accent
      ctx.lineWidth = 5
      ctx.beginPath()
      for (let i = 0; i <= 20; i++) {
        const x = w * 0.06 + (i / 20) * w * 0.88
        const y = h * (0.75 - 0.35 * (i / 20) - 0.08 * Math.sin(i * 1.3))
        if (i) ctx.lineTo(x, y)
        else ctx.moveTo(x, y)
      }
      ctx.stroke()
      ctx.setLineDash([10, 8])
      ctx.strokeStyle = ACCENT.live
      ctx.beginPath()
      ctx.moveTo(w * 0.06, h * 0.76)
      ctx.lineTo(w * 0.94, h * 0.4)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#8a93b2'
      ctx.font = `500 ${h * 0.065}px "JetBrains Mono", monospace`
      ctx.fillText('r² ≥ 0.25 ✓', w * 0.7, h * 0.92)
    },
    [],
    { w: 640, h: 400 },
  )
  const pegs = useMemo(() => {
    const r = rng(9)
    return Array.from({ length: 9 }, (_, i) => [-1.1 + i * 0.27, (r() - 0.5) * 0.3, 0.12 + r() * 0.3])
  }, [])
  return (
    <group>
      {/* workbench */}
      <B size={[4.8, 0.1, 0.95]} color="#5a4030" rough={0.6} position={[0, 0.9, -2.45]} />
      <B size={[4.6, 0.7, 0.8]} color={PAL.woodDark} position={[0, 0.45, -2.45]} />
      {[-1.8, -0.6, 0.6, 1.8].map((x) => (
        <B key={x} size={[1.0, 0.02, 0.01]} color={PAL.metal} metal={0.7} position={[x, 0.65, -2.04]} />
      ))}
      {/* pegboard + tools */}
      <B size={[2.4, 1.1, 0.04]} color="#3a3352" position={[1.05, 2.15, -2.95]} />
      {pegs.map(([x, y, hgt], i) => (
        <B key={i} size={[0.05, hgt, 0.04]} color={i % 3 ? PAL.metal : ACCENT.live} metal={0.6} position={[1.05 + x, 2.15 + y, -2.9]} />
      ))}
      <Frame size={[1.5, 0.95]} map={dash} color={PAL.dark} position={[-1.5, 2.35, -2.94]} />
      {/* TimeCapsule */}
      <group position={[0.35, 1.13, -2.25]} rotation={[0, 0.3, Math.PI / 2]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.16, 0.4, 8, 24]} />
          <meshStandardMaterial color="#c9d2ee" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.165, 0.012, 8, 40]} />
          <meshBasicMaterial color={new THREE.Color(ACCENT.accent).multiplyScalar(2)} toneMapped={false} />
        </mesh>
      </group>
      {/* Ballot box */}
      <group position={[1.65, 0.95, -2.25]}>
        <B size={[0.5, 0.45, 0.45]} color="#d8dceb" rough={0.4} position={[0, 0.225, 0]} />
        <B size={[0.3, 0.02, 0.05]} color={ACCENT.live} emissive={ACCENT.live} ei={2.5} position={[0, 0.455, 0]} />
        <B size={[0.18, 0.24, 0.005]} color="#ffffff" position={[0.05, 0.55, 0]} rotation={[0, 0, 0.15]} />
      </group>
      <CrowdTable position={[-1.55, 0, 1.05]} />
      {/* basketball hoop on the side wall */}
      <B size={[0.05, 0.75, 1.05]} color="#e9edf7" position={[2.92, 2.72, 0.6]} />
      <B size={[0.06, 0.28, 0.36]} color="#e9edf7" emissive={ACCENT.live} ei={0.3} position={[2.88, 2.62, 0.6]} />
      <mesh position={[2.66, 2.45, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.018, 8, 32]} />
        <meshStandardMaterial color="#e0582a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[1.7, 0.14, 1.7]} castShadow>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color="#d96a2b" roughness={0.75} />
      </mesh>
      <Cyl r={0.2} h={0.6} color={PAL.wood} metal={0} position={[0.4, 0.3, -1.4]} />
    </group>
  )
}

// ------------------------------------------------------------
// 05 · Skills — The Library
// ------------------------------------------------------------
export function Library() {
  return (
    <group>
      <Rug r={1.6} color="#1d2b55" position={[0, 0.012, 0.9]} />
      <Bookcase w={1.78} h={3.5} rows={5} seed={2} tints={[ACCENT.mint, ACCENT.mint, ACCENT.accent, ACCENT.accent, ACCENT.accent]} position={[-1.9, 0, -2.75]} />
      <Bookcase w={1.78} h={3.5} rows={5} seed={4} tints={[ACCENT.gold, ACCENT.gold, ACCENT.agent, ACCENT.agent, ACCENT.agent]} position={[0, 0, -2.75]} />
      <Bookcase w={1.78} h={3.5} rows={5} seed={6} tints={[ACCENT.live, ACCENT.live, ACCENT.mint, ACCENT.mint, ACCENT.mint]} position={[1.9, 0, -2.75]} />
      {/* rolling ladder */}
      <group position={[0.95, 0, -2.2]} rotation={[-0.22, 0, 0]}>
        {[-0.22, 0.22].map((x) => (
          <B key={x} size={[0.05, 3.4, 0.05]} color={PAL.wood} position={[x, 1.7, 0]} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <B key={i} size={[0.44, 0.04, 0.05]} color={PAL.wood} position={[0, 0.3 + i * 0.36, 0]} />
        ))}
      </group>
      <Desk w={1.6} d={0.9} position={[0, 0, 0.9]} color="#4a3346" />
      {/* globe */}
      <group position={[-0.45, 0.79, 0.9]}>
        <Cyl r={0.1} h={0.03} color="#b08b3e" metal={0.8} />
        <Cyl r={0.015} h={0.2} color="#b08b3e" metal={0.8} position={[0, 0.1, 0]} />
        <Spin speed={0.4} position={[0, 0.34, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#2a5a8c" roughness={0.6} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.165, 12, 8]} />
            <meshBasicMaterial color={ACCENT.accent} wireframe transparent opacity={0.4} />
          </mesh>
        </Spin>
      </group>
      {/* open book + desk lamp */}
      <B size={[0.4, 0.03, 0.28]} color="#efe6cf" position={[0.25, 0.81, 0.95]} rotation={[0, 0.2, 0]} />
      <group position={[0.6, 0.79, 0.65]}>
        <Cyl r={0.08} h={0.02} />
        <Cyl r={0.012} h={0.4} position={[0, 0.2, 0]} />
        <Cyl r={0.04} r2={0.1} h={0.12} color="#ffcf8a" emissive="#ffcf8a" ei={1.5} position={[0, 0.42, 0]} />
      </group>
      <Armchair color="#3a2f5e" position={[-2.0, 0, 1.3]} rotation={[0, 0.9, 0]} />
      <Armchair color="#3a2f5e" position={[2.0, 0, 1.3]} rotation={[0, -0.9, 0]} />
    </group>
  )
}

// ------------------------------------------------------------
// 06 · Certs — The Trophy Hall
// ------------------------------------------------------------
function Pedestal({ children, ...props }) {
  return (
    <group {...props}>
      <B size={[0.8, 0.12, 0.8]} color="#cfd2e2" rough={0.25} position={[0, 0.06, 0]} />
      <B size={[0.62, 0.95, 0.62]} color="#e4e6f0" rough={0.25} position={[0, 0.595, 0]} />
      <B size={[0.64, 0.05, 0.64]} color={ACCENT.gold} metal={0.9} rough={0.25} position={[0, 0.95, 0]} />
      <B size={[0.74, 0.08, 0.74]} color="#cfd2e2" rough={0.25} position={[0, 1.1, 0]} />
      {/* light beam from the ceiling */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.18, 0.55, 2.8, 32, 1, true]} />
        <meshBasicMaterial color={ACCENT.gold} transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <Spin speed={0.5} position={[0, 1.14, 0]}>
        {children}
      </Spin>
    </group>
  )
}

const gold = <meshStandardMaterial color="#e8c275" metalness={1} roughness={0.22} />

function Cup() {
  const geo = useMemo(() => {
    const pts = [
      [0, 0],
      [0.16, 0],
      [0.16, 0.04],
      [0.05, 0.08],
      [0.04, 0.22],
      [0.08, 0.27],
      [0.2, 0.36],
      [0.22, 0.55],
      [0.2, 0.56],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(pts, 40)
  }, [])
  return (
    <group>
      <mesh geometry={geo} castShadow>
        {gold}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.23, 0.44, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.07, 0.015, 8, 20, Math.PI]} />
          {gold}
        </mesh>
      ))}
    </group>
  )
}

function Medal() {
  return (
    <group position={[0, 0.32, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 40]} />
        {gold}
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.02, 8, 40]} />
        <meshStandardMaterial color="#fff2c8" metalness={1} roughness={0.1} />
      </mesh>
      <B size={[0.08, 0.3, 0.01]} color={ACCENT.agent} position={[0, -0.2, 0]} />
    </group>
  )
}

function Crystal() {
  return (
    <group position={[0, 0.34, 0]}>
      <mesh castShadow>
        <octahedronGeometry args={[0.24, 0]} />
        <meshPhysicalMaterial color="#9fdcff" transmission={0.6} roughness={0.05} thickness={0.4} emissive={ACCENT.accent} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export function TrophyHall() {
  const banner = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#1b1530'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = ACCENT.gold
      ctx.lineWidth = 4
      ctx.strokeRect(12, 12, w - 24, h - 24)
      ctx.fillStyle = ACCENT.gold
      ctx.textAlign = 'center'
      ctx.font = `600 ${h * 0.26}px "Space Grotesk", sans-serif`
      ctx.fillText('HALL OF CREDENTIALS', w / 2, h * 0.62)
    },
    [],
    { w: 1024, h: 160 },
  )
  return (
    <group>
      <Rug r={2.2} color="#2b2238" position={[0, 0.012, -0.6]} />
      <Frame size={[3.6, 0.56]} map={banner} color="#6b5226" position={[0, 3.1, -2.94]} />
      <Pedestal position={[-1.8, 0, -0.6]}>
        <Medal />
      </Pedestal>
      <Pedestal position={[0, 0, -1.3]}>
        <Cup />
      </Pedestal>
      <Pedestal position={[1.8, 0, -0.6]}>
        <Crystal />
      </Pedestal>
      {/* velvet rope */}
      {[-2.4, -0.8, 0.8, 2.4].map((x) => (
        <group key={x} position={[x, 0, 1.1]}>
          <Cyl r={0.12} h={0.04} color={ACCENT.gold} metal={0.9} rough={0.25} position={[0, 0.02, 0]} />
          <Cyl r={0.025} h={0.9} color={ACCENT.gold} metal={0.9} rough={0.25} position={[0, 0.45, 0]} />
        </group>
      ))}
      {[-1.6, 0, 1.6].map((x) => (
        <mesh key={x} position={[x, 0.78, 1.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 1.6, 8]} />
          <meshStandardMaterial color="#7a1d3a" roughness={0.9} />
        </mesh>
      ))}
      <Plant position={[-2.5, 0, -2.5]} />
      <Plant position={[2.5, 0, -2.5]} />
    </group>
  )
}

// ------------------------------------------------------------
// 07 · Contact — The Signal Deck (roof)
// ------------------------------------------------------------
const PYLON_COLOURS = [ACCENT.accent, ACCENT.agent, ACCENT.mint, ACCENT.gold, ACCENT.live]
const LIVE = new THREE.Color(ACCENT.live)

function Dish(props) {
  const head = useRef()
  const rings = useRef([])
  const beacon = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (head.current) head.current.rotation.y = Math.sin(t * 0.25) * 0.6
    rings.current.forEach((r, i) => {
      if (!r) return
      const k = (t * 0.4 + i / 3) % 1
      r.scale.setScalar(0.3 + k * 3.2)
      r.material.opacity = (1 - k) * 0.5
    })
    if (beacon.current) beacon.current.material.color.copy(LIVE).multiplyScalar(Math.sin(t * 3) > 0.6 ? 3 : 1)
  })
  return (
    <group {...props}>
      <Cyl r={0.5} h={0.2} color={PAL.dark} position={[0, 0.1, 0]} />
      <Cyl r={0.08} h={1.6} position={[0, 0.9, 0]} />
      <group ref={head} position={[0, 1.7, 0]}>
        <group rotation={[-0.7, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[1.0, 40, 16, 0, Math.PI * 2, 0, 0.75]} />
            <meshStandardMaterial color="#d8dceb" metalness={0.4} roughness={0.35} side={THREE.DoubleSide} />
          </mesh>
          <Cyl r={0.02} h={0.9} position={[0, 0.55, 0]} />
          <mesh ref={beacon} position={[0, 1.02, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={ACCENT.live} toneMapped={false} />
          </mesh>
        </group>
      </group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1, 64]} />
          <meshBasicMaterial color={ACCENT.agent} transparent opacity={0.4} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

export function SignalDeck({ hotspots }) {
  return (
    <group>
      <Dish position={[0, 0, -1.4]} />
      {hotspots.map((h, i) => (
        <group key={h.id} position={[h.pos[0], 0, h.pos[2]]}>
          <Cyl r={0.16} r2={0.2} h={0.1} color={PAL.dark} position={[0, 0.05, 0]} />
          <Cyl r={0.04} h={1.1} color={PAL.metal} position={[0, 0.6, 0]} />
          <mesh position={[0, 1.25, 0]}>
            <icosahedronGeometry args={[0.13, 1]} />
            <meshBasicMaterial color={new THREE.Color(PYLON_COLOURS[i]).multiplyScalar(2)} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* rooftop clutter: AC units + solar panels */}
      {[-6.6, 6.6].map((x) => (
        <group key={x} position={[x, 0, -1.6]}>
          {[-0.75, 0.75].map((dz) => (
            <group key={dz} position={[0, 0.5, dz]} rotation={[-0.45, 0, 0]}>
              <B size={[2.6, 0.06, 1.2]} color="#1a2a66" metal={0.6} rough={0.25} />
              <B size={[0.06, 0.8, 0.06]} color={PAL.metal} position={[0, -0.4, 0]} />
            </group>
          ))}
        </group>
      ))}
      <B size={[0.9, 0.6, 0.6]} color="#5e6788" position={[-3.8, 0.3, -2.2]} />
      <B size={[0.9, 0.6, 0.6]} color="#5e6788" position={[3.8, 0.3, -2.2]} />
      <Cyl r={0.22} h={0.04} color="#2b2f45" position={[-3.8, 0.62, -2.2]} />
      <Cyl r={0.22} h={0.04} color="#2b2f45" position={[3.8, 0.62, -2.2]} />
    </group>
  )
}

export const ROOM_COMPONENTS = {
  about: Study,
  work: AgentLab,
  internships: RnDBay,
  projects: Workshop,
  skills: Library,
  certs: TrophyHall,
  contact: SignalDeck,
}
