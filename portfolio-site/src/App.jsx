import { Suspense, lazy, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Work from './components/Work'
import Internships from './components/Internships'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import SceneBoundary from './components/SceneBoundary'

const CanvasScene = lazy(() => import('./three/CanvasScene'))
const Tour = lazy(() => import('./tour/Tour'))

const VIEW_KEY = 'nexus-view'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * 3D house tour by default; the classic scrolling page for deep links
 * (#work), reduced-motion visitors, no WebGL, or anyone who picked it.
 */
function initialView() {
  const q = new URLSearchParams(window.location.search).get('view')
  if (q === 'classic' || q === 'tour') return q
  if (window.location.hash.length > 1) return 'classic'
  try {
    const saved = localStorage.getItem(VIEW_KEY)
    if (saved === 'classic' || saved === 'tour') return saved
  } catch {
    // storage blocked — fall through to the defaults
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'classic'
  return hasWebGL() ? 'tour' : 'classic'
}

export default function App() {
  const [view, setView] = useState(initialView)
  const pick = (v) => {
    setView(v)
    window.scrollTo(0, 0)
    try {
      localStorage.setItem(VIEW_KEY, v)
    } catch {
      // ignore
    }
  }

  if (view === 'tour') {
    return (
      <div className="noise">
        <Suspense fallback={<div className="fixed inset-0 bg-void" />}>
          <Tour onClassic={() => pick('classic')} />
        </Suspense>
      </div>
    )
  }
  return <ClassicSite onTour={() => pick('tour')} />
}

function ClassicSite({ onTour }) {
  const reduce = useReducedMotion()

  return (
    <div className="relative noise min-h-svh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-void"
      >
        Skip to content
      </a>

      {/* fixed cosmic backdrop */}
      <div className="fixed inset-0 z-0">
        {/* CSS nebula fallback — always painted, sits behind the canvas */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(1000px 800px at 78% 18%, rgba(139,108,255,0.16), transparent 55%),' +
              'radial-gradient(900px 700px at 15% 85%, rgba(61,232,255,0.12), transparent 55%),' +
              'radial-gradient(700px 600px at 60% 60%, rgba(255,95,162,0.06), transparent 60%),' +
              '#05060e',
          }}
        />
        <div className="absolute inset-0 hud-grid opacity-40" />
        <SceneBoundary>
          <Suspense fallback={null}>
            <CanvasScene animate={!reduce} />
          </Suspense>
        </SceneBoundary>
        {/* light scrim keeps body copy readable over the ambient graph */}
        <div className="absolute inset-0 bg-void/20" />
        {/* bottom fade so text near the fold reads cleanly */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />
      </div>

      {/* content */}
      <div className="relative z-10">
        <Nav onTour={onTour} />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <Hero />
          <About />
          <Skills />
          <Work />
          <Internships />
          <Projects />
          <Certifications />
          <Contact />
        </main>
      </div>
    </div>
  )
}
