import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { HudCorners } from './ui/atoms'
import { ExternalIcon } from './ui/icons'
import { certifications } from '../data/resume'

export default function Certifications() {
  return (
    <Section id="certs">
      <SectionHeading index="06" tag="CERTS" title="Credentials" />
      <div className="grid gap-5 md:grid-cols-3">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.06}>
            <a
              href={c.link}
              target="_blank"
              rel="noreferrer"
              className="group relative block h-full glass glass-hover rounded-2xl p-6 overflow-hidden"
            >
              <HudCorners color="gold" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* gem badge */}
              <div className="mb-5 flex items-center justify-between">
                <svg width="34" height="34" viewBox="0 0 24 24" className="text-gold">
                  <path
                    d="M6 3h12l3 5-9 13L3 8z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                  <path d="M3 8h18M9 3 6 8l6 13M15 3l3 5-6 13" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                </svg>
                <ExternalIcon width={16} height={16} className="text-dust group-hover:text-gold transition" />
              </div>

              <h3 className="font-display text-lg md:text-xl font-semibold group-hover:text-gold transition">
                {c.name}
              </h3>
              <p className="mono text-xs text-dust mt-2">
                {c.issuer} · {c.date}
              </p>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
