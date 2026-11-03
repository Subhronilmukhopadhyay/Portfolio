import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import SceneBoundary from '../components/SceneBoundary'
import { profile, contact } from '../data/resume'
import { ArrowIcon } from '../components/ui/icons'
import { scenes, sceneIndex, ACCENT } from './scenes'
import Detail from './details'

const TourCanvas = lazy(() => import('./TourCanvas'))

const ease = [0.16, 1, 0.3, 1]
const HOUSE = 1
const LAST = scenes.length - 1

function useViewport() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight })
  const [vp, setVp] = useState(read)
  useEffect(() => {
    const on = () => setVp(read())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return vp
}

/** Wait (briefly) for web fonts so canvas-drawn signs use the real type. */
function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const done = () => setReady(true)
    const t = setTimeout(done, 1500)
    document.fonts?.ready.then(done)
    return () => clearTimeout(t)
  }, [])
  return ready
}

export default function Tour({ onClassic }) {
  const reduce = useReducedMotion()
  const { w, h } = useViewport()
  const compact = w < 860
  const fontsReady = useFontsReady()

  const [phase, setPhase] = useState('gate') // gate → opening → inside
  const [idx, setIdx] = useState(0)
  const [hotspot, setHotspot] = useState(null)
  const [auto, setAuto] = useState(false)
  const lock = useRef(0)

  const scene = scenes[idx]
  const room = scene.room
  const stop = phase === 'gate' ? 'entrance' : phase === 'opening' ? 'door' : scene.id
  const hs = room && hotspot ? room.hotspots.find((x) => x.id === hotspot) : null
  const accent = room ? ACCENT[room.accent] : ACCENT.accent

  const panelOpen = phase === 'inside' && !!room
  const panelPx = panelOpen ? (compact ? Math.round(h * 0.4) : 440) : 0

  const enter = useCallback(() => {
    if (phase !== 'gate') return
    setPhase('opening')
    setTimeout(
      () => {
        setPhase('inside')
        setIdx(HOUSE)
      },
      reduce ? 300 : 2500,
    )
  }, [phase, reduce])

  const go = useCallback(
    (i) => {
      if (phase !== 'inside') return
      setIdx(Math.max(HOUSE, Math.min(LAST, i)))
      setHotspot(null)
    },
    [phase],
  )
  const goRoom = useCallback((id) => go(sceneIndex(id)), [go])
  const pickHotspot = useCallback(
    (roomId, id) => {
      setAuto(false)
      setIdx(sceneIndex(roomId))
      setHotspot((cur) => (cur === id ? null : id))
    },
    [],
  )

  // keyboard: ← → to move between rooms, Esc to step back out
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return
      if (phase === 'gate' && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) return enter()
      if (phase !== 'inside') return
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault()
        setAuto(false)
        go(idx + 1)
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        setAuto(false)
        go(idx - 1)
      } else if (e.key === 'Escape') {
        if (hotspot) setHotspot(null)
        else go(HOUSE)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, idx, hotspot, go, enter])

  // wheel / trackpad: one notch = one room (panels keep their own scroll)
  useEffect(() => {
    const onWheel = (e) => {
      if (e.target.closest?.('[data-tour-scroll]')) return
      if (Math.abs(e.deltaY) < 18) return
      const now = performance.now()
      if (now < lock.current) return
      lock.current = now + 1100
      setAuto(false)
      if (phase === 'gate') return e.deltaY > 0 && enter()
      go(idx + (e.deltaY > 0 ? 1 : -1))
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [phase, idx, go, enter])

  // auto tour: glide room to room
  useEffect(() => {
    if (!auto || phase !== 'inside') return
    if (idx >= LAST) {
      setAuto(false)
      return
    }
    const t = setTimeout(() => go(idx + 1), idx === HOUSE ? 2500 : 6500)
    return () => clearTimeout(t)
  }, [auto, idx, phase, go])

  return (
    <div className="fixed inset-0 overflow-hidden bg-void text-starlight">
      {/* ---------------- 3D ---------------- */}
      <div className="absolute inset-0" aria-hidden={phase === 'gate'}>
        <SceneBoundary onError={onClassic}>
          <Suspense fallback={<Loader />}>
            {fontsReady ? (
              <TourCanvas
                stop={stop}
                sceneId={phase === 'inside' ? scene.id : 'entrance'}
                opened={phase !== 'gate'}
                hotspot={hotspot}
                panelPx={panelPx}
                panelSide={compact ? 'bottom' : 'right'}
                animate={!reduce}
                lite={compact}
                onEnterRoom={(id) => {
                  setAuto(false)
                  goRoom(id)
                }}
                onHotspot={pickHotspot}
              />
            ) : (
              <Loader />
            )}
          </Suspense>
        </SceneBoundary>
      </div>

      {/* ---------------- top bar ---------------- */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 md:py-5">
        <button
          type="button"
          onClick={() => (phase === 'inside' ? go(HOUSE) : null)}
          className="pointer-events-auto flex items-center gap-2.5"
          aria-label="Back to the house overview"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/40 bg-void/40 backdrop-blur">
            <span className="mono text-xs font-bold text-accent">SM</span>
          </span>
          <span className="hidden font-display font-semibold tracking-tight sm:block">
            Nexus House<span className="text-dust"> · {profile.firstName}</span>
          </span>
        </button>
        <div className="pointer-events-auto flex items-center gap-2 whitespace-nowrap">
          {phase === 'inside' && !compact && (
            <button
              type="button"
              onClick={() => {
                if (!auto && idx >= LAST) go(HOUSE)
                setAuto((a) => !a)
              }}
              className="tour-btn"
              aria-pressed={auto}
            >
              {auto ? '❚❚ Pause' : '▶ Auto tour'}
            </button>
          )}
          <button type="button" onClick={onClassic} className="tour-btn">
            Classic site
          </button>
          <a href={contact.resume} target="_blank" rel="noreferrer" className="tour-btn hidden sm:inline-flex">
            Résumé ↓
          </a>
        </div>
      </header>

      {/* ---------------- entrance ---------------- */}
      <AnimatePresence>
        {phase === 'gate' && (
          <motion.section
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -20, transition: { duration: 0.6 } }}
            className="absolute inset-0 z-40 flex items-end px-5 pb-24 md:items-center md:px-16 md:pb-0"
            style={{
              background: 'radial-gradient(900px 700px at 15% 55%, rgba(5,6,14,0.85), rgba(5,6,14,0.3) 55%, transparent 75%)',
            }}
          >
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease }}
                className="mono mb-3 text-sm text-accent"
              >
                {'>'} welcome — you&apos;re standing outside
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.9, ease }}
                className="text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
              >
                {profile.firstName}
                <br />
                <span className="text-starlight/85">{profile.lastName}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8, ease }}
                className="mt-5 text-lg text-dust md:text-xl"
              >
                <span className="text-starlight">{profile.role}</span> @ {profile.company} ·{' '}
                <span className="grad-text font-semibold">{profile.discipline}</span>
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-3 max-w-md text-dust"
              >
                Seven rooms, one career. Step inside and look around — every glowing marker opens a story.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.8, ease }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <button
                  type="button"
                  onClick={enter}
                  autoFocus
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-medium text-void transition hover:shadow-[0_0_40px_-4px_var(--color-accent)]"
                >
                  Enter the house
                  <ArrowIcon className="transition-transform group-hover:translate-x-1" width={18} height={18} />
                </button>
                <button type="button" onClick={onClassic} className="text-sm text-dust underline-offset-4 hover:text-starlight hover:underline">
                  or read the classic page
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ---------------- welcome card in the overview ---------------- */}
      <AnimatePresence>
        {phase === 'inside' && idx === HOUSE && !auto && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.7, ease } }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-4 top-20 z-40 max-w-sm md:left-8 md:top-24"
          >
            <div className="glass rounded-2xl p-5">
              <div className="mono text-[11px] uppercase tracking-widest text-accent">the house</div>
              <h2 className="mt-1 text-2xl font-semibold">Pick a room.</h2>
              <p className="mt-2 text-sm text-dust">
                Click any room, or let the camera walk you through. Scroll and the arrow keys work too.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => go(HOUSE + 1)} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-void">
                  Start the tour <ArrowIcon width={16} height={16} />
                </button>
                <button type="button" onClick={() => setAuto(true)} className="tour-btn">
                  ▶ Auto tour
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- room title card ---------------- */}
      <AnimatePresence mode="wait">
        {phase === 'inside' && room && !(compact && hs) && (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, x: reduce ? 0 : -24 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.35, duration: 0.7, ease } }}
            exit={{ opacity: 0, x: reduce ? 0 : -16, transition: { duration: 0.25 } }}
            className="pointer-events-none absolute left-4 top-20 z-40 md:left-8 md:top-24"
            style={{ '--hs': accent }}
          >
            <div className="mono text-xs tracking-widest" style={{ color: accent }}>
              <span className="text-dust">//</span> {room.index}_{room.label.toUpperCase()}
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-5xl" style={{ textShadow: '0 2px 24px rgba(5,6,14,0.9)' }}>
              {room.name}
            </h2>
            <p className="mt-1 hidden max-w-xs text-dust md:block">{room.sub}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- info panel ---------------- */}
      <AnimatePresence>
        {panelOpen && (
          <motion.aside
            key="panel"
            initial={compact ? { y: '100%' } : { x: 40, opacity: 0 }}
            animate={compact ? { y: 0 } : { x: 0, opacity: 1 }}
            exit={compact ? { y: '100%' } : { x: 40, opacity: 0 }}
            transition={{ duration: 0.55, ease }}
            className={
              compact
                ? 'absolute inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-white/10 bg-void/85 backdrop-blur-xl'
                : 'absolute bottom-24 right-6 top-20 z-40 w-[400px]'
            }
            style={compact ? { height: panelPx } : undefined}
            aria-label={`${room.name} details`}
          >
            <div
              data-tour-scroll
              className={`h-full overflow-y-auto overscroll-contain ${compact ? 'px-5 pb-24 pt-5' : 'glass rounded-2xl p-6'}`}
              style={{ '--color-accent': accent }}
            >
              <AnimatePresence mode="wait">
                {hs ? (
                  <motion.div key={hs.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                    <button type="button" onClick={() => setHotspot(null)} className="mono mb-4 text-xs text-dust hover:text-starlight">
                      ← {room.name}
                    </button>
                    <Detail refObj={hs.ref} />
                  </motion.div>
                ) : (
                  <motion.div key={`list-${room.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                    <div className="mono text-[11px] uppercase tracking-widest text-dust">in this room</div>
                    <ul className="mt-3 space-y-1.5">
                      {room.hotspots.map((x) => (
                        <li key={x.id}>
                          <button
                            type="button"
                            onClick={() => pickHotspot(room.id, x.id)}
                            className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-left transition hover:border-[color:var(--color-accent)]/50 hover:bg-white/[0.05]"
                          >
                            <span className="flex items-center gap-3">
                              <span className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
                              {x.label}
                            </span>
                            <ArrowIcon width={16} height={16} className="text-dust transition group-hover:translate-x-0.5 group-hover:text-starlight" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-xs text-dust">Tip: drag to look around · click the glowing markers in the room.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ---------------- scene dock ---------------- */}
      <AnimatePresence>
        {phase === 'inside' && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.6, ease } }}
            className="absolute bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-void/70 p-1.5 backdrop-blur-xl"
            aria-label="Rooms"
          >
            <button type="button" onClick={() => { setAuto(false); go(idx - 1) }} disabled={idx <= HOUSE} className="dock-arrow" aria-label="Previous room">
              ‹
            </button>
            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
              {scenes.slice(HOUSE).map((s, k) => {
                const i = k + HOUSE
                const on = i === idx
                const c = s.room ? ACCENT[s.room.accent] : ACCENT.accent
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setAuto(false)
                      go(i)
                    }}
                    aria-current={on ? 'step' : undefined}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition md:text-sm ${on ? 'text-void' : 'text-dust hover:text-starlight'}`}
                    style={on ? { background: c, boxShadow: `0 0 18px -2px ${c}` } : undefined}
                  >
                    {s.room ? (
                      <>
                        <span className="mono mr-1 opacity-60">{s.index}</span>
                        {s.label}
                      </>
                    ) : (
                      '⌂ House'
                    )}
                  </button>
                )
              })}
            </div>
            <button type="button" onClick={() => { setAuto(false); go(idx + 1) }} disabled={idx >= LAST} className="dock-arrow" aria-label="Next room">
              ›
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* screen-reader narration of where the camera is */}
      <p className="sr-only" aria-live="polite">
        {phase === 'inside' ? (room ? `${room.name}: ${room.sub}` : 'House overview') : ''}
      </p>
    </div>
  )
}

function Loader() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="mono text-xs tracking-widest text-dust">
        <span className="pulse-dot mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
        BUILDING THE HOUSE…
      </div>
    </div>
  )
}
