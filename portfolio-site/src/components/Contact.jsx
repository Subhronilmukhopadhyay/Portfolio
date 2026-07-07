import { useState } from 'react'
import Section from './ui/Section'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { HudCorners } from './ui/atoms'
import { MailIcon, PhoneIcon, LinkedinIcon, GithubIcon, LeetcodeIcon, MapPinIcon, ArrowIcon } from './ui/icons'
import { contact, profile } from '../data/resume'

function CopyPill({ icon: Icon, label, value }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <button
      onClick={copy}
      className="group relative flex items-center gap-3 rounded-xl glass glass-hover px-4 py-3.5 text-left w-full"
    >
      <span className="text-accent">
        <Icon width={18} height={18} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block mono text-[10px] uppercase tracking-widest text-dust">{label}</span>
        <span className="block text-sm text-starlight truncate">{value}</span>
      </span>
      <span
        role="status"
        aria-live="polite"
        className={`mono text-[10px] text-mint transition ${
          copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
        }`}
      >
        {copied ? '[ copied ]' : '[ copy ]'}
      </span>
    </button>
  )
}

function LinkPill({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl glass glass-hover px-4 py-3.5"
    >
      <span className="text-accent">
        <Icon width={18} height={18} />
      </span>
      <span className="flex-1">
        <span className="block mono text-[10px] uppercase tracking-widest text-dust">{label}</span>
        <span className="block text-sm text-starlight">Open ↗</span>
      </span>
      <ArrowIcon
        width={16}
        height={16}
        className="text-dust group-hover:text-accent group-hover:translate-x-0.5 transition"
      />
    </a>
  )
}

export default function Contact() {
  return (
    <Section id="contact" className="pb-16">
      <SectionHeading index="07" tag="CONTACT" title="Let's build something that thinks." />

      <Reveal>
        <div className="relative glass rounded-3xl p-6 md:p-10 overflow-hidden">
          <HudCorners color="accent" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-agent/15 blur-3xl" />

          <div className="relative flex items-center gap-2.5 mono text-xs text-dust mb-8">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-mint" />
            <span className="text-mint">AVAILABLE</span>
            <span className="text-dust/50">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPinIcon width={13} height={13} /> {profile.location}
            </span>
          </div>

          <div className="relative grid gap-3 sm:grid-cols-2">
            <CopyPill icon={MailIcon} label="email" value={contact.email} />
            <CopyPill icon={PhoneIcon} label="phone" value={contact.phone} />
            <LinkPill icon={LinkedinIcon} label="linkedin" href={contact.linkedin} />
            <LinkPill icon={GithubIcon} label="github" href={contact.github} />
            <LinkPill icon={LeetcodeIcon} label="leetcode" href={contact.leetcode} />
            <a
              href={`mailto:${contact.email}`}
              className="group flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 font-medium text-void transition hover:shadow-[0_0_30px_-6px_var(--color-accent)]"
            >
              Say hello
              <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </Reveal>

      <footer className="mt-16 flex flex-col md:flex-row items-center justify-between gap-3 text-center">
        <p className="mono text-xs text-dust">
          © 2026 {profile.name} · <span className="text-accent">Agentic AI / ML</span>
        </p>
        <p className="mono text-[11px] text-dust">
          built with React · Three.js · framer-motion — end-to-end, like the agents.
        </p>
      </footer>
    </Section>
  )
}
