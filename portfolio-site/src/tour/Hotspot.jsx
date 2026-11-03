import { Html } from '@react-three/drei'

/**
 * A pulsing marker pinned to a prop in the room. It's a real <button>, so
 * it's reachable by keyboard and screen readers, not just the mouse.
 */
export default function Hotspot({ position, label, color, active, onSelect, delay = 0 }) {
  return (
    <Html position={position} center zIndexRange={[30, 0]}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className={`hotspot ${active ? 'is-active' : ''}`}
        style={{ '--hs': color, animationDelay: `${delay}s` }}
      >
        <span className="hotspot-dot" aria-hidden="true" />
        <span className="hotspot-label">{label}</span>
      </button>
    </Html>
  )
}
