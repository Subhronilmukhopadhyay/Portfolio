import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/** Count-up number, fires when scrolled into view. */
export default function Metric({ value, prefix = '', suffix = '', label, className = '', size = 'md' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  const dec = Number.isInteger(value) ? 0 : String(value).split('.')[1]?.length || 1

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(v),
    })
    return () => controls.stop()
  }, [inView, value, reduce])

  const sizes = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-5xl',
    lg: 'text-5xl md:text-7xl',
  }

  return (
    <div ref={ref} className={className}>
      <div className={`${sizes[size]} font-display font-semibold tabular grad-text leading-none`}>
        {prefix}
        {n.toFixed(dec)}
        {suffix}
      </div>
      {label && <div className="mono text-[11px] md:text-xs uppercase tracking-widest text-dust mt-2">{label}</div>}
    </div>
  )
}
