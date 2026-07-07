import { motion, useReducedMotion } from 'framer-motion'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { HudCorners } from './ui/atoms'
import { skillGroups } from '../data/resume'

const DOT = {
  accent: 'bg-accent',
  agent: 'bg-agent',
  mint: 'bg-mint',
  live: 'bg-live',
  gold: 'bg-gold',
  dust: 'bg-dust',
}
const LABEL = {
  accent: 'text-accent',
  agent: 'text-agent',
  mint: 'text-mint',
  live: 'text-live',
  gold: 'text-gold',
  dust: 'text-dust',
}
const CHIP = {
  accent: 'border-accent/25 hover:border-accent/70 hover:bg-accent/10',
  agent: 'border-agent/25 hover:border-agent/70 hover:bg-agent/10',
  mint: 'border-mint/25 hover:border-mint/70 hover:bg-mint/10',
  live: 'border-live/25 hover:border-live/70 hover:bg-live/10',
  gold: 'border-gold/25 hover:border-gold/70 hover:bg-gold/10',
  dust: 'border-dust/25 hover:border-dust/60 hover:bg-white/5',
}

function Cluster({ group, featured }) {
  const reduce = useReducedMotion()
  return (
    <Reveal className={featured ? 'md:col-span-2' : ''}>
      <div
        className={`group relative h-full glass glass-hover rounded-2xl p-6 md:p-7 ${
          featured ? 'overflow-hidden' : ''
        }`}
      >
        <HudCorners color={group.accent} />

        {featured && (
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-agent/20 blur-3xl" />
        )}

        <div className="flex items-center gap-2.5 mb-5">
          <span className={`h-2 w-2 rounded-full ${DOT[group.accent]}`} />
          <h3 className={`font-display text-lg md:text-xl ${LABEL[group.accent]}`}>{group.label}</h3>
          <span className="mono text-[11px] text-dust ml-auto">{group.items.length}</span>
        </div>

        <motion.ul
          className="flex flex-wrap gap-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.03 } } }}
        >
          {group.items.map((item) => (
            <motion.li
              key={item}
              variants={{
                hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              className={`mono text-[12px] md:text-[13px] px-2.5 py-1.5 rounded-lg border bg-white/[0.02] text-starlight/90 transition ${CHIP[group.accent]}`}
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Reveal>
  )
}

export default function Skills() {
  const featured = skillGroups.find((g) => g.featured)
  const rest = skillGroups.filter((g) => !g.featured)
  return (
    <Section id="skills">
      <SectionHeading
        index="02"
        tag="SKILLS"
        title="Stack & capabilities"
        sub="The toolset behind the systems — from agent orchestration to full-stack delivery."
      />
      <div className="grid gap-4 md:gap-5 md:grid-cols-3">
        {featured && <Cluster group={featured} featured />}
        {rest.map((g) => (
          <Cluster key={g.key} group={g} />
        ))}
      </div>
    </Section>
  )
}
