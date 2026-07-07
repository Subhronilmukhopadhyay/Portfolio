import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import NeuralGraph from './NeuralGraph'
import AgentCore from './AgentCore'
import { COLORS } from './util'

function Rig({ animate }) {
  const { size, camera } = useThree()
  const compact = size.width < 860
  const base = useRef(9)
  const coreRef = useRef()
  const scroll = useRef(0)

  useEffect(() => {
    const on = () => {
      scroll.current = window.scrollY / Math.max(window.innerHeight, 1)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const baseScale = compact ? 0.78 : 1
  const baseX = compact ? 0 : 3.0
  const baseY = compact ? 1.35 : 0.25

  useFrame((state) => {
    if (animate) {
      const px = state.pointer.x
      const py = state.pointer.y
      camera.position.x += (px * 0.7 - camera.position.x) * 0.035
      camera.position.y += (py * 0.45 - camera.position.y) * 0.035
      camera.position.z += (base.current - camera.position.z) * 0.02
      camera.lookAt(0, 0, 0)
    }
    // dissolve the core as we scroll past the hero → only ambient graph remains
    if (coreRef.current) {
      const t = THREE.MathUtils.clamp(scroll.current, 0, 1)
      const s = baseScale * (1 - t * 0.92)
      coreRef.current.scale.setScalar(Math.max(s, 0.001))
      coreRef.current.position.set(baseX + t * 1.5, baseY + t * 3.2, -t * 2)
      coreRef.current.visible = s > 0.05
    }
  })

  return (
    <>
      <NeuralGraph animate={animate} count={compact ? 54 : 80} signalCount={compact ? 16 : 26} />

      <group ref={coreRef} position={[baseX, baseY, 0]} scale={baseScale}>
        <AgentCore animate={animate} />
      </group>

      <Sparkles
        count={compact ? 40 : 70}
        scale={[18, 11, 7]}
        size={2.2}
        speed={animate ? 0.28 : 0}
        opacity={0.5}
        color={COLORS.starlight}
      />

      <EffectComposer disableNormalPass>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.9}
          radius={0.72}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

export default function CanvasScene({ animate = true }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={animate ? 'always' : 'demand'}
    >
      <fog attach="fog" args={['#05060e', 11, 24]} />
      <Suspense fallback={null}>
        <Rig animate={animate} />
      </Suspense>
    </Canvas>
  )
}
