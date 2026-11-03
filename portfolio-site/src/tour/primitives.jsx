import { useEffect, useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// ------------------------------------------------------------
// Interior palette — a dark, moody "night-time dollhouse" that
// lets the neon accents and emissive screens do the lighting.
// ------------------------------------------------------------
export const PAL = {
  wall: '#141936',
  wallLight: '#1c2247',
  floor: '#1f2040',
  wood: '#3a2d3f',
  woodDark: '#2a2131',
  metal: '#5a6488',
  dark: '#0c0f22',
  fabric: '#2f3a72',
  cream: '#cfd6f5',
  plant: '#2f8f68',
  slab: '#0f1229',
}

/** Shadow-casting box. `size` = [w, h, d], positioned by its centre. */
export function B({ size = [1, 1, 1], color = PAL.wallLight, rough = 0.85, metal = 0, emissive, ei = 1, round, ...props }) {
  const mat = (
    <meshStandardMaterial
      color={color}
      roughness={rough}
      metalness={metal}
      emissive={emissive || '#000000'}
      emissiveIntensity={emissive ? ei : 0}
      toneMapped={!emissive}
    />
  )
  if (round) {
    return (
      <RoundedBox args={size} radius={round} smoothness={3} castShadow receiveShadow {...props}>
        {mat}
      </RoundedBox>
    )
  }
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      {mat}
    </mesh>
  )
}

/** Shadow-casting cylinder. */
export function Cyl({ r = 0.5, r2, h = 1, seg = 24, color = PAL.metal, rough = 0.6, metal = 0.3, emissive, ei = 1, ...props }) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <cylinderGeometry args={[r, r2 ?? r, h, seg]} />
      <meshStandardMaterial
        color={color}
        roughness={rough}
        metalness={metal}
        emissive={emissive || '#000000'}
        emissiveIntensity={emissive ? ei : 0}
        toneMapped={!emissive}
      />
    </mesh>
  )
}

/** Self-lit panel (screens, light strips, neon). Blooms. */
export function Glow({ size = [1, 1], color = '#3de8ff', intensity = 1.6, map, ...props }) {
  return (
    <mesh {...props}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        color={map ? '#ffffff' : new THREE.Color(color).multiplyScalar(intensity)}
        map={map || null}
        toneMapped={false}
      />
    </mesh>
  )
}

/**
 * Text/graphics drawn onto a canvas → texture, so screens and signs can
 * carry real words without loading a 3D font from a CDN.
 */
export function useCanvasTexture(draw, deps, { w = 512, h = 256 } = {}) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')
    draw(ctx, w, h)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

/** A wall-hung picture frame with a canvas-drawn picture. */
export function Frame({ size = [1, 1], color = PAL.woodDark, map, glow = '#3de8ff', ...props }) {
  const [w, h] = size
  return (
    <group {...props}>
      <B size={[w + 0.12, h + 0.12, 0.06]} color={color} rough={0.5} />
      <Glow size={[w, h]} map={map} color={glow} intensity={0.9} position={[0, 0, 0.035]} />
    </group>
  )
}

/** Potted plant: pot + a few leafy blobs. */
export function Plant({ scale = 1, ...props }) {
  return (
    <group scale={scale} {...props}>
      <Cyl r={0.22} r2={0.17} h={0.42} color="#3b3550" metal={0} rough={0.9} position={[0, 0.21, 0]} />
      {[
        [0, 0.72, 0, 0.28],
        [0.14, 0.92, 0.05, 0.2],
        [-0.13, 0.86, -0.06, 0.22],
        [0.02, 1.1, -0.02, 0.17],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color={PAL.plant} roughness={0.8} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/** Simple desk: top + four legs. */
export function Desk({ w = 2, d = 0.9, h = 0.76, color = PAL.wood, ...props }) {
  const lx = w / 2 - 0.06
  const lz = d / 2 - 0.06
  return (
    <group {...props}>
      <B size={[w, 0.06, d]} color={color} rough={0.55} position={[0, h, 0]} round={0.02} />
      {[
        [lx, lz],
        [-lx, lz],
        [lx, -lz],
        [-lx, -lz],
      ].map(([x, z], i) => (
        <B key={i} size={[0.05, h, 0.05]} color={PAL.metal} metal={0.6} rough={0.4} position={[x, h / 2, z]} />
      ))}
    </group>
  )
}

/** Monitor on a stand. `map` paints the screen. */
export function Monitor({ w = 0.9, h = 0.52, map, glow = '#3de8ff', ...props }) {
  return (
    <group {...props}>
      <B size={[0.06, 0.24, 0.06]} color={PAL.metal} metal={0.6} position={[0, 0.12, 0]} />
      <B size={[0.3, 0.02, 0.2]} color={PAL.metal} metal={0.6} position={[0, 0.01, 0]} />
      <B size={[w + 0.05, h + 0.05, 0.04]} color={PAL.dark} rough={0.4} position={[0, 0.24 + h / 2, 0]} />
      <Glow size={[w, h]} map={map} color={glow} intensity={0.8} position={[0, 0.24 + h / 2, 0.022]} />
    </group>
  )
}

/** Desk chair: seat, back, stem, base. */
export function Chair({ color = PAL.fabric, ...props }) {
  return (
    <group {...props}>
      <B size={[0.5, 0.08, 0.5]} color={color} round={0.03} position={[0, 0.48, 0]} />
      <B size={[0.5, 0.55, 0.07]} color={color} round={0.03} position={[0, 0.8, 0.24]} />
      <Cyl r={0.03} h={0.4} position={[0, 0.25, 0]} />
      <Cyl r={0.26} h={0.04} position={[0, 0.04, 0]} />
    </group>
  )
}

/** Draws a "screen" UI: title bar + a few glowing lines/bars. */
export function drawScreen(ctx, w, h, { title = '', color = '#3de8ff', lines = 5, bars = false, bg = '#070a1c' }) {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.globalAlpha = 0.9
  ctx.font = `600 ${Math.round(h * 0.11)}px "JetBrains Mono", monospace`
  ctx.fillText(title, w * 0.06, h * 0.17)
  ctx.globalAlpha = 0.35
  ctx.fillRect(w * 0.06, h * 0.23, w * 0.88, 2)
  if (bars) {
    const n = 9
    for (let i = 0; i < n; i++) {
      const bh = h * (0.15 + 0.5 * Math.abs(Math.sin(i * 1.7 + title.length)))
      ctx.globalAlpha = 0.45 + (i / n) * 0.5
      ctx.fillRect(w * 0.08 + i * ((w * 0.84) / n), h * 0.92 - bh, (w * 0.84) / n - 8, bh)
    }
  } else {
    for (let i = 0; i < lines; i++) {
      ctx.globalAlpha = 0.25 + 0.5 * ((i * 37) % 10) / 10
      const lw = w * (0.35 + 0.5 * Math.abs(Math.sin(i * 2.3 + title.length)))
      ctx.fillRect(w * 0.06, h * (0.34 + i * 0.12), lw, h * 0.045)
    }
  }
  ctx.globalAlpha = 1
}
