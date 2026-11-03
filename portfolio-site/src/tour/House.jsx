import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Grid, useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { B, Cyl, PAL, useCanvasTexture } from './primitives'
import { ROOM_COMPONENTS } from './rooms'
import Hotspot from './Hotspot'
import { rooms, ACCENT, STOREY, CEIL, HALF_W } from './scenes'

const FLOORS = {
  about: { kind: 'wood', color: '#3a2c3a' },
  work: { kind: 'tile', color: '#1b1f3e' },
  internships: { kind: 'tile', color: '#1c2638' },
  projects: { kind: 'wood', color: '#3b2b2e' },
  skills: { kind: 'wood', color: '#33263c' },
  certs: { kind: 'tile', color: '#2a2536' },
}

// ------------------------------------------------------------
// Floor textures (planks / tiles), drawn once per room
// ------------------------------------------------------------
function Floor({ kind, color }) {
  const map = useCanvasTexture(
    (ctx, w, h) => {
      const base = new THREE.Color(color)
      ctx.fillStyle = `#${base.getHexString()}`
      ctx.fillRect(0, 0, w, h)
      if (kind === 'wood') {
        const rows = 8
        for (let r = 0; r < rows; r++) {
          const off = (r % 2) * 0.5
          for (let c = -1; c < 3; c++) {
            const shade = base.clone().offsetHSL(0, 0, ((r * 7 + c * 3) % 5) * 0.012 - 0.02)
            ctx.fillStyle = `#${shade.getHexString()}`
            ctx.fillRect(((c + off) * w) / 2 + 2, (r * h) / rows + 2, w / 2 - 4, h / rows - 4)
          }
        }
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.lineWidth = 3
        for (let i = 0; i <= 4; i++) {
          ctx.beginPath()
          ctx.moveTo((i * w) / 4, 0)
          ctx.lineTo((i * w) / 4, h)
          ctx.moveTo(0, (i * h) / 4)
          ctx.lineTo(w, (i * h) / 4)
          ctx.stroke()
        }
      }
    },
    [kind, color],
    { w: 512, h: 512 },
  )
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.repeat.set(2, 2)
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
      <planeGeometry args={[5.84, 5.94]} />
      <meshStandardMaterial map={map} roughness={kind === 'wood' ? 0.7 : 0.35} metalness={kind === 'wood' ? 0 : 0.2} />
    </mesh>
  )
}

// Hotspots and room tags are HTML buttons layered over the canvas. Their
// clicks also bubble into R3F, which then raycasts with the button-relative
// offsetX/Y — i.e. a random spot near the top-left of the scene. Only trust
// pointer events that actually landed on the canvas.
const fromCanvas = (e) => e.nativeEvent?.target instanceof HTMLCanvasElement

// ------------------------------------------------------------
// One room: furniture + light + neon front frame + click target
// ------------------------------------------------------------
function Room({ room, order, lit, isCurrent, showLabel, hotspotsOn, activeHotspot, onEnter, onHotspot, interactive }) {
  const [hover, setHover] = useState(false)
  useCursor(hover && interactive && !isCurrent)
  const color = ACCENT[room.accent]
  const Furniture = ROOM_COMPONENTS[room.id]

  const light = useRef()
  const panel = useRef()
  const trim = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#000', emissive: color, emissiveIntensity: 0, toneMapped: false }),
    [color],
  )
  const level = useRef(0)
  const since = useRef(null)

  useFrame(({ clock }, dt) => {
    // rooms switch on one after another once the doors open
    if (lit && since.current === null) since.current = clock.elapsedTime
    const ready = lit && clock.elapsedTime > since.current + 0.5 + order * 0.28
    level.current = THREE.MathUtils.damp(level.current, ready ? 1 : 0, 4, dt)
    const v = level.current
    if (light.current) light.current.intensity = v * (room.roof ? 26 : 34)
    if (panel.current) panel.current.color.setScalar(0.2 + v * 2.2)
    const glow = hover && interactive ? 3.2 : isCurrent ? 2.2 : 1.1
    trim.emissiveIntensity = THREE.MathUtils.damp(trim.emissiveIntensity, v * glow, 6, dt)
  })

  const tint = useMemo(() => new THREE.Color(PAL.wall).lerp(new THREE.Color(color), 0.07), [color])
  const top = room.roof ? 0.7 : CEIL

  return (
    <group position={room.origin}>
      {!room.roof && (
        <>
          <Floor {...FLOORS[room.id]} />
          {/* tinted back wall + skirting glow */}
          <mesh position={[0, CEIL / 2, -2.99]} receiveShadow>
            <planeGeometry args={[5.84, CEIL]} />
            <meshStandardMaterial color={tint} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.06, -2.985]} material={trim}>
            <planeGeometry args={[5.84, 0.03]} />
          </mesh>
          {/* ceiling light panel */}
          <mesh position={[0, CEIL - 0.01, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.6, 0.45]} />
            <meshBasicMaterial ref={panel} color="#fff3dd" toneMapped={false} />
          </mesh>
        </>
      )}

      <pointLight
        ref={light}
        position={room.roof ? [0, 3.2, 1.5] : [0, CEIL - 0.5, 0.6]}
        intensity={0}
        distance={room.roof ? 16 : 10}
        decay={1.6}
        color={new THREE.Color('#fff1e0').lerp(new THREE.Color(color), 0.18)}
      />

      <Furniture hotspots={room.hotspots} />

      {/* neon frame around the open front */}
      {!room.roof && (
        <group position={[0, 0, 3.12]}>
          <mesh position={[0, CEIL - 0.03, 0]} material={trim}>
            <boxGeometry args={[5.9, 0.04, 0.04]} />
          </mesh>
          <mesh position={[0, 0.02, 0]} material={trim}>
            <boxGeometry args={[5.9, 0.04, 0.04]} />
          </mesh>
          {[-2.95, 2.95].map((x) => (
            <mesh key={x} position={[x, CEIL / 2, 0]} material={trim}>
              <boxGeometry args={[0.04, CEIL, 0.04]} />
            </mesh>
          ))}
        </group>
      )}

      {/* invisible click/hover target covering the room's open front */}
      {interactive && (
        <mesh
          position={[0, top / 2 + (room.roof ? 0.2 : 0), room.roof ? 0 : 1.5]}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (fromCanvas(e)) setHover(true)
          }}
          onPointerOut={() => setHover(false)}
          onClick={(e) => {
            e.stopPropagation()
            if (fromCanvas(e) && !isCurrent) onEnter(room.id)
          }}
        >
          <boxGeometry args={room.roof ? [17, 2.4, 6] : [5.9, CEIL, 3]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
      )}

      {showLabel && (
        <Html position={[0, room.roof ? 3.4 : CEIL + 0.02, 3.2]} center zIndexRange={[30, 0]}>
          <button
            type="button"
            className={`room-tag ${hover ? 'is-hover' : ''}`}
            style={{ '--hs': color }}
            onClick={() => onEnter(room.id)}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
          >
            <span className="mono">{room.index}</span> {room.label}
          </button>
        </Html>
      )}

      {hotspotsOn &&
        room.hotspots.map((h, i) => (
          <Hotspot
            key={h.id}
            position={h.pos}
            label={h.label}
            color={color}
            delay={i * 0.12}
            active={activeHotspot === h.id}
            onSelect={() => onHotspot(room.id, h.id)}
          />
        ))}
    </group>
  )
}

// ------------------------------------------------------------
// Structural shell: slabs, walls, partitions with doorways, roof
// ------------------------------------------------------------
function Shell() {
  const W = HALF_W * 2 + 0.4
  const H = STOREY * 2
  const partition = (x, y0) => (
    <group key={`${x}-${y0}`} position={[x, y0, 0]}>
      <B size={[0.16, CEIL, 0.6]} color={PAL.wall} position={[0, CEIL / 2, -2.7]} />
      <B size={[0.16, CEIL, 4.2]} color={PAL.wall} position={[0, CEIL / 2, 0.9]} />
      <B size={[0.16, CEIL - 2.4, 1.2]} color={PAL.wall} position={[0, 2.4 + (CEIL - 2.4) / 2, -1.8]} />
    </group>
  )
  return (
    <group>
      <B size={[W, 0.2, 6.4]} color={PAL.slab} position={[0, -0.1, 0]} />
      <B size={[W, 0.2, 6.4]} color={PAL.slab} position={[0, CEIL + 0.1, 0]} />
      <B size={[W, 0.2, 6.4]} color={PAL.slab} position={[0, STOREY + CEIL + 0.1, 0]} />
      <B size={[W, H, 0.2]} color={PAL.wall} position={[0, H / 2, -3.1]} />
      {[-1, 1].map((s) => (
        <B key={s} size={[0.2, H, 6.4]} color={PAL.wall} position={[s * (HALF_W + 0.1), H / 2, 0]} />
      ))}
      {[-3, 3].flatMap((x) => [partition(x, 0), partition(x, STOREY)])}
      {/* roof parapet + glass rail */}
      <B size={[W, 0.6, 0.2]} color={PAL.wall} position={[0, H + 0.3, -3.1]} />
      {[-1, 1].map((s) => (
        <B key={s} size={[0.2, 0.6, 6.4]} color={PAL.wall} position={[s * (HALF_W + 0.1), H + 0.3, 0]} />
      ))}
      <mesh position={[0, H + 0.45, 3.15]}>
        <boxGeometry args={[W, 0.9, 0.04]} />
        <meshPhysicalMaterial color="#9fb4ff" transparent opacity={0.12} roughness={0.05} />
      </mesh>
      <mesh position={[0, H + 0.92, 3.15]}>
        <boxGeometry args={[W, 0.04, 0.06]} />
        <meshBasicMaterial color={new THREE.Color(ACCENT.agent).multiplyScalar(1.5)} toneMapped={false} />
      </mesh>
    </group>
  )
}

// ------------------------------------------------------------
// The front: two dollhouse doors that swing open on entry
// ------------------------------------------------------------
const WINDOWS = [
  [-6, 2.0, 2.6, 1.6],
  [6, 2.0, 2.6, 1.6],
  [-6, STOREY + 2.0, 2.6, 1.6],
  [0, STOREY + 2.0, 2.6, 1.6],
  [6, STOREY + 2.0, 2.6, 1.6],
]

function FacadeHalf({ side, panelMat, windowMat, trimMat }) {
  const hinge = side * (HALF_W + 0.1)
  const w = HALF_W + 0.1
  const H = STOREY * 2 + 0.2
  // world-space rectangles clipped to this half, then made hinge-local
  const toLocal = (x) => x - hinge
  const mine = WINDOWS.map(([x, y, ww, hh]) => {
    const lo = Math.max(x - ww / 2, side < 0 ? -w : 0)
    const hi = Math.min(x + ww / 2, side < 0 ? 0 : w)
    return hi > lo ? [toLocal((lo + hi) / 2), y, hi - lo, hh] : null
  }).filter(Boolean)
  const doorX = toLocal(side * 0.45)

  return (
    <>
      <mesh position={[toLocal(side * (w / 2)), H / 2 - 0.2, 0]} material={panelMat} castShadow>
        <boxGeometry args={[w, H, 0.15]} />
      </mesh>
      {/* storey band */}
      <mesh position={[toLocal(side * (w / 2)), STOREY + 0.05, 0.09]} material={trimMat}>
        <boxGeometry args={[w, 0.05, 0.02]} />
      </mesh>
      {mine.map(([x, y, ww, hh], i) => (
        <group key={i} position={[x, y, 0.08]}>
          <mesh material={windowMat}>
            <planeGeometry args={[ww, hh]} />
          </mesh>
          <mesh position={[0, 0, 0.01]} material={panelMat}>
            <boxGeometry args={[0.06, hh, 0.03]} />
          </mesh>
        </group>
      ))}
      {/* door leaf + glowing outline + handle */}
      <group position={[doorX, 1.4, 0.09]}>
        <mesh material={trimMat} position={[side * 0.43, 0, 0]}>
          <boxGeometry args={[0.04, 2.8, 0.02]} />
        </mesh>
        <mesh material={trimMat} position={[0, 1.4, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.02]} />
        </mesh>
        <mesh material={trimMat} position={[-side * 0.3, 0, 0.02]}>
          <boxGeometry args={[0.04, 0.32, 0.04]} />
        </mesh>
      </group>
    </>
  )
}

function Facade({ opened }) {
  const left = useRef()
  const right = useRef()
  const sign = useRef()
  const t = useRef(0)
  const panelMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1f42', roughness: 0.6, metalness: 0.2, transparent: true }), [])
  const windowMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffcf8a').multiplyScalar(0.9), toneMapped: false, transparent: true }), [])
  const trimMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color(ACCENT.accent).multiplyScalar(2), toneMapped: false, transparent: true }), [])
  const signMap = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = '#070a1c'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = ACCENT.accent
      ctx.lineWidth = 4
      ctx.strokeRect(8, 8, w - 16, h - 16)
      ctx.textAlign = 'center'
      ctx.fillStyle = '#eaf2ff'
      ctx.font = `700 ${h * 0.42}px "Space Grotesk", sans-serif`
      ctx.fillText('NEXUS HOUSE', w / 2, h * 0.58)
      ctx.fillStyle = ACCENT.accent
      ctx.font = `500 ${h * 0.16}px "JetBrains Mono", monospace`
      ctx.fillText('S. MUKHOPADHYAY · EST. 2026', w / 2, h * 0.85)
    },
    [],
    { w: 1024, h: 200 },
  )
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

  useFrame(({ clock }, dt) => {
    if (opened) t.current += dt
    const swing = ease(THREE.MathUtils.clamp((t.current - 0.6) / 1.8, 0, 1)) * 1.95
    const fade = 1 - THREE.MathUtils.clamp((t.current - 2.1) / 0.7, 0, 1)
    if (left.current) left.current.rotation.y = -swing
    if (right.current) right.current.rotation.y = swing
    panelMat.opacity = windowMat.opacity = trimMat.opacity = fade
    // breathing door outline while waiting at the entrance
    if (!opened) trimMat.color.set(ACCENT.accent).multiplyScalar(1.4 + Math.sin(clock.elapsedTime * 2) * 0.6)
    const visible = fade > 0.001
    if (left.current) left.current.visible = visible
    if (right.current) right.current.visible = visible
    if (sign.current) {
      const s = 1 - THREE.MathUtils.clamp(t.current / 0.5, 0, 1)
      sign.current.material.opacity = s
      sign.current.visible = s > 0.001
    }
  })

  return (
    <group position={[0, 0, 3.25]}>
      <group ref={left} position={[-(HALF_W + 0.1), 0, 0]}>
        <FacadeHalf side={-1} panelMat={panelMat} windowMat={windowMat} trimMat={trimMat} />
      </group>
      <group ref={right} position={[HALF_W + 0.1, 0, 0]}>
        <FacadeHalf side={1} panelMat={panelMat} windowMat={windowMat} trimMat={trimMat} />
      </group>
      <mesh ref={sign} position={[0, 3.35, 0.12]}>
        <planeGeometry args={[3.6, 0.7]} />
        <meshBasicMaterial map={signMap} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

// ------------------------------------------------------------
// Grounds: grid, walkway with path lights, lamp posts, trees
// ------------------------------------------------------------
function Tree({ s = 1, ...props }) {
  return (
    <group scale={s} {...props}>
      <Cyl r={0.12} r2={0.18} h={1.2} color="#2a2131" metal={0} position={[0, 0.6, 0]} />
      {[
        [1.2, 1.6, 1.6],
        [0.95, 1.3, 2.5],
        [0.65, 1.1, 3.2],
      ].map(([r, h, y], i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <coneGeometry args={[r, h, 7]} />
          <meshStandardMaterial color={i % 2 ? '#1d4a4a' : '#16393f'} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Grounds() {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[90, 64]} />
        <meshStandardMaterial color="#070915" roughness={1} />
      </mesh>
      <Grid
        position={[0, 0.005, 0]}
        args={[200, 200]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#141b40"
        sectionSize={6}
        sectionThickness={1}
        sectionColor="#24306a"
        fadeDistance={70}
        fadeStrength={1.4}
        infiniteGrid
      />
      {/* walkway + steps */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 14]} receiveShadow>
        <planeGeometry args={[2.6, 21.5]} />
        <meshStandardMaterial color="#141834" roughness={0.6} metalness={0.2} />
      </mesh>
      <B size={[3, 0.1, 0.8]} color={PAL.slab} position={[0, 0.05, 3.7]} />
      {Array.from({ length: 8 }, (_, i) =>
        [-1, 1].map((s) => (
          <mesh key={`${i}${s}`} position={[s * 1.45, 0.06, 5 + i * 2.6]}>
            <boxGeometry args={[0.12, 0.1, 0.5]} />
            <meshBasicMaterial color={new THREE.Color(ACCENT.accent).multiplyScalar(1.8)} toneMapped={false} />
          </mesh>
        )),
      )}
      {[-1, 1].flatMap((s) =>
        [13, 21].map((z) => (
          <group key={`${s}${z}`} position={[s * 3.4, 0, z]}>
            <Cyl r={0.06} h={3} color="#2a3150" position={[0, 1.5, 0]} />
            <mesh position={[0, 3.1, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color={new THREE.Color('#ffd79a').multiplyScalar(2.2)} toneMapped={false} />
            </mesh>
          </group>
        )),
      )}
      <Tree position={[-12.5, 0, 1.5]} s={1.2} />
      <Tree position={[-14.5, 0, -4]} s={1.5} />
      <Tree position={[-11, 0, 8]} s={0.9} />
      <Tree position={[12.5, 0, 2]} s={1.3} />
      <Tree position={[15, 0, -3.5]} s={1.1} />
      <Tree position={[11.5, 0, 9]} s={1} />
    </group>
  )
}

// ------------------------------------------------------------
export default function House({ opened, sceneId, activeHotspot, onEnterRoom, onHotspot, interactive }) {
  return (
    <group>
      <Grounds />
      <Shell />
      {rooms.map((room, i) => (
        <Room
          key={room.id}
          room={room}
          order={i}
          lit={opened}
          isCurrent={sceneId === room.id}
          interactive={interactive}
          showLabel={interactive && sceneId === 'house'}
          hotspotsOn={sceneId === room.id}
          activeHotspot={activeHotspot}
          onEnter={onEnterRoom}
          onHotspot={onHotspot}
        />
      ))}
      <Facade opened={opened} />
    </group>
  )
}
