/**
 * Radial rotation layout.
 *
 * Nodes sit evenly around a circle starting at twelve o'clock; chords bow
 * gently toward the centre so that reciprocal pairs stay distinguishable
 * instead of overlapping on a straight line.
 */

export interface RingNodeInput {
  id: string
  /** Signed net position change — drives both radius and colour. */
  net: number
}

export interface RingPairInput {
  from: string
  to: string
  value: number
}

export interface RingNode {
  key: string
  id: string
  x: number
  y: number
  r: number
  net: number
  /** True when the node sits on the right half, so labels read outward. */
  labelRight: boolean
}

export interface RingChord {
  key: string
  from: string
  to: string
  d: string
  width: number
  value: number
}

export interface RingLabel {
  key: string
  id: string
  net: number
  left: number
  top: number
  maxWidth: number
  transform: string
  textAlign: 'left' | 'right'
}

export interface RingLayout {
  nodes: RingNode[]
  chords: RingChord[]
  labels: RingLabel[]
  width: number
  height: number
  center: { x: number; y: number }
  radius: number
}

export interface RingOptions {
  width: number
  /** Height of the SVG field. Default 472. */
  height?: number
  /** Smallest node radius, at zero net. Default 9. */
  minNodeRadius?: number
  /** Additional radius at maximum net. Default 20. */
  nodeRadiusRange?: number
}

/** How far chords bow toward the centre, as a fraction of the midpoint offset. */
const CHORD_BOW = 0.12

function ringRadius(width: number): number {
  const inset = Math.max(46, Math.min(118, width * 0.24))
  return Math.max(58, Math.min(178, width / 2 - inset))
}

export function ringLayout(
  nodeInputs: RingNodeInput[],
  pairs: RingPairInput[],
  options: RingOptions,
): RingLayout {
  const { width, height = 472, minNodeRadius = 9, nodeRadiusRange = 20 } = options

  const cx = width / 2
  // Derived, not an option. `centerY` defaulted to 236 independently of
  // `height`, so `<RotationRing height={600}>` drew the ring 64px above centre —
  // a misconfiguration the caller could not see and never asked for.
  const cy = height / 2
  const radius = ringRadius(width)

  const maxNet = nodeInputs.reduce((acc, n) => Math.max(acc, Math.abs(n.net)), 0) || 1

  const positions: Record<string, [number, number]> = {}
  const nodes: RingNode[] = []
  const labels: RingLabel[] = []

  nodeInputs.forEach((input, i) => {
    const angle = -Math.PI / 2 + (i / nodeInputs.length) * Math.PI * 2
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    positions[input.id] = [x, y]

    // -0.15 rather than 0 so the node nearest twelve o'clock labels rightward.
    const labelRight = Math.cos(angle) > -0.15
    const r = minNodeRadius + nodeRadiusRange * (Math.abs(input.net) / maxNet)

    nodes.push({ key: input.id, id: input.id, x, y, r, net: input.net, labelRight })
    labels.push({
      key: `label:${input.id}`,
      id: input.id,
      net: input.net,
      maxWidth: labelRight ? width - x - r - 12 : x - r - 12,
      left: x + (labelRight ? r + 9 : -r - 9),
      top: y,
      transform: labelRight ? 'translate(0,-50%)' : 'translate(-100%,-50%)',
      textAlign: labelRight ? 'left' : 'right',
    })
  })

  const maxPair = Math.max(...pairs.map((p) => p.value), 0) || 1

  const chords: RingChord[] = pairs
    .filter((p) => p.from !== p.to && p.value > 0 && positions[p.from] && positions[p.to])
    .map((p) => {
      const [x0, y0] = positions[p.from]
      const [x1, y1] = positions[p.to]
      const qx = cx + (x0 + x1 - 2 * cx) * CHORD_BOW
      const qy = cy + (y0 + y1 - 2 * cy) * CHORD_BOW
      return {
        key: `${p.from}->${p.to}`,
        from: p.from,
        to: p.to,
        value: p.value,
        width: 1.5 + 15 * (p.value / maxPair),
        d: `M${x0.toFixed(1)} ${y0.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`,
      }
    })

  return { nodes, chords, labels, width, height, center: { x: cx, y: cy }, radius }
}
