import { profile, contact, work, internships, projects, certifications, skillGroups } from '../data/resume'
import Metric from '../components/ui/Metric'
import { Chip } from '../components/ui/atoms'
import { ExternalIcon, GithubIcon, LinkedinIcon, LeetcodeIcon, MailIcon, ArrowIcon } from '../components/ui/icons'

const linkCls =
  'inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-sm text-accent transition hover:bg-accent/10 hover:border-accent'

function Kicker({ children }) {
  return <div className="mono text-[11px] uppercase tracking-widest text-dust mb-1.5">{children}</div>
}

function Bullets({ items }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((h, i) => (
        <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-starlight/85">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
          <span>{h}</span>
        </li>
      ))}
    </ul>
  )
}

function Metrics({ items }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5">
      {items.map((m) => (
        <Metric key={m.label} size="sm" {...m} />
      ))}
    </div>
  )
}

const CONTACT = {
  email: { label: 'Email', value: contact.email, href: `mailto:${contact.email}`, Icon: MailIcon, cta: 'Write to me' },
  linkedin: { label: 'LinkedIn', value: 'in/subhronil-mukhopadhyay', href: contact.linkedin, Icon: LinkedinIcon, cta: 'Connect' },
  github: { label: 'GitHub', value: 'Subhronilmukhopadhyay', href: contact.github, Icon: GithubIcon, cta: 'See the code' },
  leetcode: { label: 'LeetCode', value: 'u/subhronilmukhopadhyay', href: contact.leetcode, Icon: LeetcodeIcon, cta: 'Profile' },
  resume: { label: 'Résumé', value: 'PDF · one page', href: contact.resume, Icon: ArrowIcon, cta: 'Open résumé' },
}

/** Renders the résumé record a hotspot points at. */
export default function Detail({ refObj }) {
  const { kind, i } = refObj

  if (kind === 'bio') {
    return (
      <>
        <Kicker>
          {profile.location} · from {profile.home}
        </Kicker>
        <h3 className="text-2xl font-semibold">{profile.name}</h3>
        <p className="mt-1 text-accent">
          {profile.role} @ {profile.companyFull}
        </p>
        <p className="mt-4 text-[14.5px] leading-relaxed text-starlight/85">{profile.bio}</p>
      </>
    )
  }

  if (kind === 'edu') {
    const e = profile.education
    return (
      <>
        <Kicker>{e.dates}</Kicker>
        <h3 className="text-2xl font-semibold">{e.school}</h3>
        <p className="mt-1 text-dust">
          {e.degree} · {e.detail} · {e.place}
        </p>
        <div className="mt-5 flex gap-8">
          <Metric size="sm" value={8.88} suffix=" / 10" label="CGPA" />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip accent="gold">GATE qualified · 2026</Chip>
          <Chip accent="agent">AI / ML focus</Chip>
        </div>
      </>
    )
  }

  if (kind === 'now') {
    return (
      <>
        <Kicker>{work.dates}</Kicker>
        <h3 className="text-2xl font-semibold">{work.title}</h3>
        <p className="mt-1 text-accent">{work.company}</p>
        <p className="mt-1 text-sm text-dust">{work.sub}</p>
        <p className="mt-4 text-[14.5px] leading-relaxed text-starlight/85">{profile.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {work.projects.map((p) => (
            <Chip key={p.key} accent="agent">
              {p.name}
            </Chip>
          ))}
        </div>
      </>
    )
  }

  if (kind === 'work') {
    const p = work.projects[i]
    return (
      <>
        <Kicker>
          {p.index} · {p.tag}
        </Kicker>
        <h3 className="text-2xl font-semibold">{p.name}</h3>
        <p className="mt-3 text-[14.5px] leading-relaxed text-starlight/85">{p.summary}</p>
        <Metrics items={p.metrics} />
        {p.stages && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            {p.stages.map((s, k) => (
              <span key={s} className="flex items-center gap-1.5">
                <Chip accent="mint">{s}</Chip>
                {k < p.stages.length - 1 && <span className="text-dust">→</span>}
              </span>
            ))}
          </div>
        )}
        <Bullets items={p.highlights} />
      </>
    )
  }

  if (kind === 'intern') {
    const x = internships[i]
    return (
      <>
        <Kicker>
          {x.dates} · {x.place}
        </Kicker>
        <h3 className="text-2xl font-semibold">{x.company}</h3>
        <p className="mt-1 text-mint">{x.title}</p>
        <div className="mt-5">
          <Metric size="sm" {...x.metric} />
        </div>
        <Bullets items={x.highlights} />
        {x.link && (
          <a href={x.link} target="_blank" rel="noreferrer" className={`${linkCls} mt-5`}>
            Certificate <ExternalIcon width={15} height={15} />
          </a>
        )}
      </>
    )
  }

  if (kind === 'project') {
    const p = projects[i]
    return (
      <>
        <Kicker>
          {p.date} · {p.tags.join(' · ')}
        </Kicker>
        <h3 className="text-2xl font-semibold">{p.name}</h3>
        <div className="mt-5">
          <Metric size="sm" {...p.metric} />
        </div>
        <p className="mt-4 text-[14.5px] leading-relaxed text-starlight/85">{p.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Chip key={s} accent="live">
              {s}
            </Chip>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className={linkCls}>
              <GithubIcon width={15} height={15} /> Code
            </a>
          )}
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" className={linkCls}>
              Live <ExternalIcon width={15} height={15} />
            </a>
          )}
        </div>
      </>
    )
  }

  if (kind === 'skill') {
    const g = skillGroups[i]
    return (
      <>
        <Kicker>
          shelf {i + 1} · {g.items.length} titles
        </Kicker>
        <h3 className="text-2xl font-semibold">{g.label}</h3>
        <div className="mt-5 flex flex-wrap gap-2">
          {g.items.map((s) => (
            <Chip key={s} accent={g.accent}>
              {s}
            </Chip>
          ))}
        </div>
      </>
    )
  }

  if (kind === 'cert') {
    const c = certifications[i]
    return (
      <>
        <Kicker>
          {c.issuer} · {c.date}
        </Kicker>
        <h3 className="text-2xl font-semibold">{c.name}</h3>
        <a href={c.link} target="_blank" rel="noreferrer" className={`${linkCls} mt-5`}>
          View credential <ExternalIcon width={15} height={15} />
        </a>
      </>
    )
  }

  if (kind === 'contact') {
    const c = CONTACT[refObj.key]
    const external = !c.href.startsWith('mailto:')
    return (
      <>
        <Kicker>channel open</Kicker>
        <h3 className="flex items-center gap-2.5 text-2xl font-semibold">
          <c.Icon width={22} height={22} /> {c.label}
        </h3>
        <p className="mono mt-2 break-all text-sm text-dust">{c.value}</p>
        <a href={c.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className={`${linkCls} mt-5`}>
          {c.cta} {external && <ExternalIcon width={15} height={15} />}
        </a>
      </>
    )
  }

  return null
}
