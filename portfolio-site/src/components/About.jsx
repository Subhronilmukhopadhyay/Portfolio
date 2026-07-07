import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { Panel, HudCorners, Chip } from './ui/atoms'
import { profile } from '../data/resume'

export default function About() {
  const { education: edu } = profile
  return (
    <Section id="about">
      <SectionHeading index="01" tag="ABOUT" title="Operator profile" />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
        <Reveal>
          <p className="text-xl md:text-2xl font-display leading-snug text-starlight">
            &ldquo;I design agents that <span className="grad-text">reason, route, and act</span> — then make the
            pipeline visible enough to trust.&rdquo;
          </p>
          <p className="mt-6 text-dust text-base md:text-lg leading-relaxed">{profile.bio}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Chip accent="agent">Agentic Systems</Chip>
            <Chip accent="accent">LangGraph · MCP</Chip>
            <Chip accent="mint">Deep Learning</Chip>
            <Chip accent="live">Full-stack</Chip>
            <Chip accent="gold">Research</Chip>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Panel className="p-6 md:p-7" hover>
            <HudCorners color="accent" />
            <div className="mono text-[11px] tracking-widest text-accent/80 mb-5">// SYSTEM_IDENTITY</div>

            <dl className="space-y-4">
              <Row k="degree" v={edu.degree} />
              <Row k="institute" v={`${edu.school} · ${edu.place}`} />
              <Row k="status" v={edu.detail} />
              <Row k="timeline" v={edu.dates} />
              <div className="rule my-4" />
              <div className="flex items-baseline justify-between gap-4">
                <dt className="mono text-[11px] uppercase tracking-widest text-dust shrink-0">CGPA</dt>
                <dd className="text-right text-xs text-accent tabular">{edu.cgpa}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="mono text-[11px] uppercase tracking-widest text-dust shrink-0">based in</dt>
                <dd className="text-right text-xs text-starlight/90">{profile.home}</dd>
              </div>
            </dl>
          </Panel>
        </Reveal>
      </div>
    </Section>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="mono text-[11px] uppercase tracking-widest text-dust shrink-0">{k}</dt>
      <dd className="text-right text-sm md:text-base text-starlight">{v}</dd>
    </div>
  )
}
