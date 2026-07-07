const ACCENT = {
  accent: 'text-accent border-accent/30 bg-accent/5',
  agent: 'text-agent border-agent/30 bg-agent/5',
  mint: 'text-mint border-mint/30 bg-mint/5',
  live: 'text-live border-live/30 bg-live/5',
  gold: 'text-gold border-gold/30 bg-gold/5',
  dust: 'text-dust border-dust/25 bg-white/5',
}

export function Chip({ children, accent = 'accent', className = '' }) {
  return (
    <span
      className={`mono text-[11px] md:text-xs px-2.5 py-1 rounded-full border ${ACCENT[accent]} whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  )
}

const BORDER = {
  accent: 'border-accent',
  agent: 'border-agent',
  mint: 'border-mint',
  live: 'border-live',
  gold: 'border-gold',
}

/** Decorative HUD corner brackets for panels. */
export function HudCorners({ color = 'accent' }) {
  const c = BORDER[color] || BORDER.accent
  return (
    <>
      <span className={`pointer-events-none absolute left-0 top-0 h-4 w-4 border-l border-t ${c} opacity-60`} />
      <span className={`pointer-events-none absolute right-0 top-0 h-4 w-4 border-r border-t ${c} opacity-60`} />
      <span className={`pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l ${c} opacity-60`} />
      <span className={`pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b border-r ${c} opacity-60`} />
    </>
  )
}

export function Panel({ children, className = '', hover = false }) {
  return (
    <div className={`relative glass rounded-2xl ${hover ? 'glass-hover' : ''} ${className}`}>
      {children}
    </div>
  )
}
