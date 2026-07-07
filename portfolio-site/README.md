# NEXUS — Subhronil Mukhopadhyay · Portfolio

A futuristic, 3D portfolio for **Subhronil Mukhopadhyay** — Sr. Technical Engineer @ Hitachi (Agentic AI / ML).

The site presents an **agentic neural cosmos**: a living WebGL agent-graph with a faceted glass "Agent Core" that dissolves as you scroll, HUD/telemetry accents, and a signature **"Run My Agent"** animation that watches the real LangGraph → MCP pipeline execute node-by-node.

## Stack

- **React 19** + **Vite 8**
- **Three.js** via **@react-three/fiber** + **@react-three/drei** (WebGL scene)
- **@react-three/postprocessing** (bloom)
- **framer-motion** (scroll reveals, count-ups, interactions)
- **Tailwind CSS v4** (design tokens in `src/index.css`)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & preview

```bash
npm run build    # outputs to dist/
npm run preview
```

## Deploy

The build is fully static — deploy `dist/` to any static host:

- **Vercel / Netlify**: framework = Vite, build = `npm run build`, output = `dist`
- **GitHub Pages**: push `dist/` (set Vite `base` if serving from a sub-path)
- **Render / Cloudflare Pages**: static site, publish directory `dist`

## Structure

```
src/
  data/resume.js        # single source of truth for all content
  three/                # WebGL scene
    CanvasScene.jsx     #   canvas, camera rig, bloom, scroll-driven core fade
    NeuralGraph.jsx     #   ambient agent graph (nodes, edges, signal packets)
    AgentCore.jsx       #   faceted glass core + orbiting satellites
    util.js             #   graph builder, dot texture, palette
  components/
    Nav.jsx  Hero.jsx  About.jsx  Skills.jsx
    Work.jsx            # "Run My Agent" LangGraph pipeline animation
    Internships.jsx  Projects.jsx  Certifications.jsx  Contact.jsx
    ui/                 # Reveal, SectionHeading, Metric, atoms, icons, Section
  index.css             # Tailwind v4 tokens + utilities (glass, glow, HUD, motion)
```

## Editing content

All copy, metrics, links, projects, and skills live in [`src/data/resume.js`](src/data/resume.js). Change values there — every section reads from it.

## Accessibility & performance

- Honors `prefers-reduced-motion` (freezes the 3D scene, disables count-ups/parallax).
- 3D is code-split (lazy `CanvasScene`) and falls back gracefully if WebGL is unavailable.
- Node counts, DPR, and bloom scale down on small viewports.
