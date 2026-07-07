import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion'
import { navSections, profile, contact } from '../data/resume'
import { useActiveSection } from '../hooks'

export default function Nav() {
  const active = useActiveSection()
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // Mobile menu: Escape to close, focus into the overlay, and make the rest of
  // the page inert so keyboard/screen-reader users can't tab behind it.
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!open) {
      main?.removeAttribute('inert')
      return
    }
    main?.setAttribute('inert', '')
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    menuRef.current?.querySelector('a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      main?.removeAttribute('inert')
    }
  }, [open])

  const menuItem = (i) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } }

  return (
    <>
      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[70] h-0.5 w-full origin-left bg-gradient-to-r from-accent via-agent to-live"
      />

      {/* top bar — padding on the full-width bar, cap on the inner row, so it
          aligns with the section content (which uses the same structure) */}
      <header
        className={`fixed inset-x-0 top-0 z-[65] px-6 md:px-12 lg:px-20 transition-all duration-500 ${
          scrolled ? 'py-3 backdrop-blur-md bg-void/60 border-b border-white/5' : 'py-5'
        }`}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5 group">
            <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-accent/40 bg-accent/5">
              <span className="absolute inset-0 rounded-lg bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition" />
              <span className="mono text-xs font-bold text-accent relative">SM</span>
            </span>
            <span className="hidden sm:block font-display font-semibold tracking-tight">
              {profile.firstName}
              <span className="text-dust"> · {profile.discipline}</span>
            </span>
          </a>

          {/* desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {navSections.slice(1).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  active === s.id ? 'text-accent bg-accent/10' : 'text-dust hover:text-starlight'
                }`}
              >
                {s.label}
              </a>
            ))}
            <a
              href={contact.resume}
              target="_blank"
              rel="noreferrer"
              className="ml-2 rounded-full border border-accent/40 px-3.5 py-1.5 text-sm text-accent transition hover:bg-accent/10 hover:border-accent"
            >
              Résumé ↓
            </a>
          </nav>

          {/* mobile toggle */}
          <button
            ref={btnRef}
            onClick={() => setOpen((o) => !o)}
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-starlight"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-current transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </header>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[64] md:hidden backdrop-blur-xl bg-void/90 flex flex-col items-center justify-center gap-2"
          >
            {navSections.map((s, i) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === s.id ? 'true' : undefined}
                {...menuItem(i)}
                className={`flex items-baseline gap-3 text-2xl font-display ${
                  active === s.id ? 'text-accent' : 'text-starlight'
                }`}
              >
                <span className="mono text-xs text-dust">{s.index}</span>
                {s.label}
              </motion.a>
            ))}
            <motion.a
              href={contact.resume}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              {...menuItem(navSections.length)}
              className="mt-4 rounded-full border border-accent/40 px-5 py-2 text-accent"
            >
              Résumé ↓
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* side mission-map rail (desktop) */}
      <div className="fixed right-6 top-1/2 z-[60] hidden lg:flex -translate-y-1/2 flex-col items-end gap-3">
        {navSections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? 'true' : undefined}
            aria-label={s.label}
            className="group flex items-center gap-2.5"
          >
            <span
              className={`mono text-[10px] opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 ${
                active === s.id ? 'text-accent' : 'text-dust'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`h-1.5 rounded-full transition-all ${
                active === s.id ? 'w-6 bg-accent shadow-[0_0_10px_var(--color-accent)]' : 'w-1.5 bg-dust/40 group-hover:bg-dust'
              }`}
            />
          </a>
        ))}
      </div>
    </>
  )
}
