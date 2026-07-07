import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import Metric from './ui/Metric'
import { HudCorners } from './ui/atoms'
import { ArrowIcon } from './ui/icons'
import { work, pipeline } from '../data/resume'

const KIND = {
  input: { ring: 'border-dust/40', dot: 'bg-dust', text: 'text-dust' },
  node: { ring: 'border-accent/50', dot: 'bg-accent', text: 'text-accent' },
  mcp: { ring: 'border-agent/50', dot: 'bg-agent', text: 'text-agent' },
  output: { ring: 'border-mint/50', dot: 'bg-mint', text: 'text-mint' },
}

const ACCENT = {
  accent: { text: 'text-accent', border: 'border-accent/40', hud: 'accent' },
  agent: { text: 'text-agent', border: 'border-agent/40', hud: 'agent' },
}
const GRID = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}

function RunMyAgent() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const timers = useRef([])

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clear, [])

  const run = () => {
    clear()
    if (reduce) {
      setStep(pipeline.length - 1)
      return
    }
    setRunning(true)
    setStep(0)
    pipeline.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setStep(i)
          if (i === pipeline.length - 1) setRunning(false)
        }, i * 720),
      )
    })
  }

  const done = step === pipeline.length - 1
  const logs = pipeline.slice(0, step + 1)

  return (
    <div className="relative glass rounded-2xl p-5 md:p-7 overflow-hidden">
      <HudCorners color="accent" />
      <div className="pointer-events-none absolute -left-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mono text-[11px] text-accent mb-4">▸ try it — live LangGraph demo</div>

      {/* prompt bar */}
      <div className="relative flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex-1 flex items-center gap-2 rounded-xl border border-accent/20 bg-void/60 px-4 py-3">
          <span className="mono text-accent text-sm">{'>'}</span>
          <span className="mono text-xs md:text-sm text-starlight/80 truncate">
            Plan a 3-day trip with trains, a hotel, and events.
          </span>
        </div>
        <button
          onClick={run}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-medium text-void transition hover:shadow-[0_0_28px_-6px_var(--color-accent)]"
        >
          {running ? 'Running…' : 'Run My Agent'}
          <ArrowIcon className="transition-transform group-hover:translate-x-0.5" width={16} height={16} />
        </button>
      </div>

      {/* pipeline — extra vertical padding so the scaled node + top packet dot
          + glow have room and aren't clipped by the horizontal scroll box */}
      <div className="relative mt-4 overflow-x-auto no-scrollbar px-1 pt-7 pb-4">
        <div className="flex items-stretch gap-2 min-w-[560px]">
          {pipeline.map((n, i) => {
            const k = KIND[n.kind]
            const active = i <= step
            const current = i === step
            return (
              <div key={n.id} className="flex items-center gap-2 flex-1">
                <motion.div
                  animate={{
                    scale: current && !reduce ? 1.06 : 1,
                    opacity: active ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`relative flex-1 rounded-xl border ${k.ring} bg-void/50 px-3 py-3 text-center ${
                    active ? '' : 'grayscale'
                  }`}
                  style={current ? { boxShadow: '0 0 26px -6px var(--color-accent)' } : undefined}
                >
                  {current && (
                    <motion.span
                      layoutId="agent-packet"
                      className="absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-mint"
                      style={{ boxShadow: '0 0 12px 2px var(--color-mint)' }}
                    />
                  )}
                  <span className={`mono text-[11px] md:text-xs ${active ? k.text : 'text-dust'}`}>{n.label}</span>
                </motion.div>
                {i < pipeline.length - 1 && (
                  <div className="relative h-px w-4 shrink-0 bg-white/10">
                    <motion.div
                      className="absolute inset-0 origin-left bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: i < step ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* console log */}
      <div className="mt-5 rounded-xl border border-white/5 bg-void/60 p-4 min-h-[120px]">
        <div className="mono text-[11px] text-dust mb-2">// execution_trace</div>
        <AnimatePresence mode="popLayout">
          {step < 0 ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mono text-xs text-dust"
            >
              press <span className="text-accent">Run My Agent</span> to watch the LangGraph pipeline execute…
            </motion.div>
          ) : (
            <div className="space-y-1.5">
              {logs.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mono text-[11px] md:text-xs"
                >
                  <span className="text-mint">✓</span>{' '}
                  <span className={KIND[n.kind].text}>{n.label}</span>{' '}
                  <span className="text-dust">— {n.note}</span>
                </motion.div>
              ))}
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/5"
                >
                  {['🚆 Trains booked', '🏨 Hotel reserved', '🎫 Events scheduled'].map((r) => (
                    <span
                      key={r}
                      className="mono text-[11px] px-2.5 py-1 rounded-full border border-mint/30 bg-mint/10 text-mint"
                    >
                      {r}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StageStrip({ stages }) {
  return (
    <div className="relative glass rounded-2xl p-5 md:p-7 overflow-hidden">
      <HudCorners color="agent" />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-agent/10 blur-3xl" />
      <div className="relative mono text-[11px] text-agent mb-5">// process_discovery_pipeline</div>
      <div className="relative flex flex-wrap items-center gap-2.5">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-2.5">
            <span className="mono text-xs md:text-sm px-3.5 py-2.5 rounded-lg border border-agent/30 bg-void/50 text-starlight/90">
              {s}
            </span>
            {i < stages.length - 1 && <span className="text-agent/60">→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectBlock({ project, accent, children }) {
  const a = ACCENT[accent]
  const cols = GRID[project.metrics.length] || 'grid-cols-2'
  return (
    <Reveal>
      <article className="relative">
        {/* project header */}
        <div className="flex items-center gap-4 mb-4">
          <span
            className={`mono text-sm font-bold grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${a.border} ${a.text}`}
          >
            {project.index}
          </span>
          <div>
            <h4 className="font-display text-xl md:text-2xl font-semibold leading-tight">{project.name}</h4>
            <span className={`mono text-[11px] uppercase tracking-widest ${a.text}`}>{project.tag}</span>
          </div>
        </div>

        <p className="text-dust text-sm md:text-base max-w-3xl mb-6">{project.summary}</p>

        {/* metrics — scoped to THIS project */}
        <div className={`grid ${cols} gap-3 mb-6`}>
          {project.metrics.map((m) => (
            <div key={m.label} className="glass rounded-xl p-4 md:p-5 text-center">
              <Metric value={m.value} prefix={m.prefix || ''} suffix={m.suffix} label={m.label} size="sm" />
            </div>
          ))}
        </div>

        {/* the interactive / visual centrepiece */}
        {children}

        {/* what it took */}
        <ul className="mt-6 space-y-3">
          {project.highlights.map((h, i) => (
            <li key={i} className="flex gap-3 text-sm md:text-[15px] text-dust leading-relaxed">
              <span className={`mono shrink-0 mt-0.5 ${a.text}`}>›</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  )
}

export default function Work() {
  const [middleware, manim] = work.projects
  return (
    <Section id="work">
      <SectionHeading
        index="03"
        tag="WORK"
        title="Mission log — Hitachi"
        sub="One role — two systems I shipped end-to-end."
      />

      {/* the role itself — establishes this is a job, not a single project */}
      <Reveal>
        <div className="relative glass rounded-2xl p-6 md:p-7">
          <HudCorners color="accent" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mono text-[11px] text-accent uppercase tracking-widest mb-2">// current_role</div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold">{work.title}</h3>
              <p className="mono text-xs md:text-sm text-dust mt-2">
                {work.company} · {work.sub} · {work.place}
              </p>
            </div>
            <span className="mono text-xs md:text-sm text-accent border border-accent/30 rounded-full px-3 py-1 whitespace-nowrap">
              {work.dates}
            </span>
          </div>
        </div>
      </Reveal>

      {/* projects divider */}
      <Reveal delay={0.05}>
        <div className="flex items-center gap-3 mt-10 mb-8">
          <span className="mono text-[11px] text-dust uppercase tracking-widest">
            Projects delivered
          </span>
          <div className="h-px flex-1 bg-white/10" />
          <span className="mono text-[11px] text-dust">{work.projects.length} systems</span>
        </div>
      </Reveal>

      {/* the two projects, each fully self-contained */}
      <div className="space-y-16">
        <ProjectBlock project={middleware} accent="accent">
          <RunMyAgent />
        </ProjectBlock>
        <ProjectBlock project={manim} accent="agent">
          <StageStrip stages={manim.stages} />
        </ProjectBlock>
      </div>
    </Section>
  )
}
