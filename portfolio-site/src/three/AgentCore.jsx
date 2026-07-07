import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial, Line, Float } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './util'

// six satellite "agents" arranged around the core
const SAT = [
  [2.5, 0.5, 0.2],
  [-2.4, 0.9, -0.6],
  [1.6, -1.7, 0.8],
  [-1.8, -1.4, 0.4],
  [0.4, 2.1, -0.7],
  [-0.6, -2.2, -0.3],
].map((p) => new THREE.Vector3(...p))

function Packet({ target, offset, animate }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    if (!animate) {
      ref.current.position.copy(target).multiplyScalar(0.5)
      ref.current.scale.setScalar(0.1)
      ref.current.material.opacity = 0.6
      return
    }
    const t = (state.clock.elapsedTime * 0.5 + offset) % 1
    ref.current.position.copy(target).multiplyScalar(t)
    const s = Math.sin(t * Math.PI) // fade in/out along the path
    ref.current.scale.setScalar(0.06 + s * 0.09)
    ref.current.material.opacity = s
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={COLORS.mint} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

export default function AgentCore({ animate = true }) {
  const shell = useRef()
  const orbit = useRef()

  const spokes = useMemo(
    () => SAT.map((p) => [[0, 0, 0], [p.x, p.y, p.z]]),
    [],
  )

  useFrame((state, delta) => {
    if (!animate) return
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.12
      shell.current.rotation.x += delta * 0.05
    }
    if (orbit.current) {
      orbit.current.rotation.y += delta * 0.18
      orbit.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.15
    }
  })

  return (
    <group>
      {/* lights so the glass core reads with depth */}
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={40} color={COLORS.accent} />
      <pointLight position={[-4, -2, 2]} intensity={30} color={COLORS.agent} />
      <pointLight position={[0, 0, 5]} intensity={12} color={COLORS.live} />

      <Float speed={animate ? 1.4 : 0} rotationIntensity={animate ? 0.4 : 0} floatIntensity={animate ? 0.7 : 0}>
        {/* inner living core */}
        <Icosahedron args={[1.05, 6]}>
          <MeshDistortMaterial
            color={COLORS.agent}
            emissive={COLORS.accent}
            emissiveIntensity={0.35}
            roughness={0.08}
            metalness={0.35}
            distort={animate ? 0.38 : 0.12}
            speed={animate ? 1.8 : 0}
            transparent
            opacity={0.92}
          />
        </Icosahedron>

        {/* faceted wireframe shell */}
        <group ref={shell}>
          <Icosahedron args={[1.5, 1]}>
            <meshBasicMaterial
              color={COLORS.accent}
              wireframe
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </Icosahedron>
        </group>

        {/* orbiting satellites + spokes + packets */}
        <group ref={orbit}>
          {spokes.map((pts, i) => (
            <Line
              key={i}
              points={pts}
              color={COLORS.accent}
              lineWidth={1}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          ))}
          {SAT.map((p, i) => (
            <mesh key={i} position={p}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshBasicMaterial color={i % 2 ? COLORS.agent : COLORS.accent} />
            </mesh>
          ))}
          {SAT.map((p, i) => (
            <Packet key={i} target={p} offset={i / SAT.length} animate={animate} />
          ))}
        </group>
      </Float>
    </group>
  )
}
