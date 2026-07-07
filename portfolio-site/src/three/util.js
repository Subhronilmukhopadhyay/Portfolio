import * as THREE from 'three'

/** Soft radial dot sprite so points render as glowing circles, not squares. */
export function makeDotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.25)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Build a graph of nodes in a shallow 3D volume + nearest-neighbour edges. */
export function buildGraph({ count = 80, spread = 9, depth = 5, neighbours = 2 } = {}) {
  const nodes = []
  for (let i = 0; i < count; i++) {
    nodes.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread * 1.25,
        (Math.random() - 0.5) * depth,
      ),
    )
  }

  // edges: connect each node to its nearest neighbours (deduped)
  const edgeSet = new Set()
  const edges = []
  for (let i = 0; i < count; i++) {
    const dists = []
    for (let j = 0; j < count; j++) {
      if (i === j) continue
      dists.push([j, nodes[i].distanceToSquared(nodes[j])])
    }
    dists.sort((a, b) => a[1] - b[1])
    for (let k = 0; k < neighbours; k++) {
      const j = dists[k][0]
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (edgeSet.has(key)) continue
      edgeSet.add(key)
      edges.push([i, j])
    }
  }
  return { nodes, edges }
}

export const COLORS = {
  accent: '#3de8ff',
  agent: '#8b6cff',
  live: '#ff5fa2',
  mint: '#7cffc4',
  starlight: '#eaf2ff',
}
