import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import Metric from './ui/Metric'
import { HudCorners, Chip } from './ui/atoms'
import { ExternalIcon } from './ui/icons'
import { internships } from '../data/resume'

export default function Internships() {
  return (
    <Section id="internships">
      <SectionHeading
        index="04"
        tag="INTERNSHIPS"
        title="Where it started"
        sub="Research and applied ML — from factory-floor signals to model benchmarking."
      />

      <div className="relative pl-8 md:pl-12">
        {/* glowing spine */}
        <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-accent via-agent to-transparent" />

        <div className="space-y-8">
          {internships.map((it, i) => (
            <Reveal key={it.company + i} delay={i * 0.05}>
              <div className="relative">
                {/* node marker */}
                <span className="absolute -left-[26px] md:-left-[38px] top-6 h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_16px_2px_var(--color-accent)]" />
                <span className="absolute -left-[26px] md:-left-[38px] top-6 h-3.5 w-3.5 rounded-full ring-4 ring-accent/20" />

                <div className="relative glass glass-hover rounded-2xl p-6 md:p-7">
                  <HudCorners color="accent" />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-semibold flex items-center gap-2">
                        {it.title}
                        {it.link && (
                          <a
                            href={it.link}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${it.company} — open certificate`}
                            className="text-dust hover:text-accent transition"
                          >
                            <ExternalIcon width={16} height={16} aria-hidden="true" />
                          </a>
                        )}
                      </h3>
                      <p className="mono text-xs md:text-sm text-dust mt-1.5">
                        {it.company} · {it.place}
                      </p>
                    </div>
                    <div className="flex items-center gap-5">
                      <Metric
                        value={it.metric.value}
                        prefix={it.metric.prefix || ''}
                        suffix={it.metric.suffix}
                        label={it.metric.label}
                        size="sm"
                        className="text-right"
                      />
                      <span className="mono text-[11px] md:text-xs text-accent border border-accent/30 rounded-full px-3 py-1 whitespace-nowrap">
                        {it.dates}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {it.highlights.map((h, j) => (
                      <li key={j} className="flex gap-3 text-sm md:text-[15px] text-dust leading-relaxed">
                        <span className="mono text-accent/70 shrink-0 mt-0.5">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
