import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { CameraControls, CameraControlsImpl, Environment, Lightformer, Sparkles, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, N8AO, Vignette } from '@react-three/postprocessing'
import House from './House'
import { viewFor, hotspotView, roomById } from './scenes'

const { ACTION } = CameraControlsImpl
const FOV = 40

/**
 * Drives the camera between stops. Flights are damped by camera-controls;
 * dragging lets the visitor glance around within a small arc.
 */
function Rig({ stop, hotspot, panelPx, panelSide, animate }) {
  const cc = useRef()
  const { size } = useThree()
  const portrait = size.width / size.height < 0.9
  const prev = useRef({ stop: null, hotspot: null })
  const token = useRef(0)

  useEffect(() => {
    const c = cc.current
    c.mouseButtons.wheel = ACTION.NONE
    c.mouseButtons.right = ACTION.NONE
    c.mouseButtons.middle = ACTION.NONE
    c.touches.two = ACTION.NONE
    c.touches.three = ACTION.NONE
    c.azimuthRotateSpeed = 0.3
    c.polarRotateSpeed = 0.3
    c.draggingSmoothTime = 0.18
    c.minPolarAngle = 0.75
    c.maxPolarAngle = 1.72
    c.minAzimuthAngle = -0.7
    c.maxAzimuthAngle = 0.7
    const [p, t] = viewFor('entrance')
    c.setLookAt(...p, ...t, false)
  }, [])

  useEffect(() => {
    const c = cc.current
    const my = ++token.current
    const room = roomById[stop]
    const h = room && hotspot ? room.hotspots.find((x) => x.id === hotspot) : null
    const [pos, target] = h ? hotspotView(room, h, { portrait }) : viewFor(stop, { portrait })

    // shift the framing so the subject isn't hidden behind the info panel
    const dist = Math.hypot(pos[0] - target[0], pos[1] - target[1], pos[2] - target[2])
    const worldPerPx = (2 * dist * Math.tan((FOV * Math.PI) / 360)) / size.height
    const ox = panelSide === 'right' ? (panelPx / 2) * worldPerPx : 0
    // camera-controls treats focal-offset y as screen-down
    // (slightly under half the sheet, leaving room for the title card above)
    const oy = panelSide === 'bottom' ? panelPx * 0.36 * worldPerPx : 0

    const fly = () => {
      if (my !== token.current) return
      c.smoothTime = animate ? (h ? 0.7 : stop === 'door' ? 1.1 : 0.95) : 0
      c.setLookAt(...pos, ...target, animate)
      c.setFocalOffset(ox, oy, 0, animate)
    }

    // leaving a close-up for a different room: back out first so the
    // camera never cuts through a wall or slab on the way
    const was = prev.current
    const leaving = was.hotspot && was.stop !== stop && roomById[was.stop]
    prev.current = { stop, hotspot }
    if (leaving && animate) {
      const [bp, bt] = viewFor(was.stop, { portrait })
      c.smoothTime = 0.45
      c.setLookAt(...bp, ...bt, true)
      const id = setTimeout(fly, 520)
      return () => clearTimeout(id)
    }
    fly()
  }, [stop, hotspot, panelPx, panelSide, portrait, size.height, animate])

  return <CameraControls ref={cc} makeDefault dollySpeed={0} truckSpeed={0} />
}

export default function TourCanvas({ stop, sceneId, opened, hotspot, panelPx, panelSide, animate, lite, onEnterRoom, onHotspot }) {
  return (
    <Canvas
      shadows={!lite}
      dpr={[1, lite ? 1.4 : 1.8]}
      camera={{ fov: FOV, near: 0.1, far: 220, position: [0, 2.4, 34] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#05060e']} />
      <fog attach="fog" args={['#05060e', 32, 85]} />

      {/* moonlight + sky fill; rooms bring their own warm lights */}
      <hemisphereLight args={['#3a4a9a', '#0a0b18', 0.55]} />
      <directionalLight
        position={[-14, 22, 18]}
        intensity={1.1}
        color="#b4c2ff"
        castShadow={!lite}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-6}
        shadow-camera-far={70}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />

      {/* procedural studio reflections — no HDRI download */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={1.2} color="#8b6cff" position={[-6, 5, 8]} scale={[10, 3, 1]} />
        <Lightformer intensity={1.2} color="#3de8ff" position={[8, 4, 6]} scale={[8, 3, 1]} />
        <Lightformer intensity={0.8} color="#ffffff" position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[20, 6, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <House
          opened={opened}
          sceneId={sceneId}
          activeHotspot={hotspot}
          interactive={opened}
          onEnterRoom={onEnterRoom}
          onHotspot={onHotspot}
        />
      </Suspense>

      <Stars radius={120} depth={40} count={lite ? 1500 : 3500} factor={4} saturation={0.4} fade speed={animate ? 0.6 : 0} />
      <Sparkles count={lite ? 30 : 70} scale={[30, 14, 20]} position={[0, 6, 6]} size={2} speed={animate ? 0.25 : 0} opacity={0.4} color="#eaf2ff" />

      <Rig stop={stop} hotspot={hotspot} panelPx={panelPx} panelSide={panelSide} animate={animate} />

      <EffectComposer multisampling={lite ? 0 : 4}>
        {!lite && <N8AO aoRadius={0.6} intensity={2.2} distanceFalloff={0.6} quality="medium" />}
        <Bloom intensity={0.85} luminanceThreshold={0.85} luminanceSmoothing={0.2} radius={0.7} mipmapBlur />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
