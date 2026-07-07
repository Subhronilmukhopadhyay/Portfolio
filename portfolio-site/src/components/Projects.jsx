import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import Metric from './ui/Metric'
import { HudCorners, Chip } from './ui/atoms'
import { ExternalIcon, GithubIcon } from './ui/icons'
import { projects } from '../data/resume'

function TiltCard({ p, index }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 150, damping: 18 })

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  const spotlightX = useTransform(mx, (v) => `${v * 100}%`)
  const spotlightY = useTransform(my, (v) => `${v * 100}%`)

  return (
    <Reveal delay={index * 0.05}>
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="group relative h-full glass glass-hover rounded-2xl p-6 md:p-7 overflow-hidden"
      >
        <HudCorners color="accent" />
        {/* cursor spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([x, y]) => `radial-gradient(340px circle at ${x} ${y}, rgba(61,232,255,0.10), transparent 60%)`,
            ),
          }}
        />

        <div className="relative flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <Chip key={t} accent="agent">
                {t}
              </Chip>
            ))}
          </div>
          <span className="mono text-[11px] text-dust whitespace-nowrap">{p.date}</span>
        </div>

        <h3 className="relative font-display text-2xl md:text-3xl font-semibold group-hover:glow-cyan transition">
          {p.name}
        </h3>

        <div className="relative mt-4 flex items-end gap-4">
          <Metric value={p.metric.value} suffix={p.metric.suffix} label={p.metric.label} size="md" />
        </div>

        <p className="relative mt-4 text-sm text-dust leading-relaxed">{p.blurb}</p>

        <div className="relative mt-5 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s} className="mono text-[11px] text-starlight/70 px-2 py-0.5 rounded border border-white/10">
              {s}
            </span>
          ))}
        </div>

        <div className="relative mt-6 flex gap-4">
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mono text-xs text-accent hover:text-mint transition"
            >
              <ExternalIcon width={15} height={15} /> Live
            </a>
          )}
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mono text-xs text-dust hover:text-starlight transition"
            >
              <GithubIcon width={15} height={15} /> Source
            </a>
          )}
        </div>
      </motion.article>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        index="05"
        tag="PROJECTS"
        title="Selected builds"
        sub="Research prototypes and production platforms — the range, end to end."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <TiltCard key={p.name} p={p} index={i} />
        ))}
      </div>
    </Section>
  )
}
