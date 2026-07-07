import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/resume'
import { ArrowIcon } from './ui/icons'

const ease = [0.16, 1, 0.3, 1]

export default function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  })

  return (
    <section
      id="hero"
      className="relative min-h-svh flex items-center px-6 md:px-12 lg:px-20 pt-28 pb-24"
    >
      {/* legibility veil behind text */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 700px at 22% 50%, rgba(5,6,14,0.82), rgba(5,6,14,0.35) 45%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-6xl mx-auto">
        <motion.div {...rise(0.05)} className="flex items-center gap-2.5 mono text-xs md:text-sm text-dust mb-7">
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-live" />
          <span className="text-live">LIVE</span>
          <span className="text-dust/50">·</span>
          <span>{profile.location}</span>
          <span className="text-dust/50">·</span>
          <span>{profile.since}</span>
        </motion.div>

        <motion.p {...rise(0.15)} className="mono text-sm md:text-base text-accent mb-3 tracking-wide">
          {'>'} hi, I&apos;m
        </motion.p>

        <motion.h1
          {...rise(0.22)}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
        >
          {profile.firstName}
          <br />
          <span className="text-starlight/90">{profile.lastName}</span>
        </motion.h1>

        <motion.div {...rise(0.35)} className="mt-8 md:mt-10">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-2xl sm:text-3xl md:text-5xl font-display font-semibold glow-cyan">
              {profile.role}
            </span>
            <span className="text-xl sm:text-2xl md:text-4xl font-display text-dust">
              @ {profile.company}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl md:text-6xl font-display font-bold grad-text">
              {profile.discipline}
            </span>
            <span className="caret text-3xl sm:text-4xl md:text-6xl font-display text-accent">_</span>
          </div>
        </motion.div>

        <motion.p {...rise(0.5)} className="mt-7 max-w-xl text-base md:text-lg text-dust">
          {profile.tagline}
        </motion.p>

        <motion.div {...rise(0.6)} className="mt-4 flex flex-wrap gap-x-3 gap-y-2 mono text-xs md:text-sm text-dust/90">
          <span>graduated CS @ VIT</span>
          <span className="text-accent/50">·</span>
          <span>CGPA 8.88</span>
          <span className="text-accent/50">·</span>
          <span>GATE-qualified</span>
          <span className="text-accent/50">·</span>
          <span>LangGraph + MCP</span>
        </motion.div>

        <motion.div {...rise(0.72)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-void transition hover:shadow-[0_0_30px_-4px_var(--color-accent)]"
          >
            View Work
            <ArrowIcon className="transition-transform group-hover:translate-x-1" width={18} height={18} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-3 font-medium text-starlight transition hover:border-accent hover:bg-accent/10"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 mono text-[11px] tracking-widest text-dust flex flex-col items-center gap-2"
      >
        <span>SCROLL</span>
        <span className="h-8 w-px bg-gradient-to-b from-accent to-transparent" />
      </motion.a>
    </section>
  )
}
