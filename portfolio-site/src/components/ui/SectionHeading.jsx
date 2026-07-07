import Reveal from './Reveal'

/** "// 02_SKILLS" mono index + display title + optional kicker line. */
export default function SectionHeading({ index, tag, title, sub }) {
  return (
    <div className="mb-10 md:mb-14">
      <Reveal>
        <div className="mono text-xs md:text-sm text-accent/80 tracking-widest mb-3">
          <span className="text-dust">//</span> {index}_{tag}
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-dust text-base md:text-lg">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}
