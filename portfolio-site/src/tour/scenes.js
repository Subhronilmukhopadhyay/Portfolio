// ============================================================
// NEXUS HOUSE — layout + the scene-by-scene tour script
// ============================================================
// The house is a two-storey cutaway "dollhouse": three rooms per floor,
// open at the front (+z) so the camera can fly straight into each one,
// with a rooftop deck on top. Every room maps to one résumé section.

export const ROOM_W = 6 // room width  (x)
export const ROOM_D = 6 // room depth  (z) — back wall at -3, open front at +3
export const STOREY = 4.2 // floor-to-floor height
export const CEIL = 4.0 // floor-to-ceiling height
export const HALF_W = (ROOM_W * 3) / 2 // 9 — outer walls at ±9

export const ACCENT = {
  accent: '#3de8ff',
  agent: '#8b6cff',
  live: '#ff5fa2',
  mint: '#7cffc4',
  gold: '#e8c275',
}

/**
 * Rooms. `origin` is the room's floor centre in world space.
 * Hotspot positions are room-local (floor = y 0, back wall = z -3).
 * `ref` points at the résumé record the info panel renders.
 */
export const rooms = [
  {
    id: 'about',
    index: '01',
    label: 'About',
    name: 'The Study',
    sub: 'Who I am, where I studied, what I’m doing now.',
    accent: 'accent',
    origin: [-6, 0, 0],
    hotspots: [
      { id: 'bio', label: 'Portrait', ref: { kind: 'bio' }, pos: [1.35, 2.25, -2.75] },
      { id: 'edu', label: 'B.Tech degree · VIT', ref: { kind: 'edu' }, pos: [-1.95, 2.0, -2.75] },
      { id: 'now', label: 'Right now', ref: { kind: 'now' }, pos: [-0.85, 1.35, -1.75] },
    ],
  },
  {
    id: 'work',
    index: '02',
    label: 'Work',
    name: 'The Agent Lab',
    sub: 'Six projects delivered as Sr. Technical Engineer at Hitachi.',
    accent: 'agent',
    origin: [0, 0, 0],
    hotspots: [
      { id: 'w0', label: 'Agentic Travel Middleware', ref: { kind: 'work', i: 0 }, pos: [0, 1.9, 0.55] },
      { id: 'w1', label: 'Visual Inspection', ref: { kind: 'work', i: 1 }, pos: [2.05, 1.35, 1.35] },
      { id: 'w2', label: 'Multi-agent Debate', ref: { kind: 'work', i: 2 }, pos: [-2.1, 1.55, 1.25] },
      { id: 'w3', label: 'LLM Serving Safety', ref: { kind: 'work', i: 3 }, pos: [2.15, 2.35, -2.3] },
      { id: 'w4', label: 'Robot Safety Filter', ref: { kind: 'work', i: 4 }, pos: [-2.0, 1.85, -1.9] },
      { id: 'w5', label: 'GPU → Trainium', ref: { kind: 'work', i: 5 }, pos: [0, 2.85, -2.75] },
    ],
  },
  {
    id: 'internships',
    index: '03',
    label: 'Internships',
    name: 'The R&D Bay',
    sub: 'Where it started — Hitachi R&D and BeyonData.',
    accent: 'mint',
    origin: [6, 0, 0],
    hotspots: [
      { id: 'i0', label: 'Hitachi R&D', ref: { kind: 'intern', i: 0 }, pos: [-1.0, 1.6, -1.95] },
      { id: 'i1', label: 'BeyonData ML', ref: { kind: 'intern', i: 1 }, pos: [1.3, 1.45, 0.75] },
    ],
  },
  {
    id: 'projects',
    index: '04',
    label: 'Projects',
    name: 'The Workshop',
    sub: 'Things I built on my own time.',
    accent: 'live',
    origin: [6, STOREY, 0],
    hotspots: [
      { id: 'p0', label: 'Almanac', ref: { kind: 'project', i: 0 }, pos: [-1.5, 2.35, -2.75] },
      { id: 'p1', label: 'TimeCapsule', ref: { kind: 'project', i: 1 }, pos: [0.35, 1.45, -2.15] },
      { id: 'p2', label: 'Crowd Simulation', ref: { kind: 'project', i: 2 }, pos: [-1.55, 1.15, 1.05] },
      { id: 'p3', label: 'Voting System', ref: { kind: 'project', i: 3 }, pos: [1.65, 1.5, -2.15] },
      { id: 'p4', label: 'Injury Prediction', ref: { kind: 'project', i: 4 }, pos: [2.2, 2.75, 0.6] },
    ],
  },
  {
    id: 'skills',
    index: '05',
    label: 'Skills',
    name: 'The Library',
    sub: 'Every shelf is a toolbox.',
    accent: 'accent',
    origin: [0, STOREY, 0],
    hotspots: [
      { id: 's0', label: 'Languages', ref: { kind: 'skill', i: 0 }, pos: [-1.9, 2.75, -2.45] },
      { id: 's1', label: 'AI / ML', ref: { kind: 'skill', i: 1 }, pos: [0, 2.75, -2.45] },
      { id: 's2', label: 'Systems & Cloud', ref: { kind: 'skill', i: 2 }, pos: [1.9, 2.75, -2.45] },
      { id: 's3', label: 'Frameworks & Web', ref: { kind: 'skill', i: 3 }, pos: [-1.9, 1.2, -2.45] },
      { id: 's4', label: 'Developer Tools', ref: { kind: 'skill', i: 4 }, pos: [0, 1.2, -2.45] },
      { id: 's5', label: 'Soft Skills', ref: { kind: 'skill', i: 5 }, pos: [1.9, 1.2, -2.45] },
    ],
  },
  {
    id: 'certs',
    index: '06',
    label: 'Certs',
    name: 'The Trophy Hall',
    sub: 'Credentials, on pedestals.',
    accent: 'gold',
    origin: [-6, STOREY, 0],
    hotspots: [
      { id: 'c0', label: 'GATE Qualified', ref: { kind: 'cert', i: 0 }, pos: [-1.8, 1.95, -0.6] },
      { id: 'c1', label: 'Amazon ML Summer School', ref: { kind: 'cert', i: 1 }, pos: [0, 1.95, -1.3] },
      { id: 'c2', label: 'Azure AI-900', ref: { kind: 'cert', i: 2 }, pos: [1.8, 1.95, -0.6] },
    ],
  },
  {
    id: 'contact',
    index: '07',
    label: 'Contact',
    name: 'The Signal Deck',
    sub: 'Up on the roof — send a signal.',
    accent: 'agent',
    origin: [0, STOREY * 2, 0],
    roof: true,
    hotspots: [
      { id: 'email', label: 'Email', ref: { kind: 'contact', key: 'email' }, pos: [-3.6, 1.55, 1.2] },
      { id: 'linkedin', label: 'LinkedIn', ref: { kind: 'contact', key: 'linkedin' }, pos: [-1.8, 1.55, 2.1] },
      { id: 'github', label: 'GitHub', ref: { kind: 'contact', key: 'github' }, pos: [0, 1.55, 2.4] },
      { id: 'leetcode', label: 'LeetCode', ref: { kind: 'contact', key: 'leetcode' }, pos: [1.8, 1.55, 2.1] },
      { id: 'resume', label: 'Résumé', ref: { kind: 'contact', key: 'resume' }, pos: [3.6, 1.55, 1.2] },
    ],
  },
]

export const roomById = Object.fromEntries(rooms.map((r) => [r.id, r]))

/** The ordered tour. `entrance` and `house` are camera-only stops. */
export const scenes = [
  { id: 'entrance', label: 'Entrance', index: '00' },
  { id: 'house', label: 'The House', index: '··' },
  ...rooms.map((r) => ({ id: r.id, label: r.label, index: r.index, room: r })),
]

export const sceneIndex = (id) => scenes.findIndex((s) => s.id === id)

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

/**
 * Camera framing for a stop: [position, target].
 * `portrait` pulls the camera back so a whole room fits a phone screen.
 */
export function viewFor(sceneId, { portrait = false } = {}) {
  const back = portrait ? 2.3 : 1
  // on wide screens the house sits right of centre, clear of the copy on the left
  if (sceneId === 'entrance') return portrait ? [[0, 3, 46], [0, 0.6, 0]] : [[-9, 3, 33], [-7, 3.8, 0]]
  if (sceneId === 'door') return [[0, 2.0, 9.5], [0, 2.0, 0]]
  if (sceneId === 'house') return portrait ? [[6, 9, 52], [0, 4.6, 0]] : [[3, 9, 29], [-3, 4.4, 0]]
  const room = roomById[sceneId]
  const o = room.origin
  if (room.roof) return [add(o, [0, 5.4, 11 * back]), add(o, [0, 0.8, 0])]
  return [add(o, [0.5, 2.6, 10.2 * back]), add(o, [0, 1.6, -0.6])]
}

/** Close-up framing for a hotspot inside its room. */
export function hotspotView(room, hotspot, { portrait = false } = {}) {
  const p = add(room.origin, hotspot.pos)
  const dist = portrait ? 4.6 : 3.1
  // stay a little to the side and above, always looking slightly down
  return [add(p, [0.35, 0.55, dist]), p]
}
