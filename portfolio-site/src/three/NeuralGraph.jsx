import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildGraph, makeDotTexture, COLORS } from './util'

/**
 * Ambient "living agent graph": glowing nodes joined by faint synaptic edges,
 * with signal packets that fire along the edges — the Neural Cosmos backbone.
 */
export default function NeuralGraph({ count = 78, signalCount = 26, animate = true }) {
  const { nodes, edges } = useMemo(() => buildGraph({ count, spread: 9, depth: 5, neighbours: 2 }), [count])
  const dot = useMemo(() => makeDotTexture(), [])

  // --- node points geometry (+ per-vertex color) ---
  const nodeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(nodes.length * 3)
    const col = new Float32Array(nodes.length * 3)
    const c1 = new THREE.Color(COLORS.accent)
    const c2 = new THREE.Color(COLORS.agent)
    const tmp = new THREE.Color()
    nodes.forEach((n, i) => {
      pos[i * 3] = n.x
      pos[i * 3 + 1] = n.y
      pos[i * 3 + 2] = n.z
      tmp.copy(c1).lerp(c2, Math.random())
      col[i * 3] = tmp.r
      col[i * 3 + 1] = tmp.g
      col[i * 3 + 2] = tmp.b
    })
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [nodes])

  // --- edges geometry ---
  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], i) => {
      pos[i * 6] = nodes[a].x
      pos[i * 6 + 1] = nodes[a].y
      pos[i * 6 + 2] = nodes[a].z
      pos[i * 6 + 3] = nodes[b].x
      pos[i * 6 + 4] = nodes[b].y
      pos[i * 6 + 5] = nodes[b].z
    })
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [nodes, edges])

  // --- signal packets ---
  const signals = useMemo(
    () =>
      Array.from({ length: signalCount }, () => ({
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.35,
      })),
    [signalCount, edges.length],
  )
  const signalGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(signalCount * 3), 3))
    return g
  }, [signalCount])

  const signalRef = useRef()
  const groupRef = useRef()

  // dispose GPU buffers when they are rebuilt (e.g. crossing the mobile
  // breakpoint) or on unmount — R3F does not auto-dispose prop-attached objects.
  useEffect(() => () => nodeGeo.dispose(), [nodeGeo])
  useEffect(() => () => edgeGeo.dispose(), [edgeGeo])
  useEffect(() => () => signalGeo.dispose(), [signalGeo])
  useEffect(() => () => dot.dispose(), [dot])

  useFrame((state, delta) => {
    if (!animate) return
    const t = state.clock.elapsedTime
    // gentle drift of the whole field
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.12
      groupRef.current.rotation.x = Math.cos(t * 0.04) * 0.05
    }
    // advance signals
    const arr = signalGeo.attributes.position.array
    for (let i = 0; i < signals.length; i++) {
      const s = signals[i]
      s.t += delta * s.speed
      if (s.t > 1) {
        s.t = 0
        s.edge = Math.floor(Math.random() * edges.length)
      }
      const [a, b] = edges[s.edge]
      arr[i * 3] = THREE.MathUtils.lerp(nodes[a].x, nodes[b].x, s.t)
      arr[i * 3 + 1] = THREE.MathUtils.lerp(nodes[a].y, nodes[b].y, s.t)
      arr[i * 3 + 2] = THREE.MathUtils.lerp(nodes[a].z, nodes[b].z, s.t)
    }
    signalGeo.attributes.position.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial
          color={COLORS.accent}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points geometry={nodeGeo}>
        <pointsMaterial
          size={0.22}
          map={dot}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <points ref={signalRef} geometry={signalGeo} visible={animate}>
        <pointsMaterial
          size={0.42}
          map={dot}
          color={COLORS.mint}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
