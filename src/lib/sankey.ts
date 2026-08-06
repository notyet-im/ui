/**
 * Two-column Sankey layout.
 *
 * Sources stack on the left, targets on the right, both ordered by total
 * volume. Ribbons are ordered by their target's rank, which is what keeps the
 * bundle from turning into a hairball: flows arriving at the same place enter
 * the right-hand stack together.
 */

export interface FlowLink {
  from: string
  to: string
  value: number
}

export type SankeySide = 'source' | 'target'

export interface SankeyNode {
  /** Unique across both columns — an id can appear as both source and target. */
  key: string
  id: string
  side: SankeySide
  x: number
  y: number
  height: number
  /** Signed: negative on the source side, since that capital is leaving. */
  value: number
}

export interface SankeyRibbon {
  key: string
  from: string
  to: string
  /** Cubic bezier path data. */
  d: string
  width: number
  value: number
}

export interface SankeyLabel {
  key: string
  id: string
  side: SankeySide
  value: number
  left: number
  top: number
  maxWidth: number
  transform: string
  textAlign: 'left' | 'right'
}

export interface SankeyLayout {
  nodes: SankeyNode[]
  ribbons: SankeyRibbon[]
  labels: SankeyLabel[]
  width: number
  height: number
  nodeWidth: number
}

export interface SankeyOptions {
  width: number
  /** Height of the ribbon field. Default 400. */
  height?: number
  /** Vertical gap between stacked nodes. Default 18. */
  gap?: number
  /** Distance from each edge to its node column. Defaults to a width-derived value. */
  margin?: number
  /** Use tighter margins suited to narrow viewports. Ignored when `margin` is set. */
  narrow?: boolean
  /** Space reserved above the field for column headings. Default 40. */
  topOffset?: number
}

const NODE_WIDTH = 10
/** Horizontal pull of the bezier control points, as a fraction of the span. */
const CURVE_TENSION = 0.42

function defaultMargin(width: number, narrow: boolean): number {
  return narrow ? Math.max(78, width * 0.27) : Math.max(120, Math.min(176, width * 0.23))
}

export function sankeyLayout(links: FlowLink[], options: SankeyOptions): SankeyLayout {
  const { width, height = 400, gap = 18, narrow = false, topOffset = 40 } = options
  const margin = options.margin ?? defaultMargin(width, narrow)

  const sourceTotals: Record<string, number> = {}
  const targetTotals: Record<string, number> = {}
  for (const link of links) {
    sourceTotals[link.from] = (sourceTotals[link.from] || 0) + link.value
    targetTotals[link.to] = (targetTotals[link.to] || 0) + link.value
  }

  const sources = Object.keys(sourceTotals).sort((a, b) => sourceTotals[b] - sourceTotals[a])
  const targets = Object.keys(targetTotals).sort((a, b) => targetTotals[b] - targetTotals[a])

  const sum = links.reduce((acc, l) => acc + l.value, 0)
  // Scale so whichever column has more nodes still fits after its gaps.
  const scale = Math.min(
    (height - gap * (sources.length - 1)) / sum,
    (height - gap * (targets.length - 1)) / sum,
  )

  const xSource = margin
  const xTarget = width - margin - NODE_WIDTH

  const nodes: SankeyNode[] = []
  const labels: SankeyLabel[] = []
  const cursors: Record<string, { top: number; height: number; fill: number }> = {}

  const stack = (keys: string[], totals: Record<string, number>, x: number, side: SankeySide) => {
    const stackHeight = keys.reduce((acc, k) => acc + totals[k] * scale, 0) + gap * (keys.length - 1)
    let y = topOffset + (height - stackHeight) / 2

    for (const id of keys) {
      const nodeHeight = Math.max(3, totals[id] * scale)
      const key = `${side}:${id}`
      cursors[key] = { top: y, height: nodeHeight, fill: y }

      const signedValue = side === 'source' ? -totals[id] : totals[id]
      nodes.push({ key, id, side, x, y, height: nodeHeight, value: signedValue })
      labels.push({
        key: `label:${key}`,
        id,
        side,
        value: signedValue,
        maxWidth: side === 'source' ? margin - 12 : width - xTarget - 20,
        left: side === 'source' ? x - 10 : x + 18,
        top: y + nodeHeight / 2,
        transform: side === 'source' ? 'translate(-100%,-50%)' : 'translate(0,-50%)',
        textAlign: side === 'source' ? 'right' : 'left',
      })

      y += nodeHeight + gap
    }
  }

  stack(sources, sourceTotals, xSource, 'source')
  stack(targets, targetTotals, xTarget, 'target')

  // Enter the right-hand column in target order to minimise ribbon crossings.
  const ordered = links.slice().sort((a, b) => targets.indexOf(a.to) - targets.indexOf(b.to))

  const c1 = xSource + (xTarget - xSource) * CURVE_TENSION
  const c2 = xTarget - (xTarget - xSource) * CURVE_TENSION

  const ribbons: SankeyRibbon[] = ordered.map((link, i) => {
    const source = cursors[`source:${link.from}`]
    const target = cursors[`target:${link.to}`]
    const ribbonWidth = Math.max(1.5, link.value * scale)

    const y0 = source.fill + ribbonWidth / 2
    const y1 = target.fill + ribbonWidth / 2
    source.fill += ribbonWidth
    target.fill += ribbonWidth

    return {
      key: `ribbon:${i}:${link.from}->${link.to}`,
      from: link.from,
      to: link.to,
      value: link.value,
      width: ribbonWidth,
      d:
        `M${xSource + NODE_WIDTH} ${y0.toFixed(1)} ` +
        `C${c1.toFixed(0)} ${y0.toFixed(1)}, ${c2.toFixed(0)} ${y1.toFixed(1)}, ` +
        `${xTarget.toFixed(0)} ${y1.toFixed(1)}`,
    }
  })

  return { nodes, ribbons, labels, width, height, nodeWidth: NODE_WIDTH }
}
