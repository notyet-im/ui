import { formatFlow } from '../lib/format'
import { hash, rnd } from '../lib/prng'
import { walkSeries } from '../lib/series'
import type { BucketKey, MetricKey, RangeKey, RegionCode, SectorKey } from './data'
import { BASE_EDGES, MACRO_ROWS, RANGE_SCALE, RANGE_SEED, REGION_CODES, SECTOR_KEYS, TICKERS } from './data'
import type { Locale } from './i18n'

export interface Edge {
  from: BucketKey
  to: BucketKey
  /** Flow in USD millions, after range/metric scaling. */
  value: number
  /** Index into `BASE_EDGES`, for looking up translated narrative copy. */
  sourceIndex: number
  why: string
}

/** Institutional vs ETF tilt. Alternating weights keep both metrics lively. */
const METRIC_WEIGHTS: Record<MetricKey, [number, number]> = {
  inst: [1.18, 0.62],
  etf: [0.58, 1.32],
  combined: [1, 1],
}

/**
 * Derives the edge set for a range/metric combination.
 *
 * At the 1D range some flows reverse — intraday noise dominates, and a handful
 * of the slower rotations show up backwards. That's deliberate, and seeded, so
 * it's the same handful every time.
 */
export function buildEdges(range: RangeKey, metric: MetricKey): Edge[] {
  const scale = RANGE_SCALE[range]
  const seed = RANGE_SEED[range]
  const weights = METRIC_WEIGHTS[metric]

  return BASE_EDGES.map((edge, i) => {
    let from = edge.from
    let to = edge.to
    const jitter = 0.55 + 1.2 * rnd(seed * 97 + i * 13)
    if (range === '1D' && rnd(seed + i * 7) > 0.76) {
      ;[from, to] = [to, from]
    }
    return {
      from,
      to,
      sourceIndex: i,
      why: edge.why,
      value: Math.max(8, edge.v * scale * jitter * weights[i % 2]),
    }
  }).sort((a, b) => b.value - a.value)
}

/** Net flow per bucket: positive where capital arrived, negative where it left. */
export function bucketNets(edges: Edge[]): Record<BucketKey, number> {
  const nets: Record<BucketKey, number> = {}
  for (const edge of edges) {
    nets[edge.to] = (nets[edge.to] || 0) + edge.value
    nets[edge.from] = (nets[edge.from] || 0) - edge.value
  }
  return nets
}

export interface RegionAggregates {
  nets: Record<string, number>
  /** `pairs[from][to]` — gross directional volume. */
  pairs: Record<string, Record<string, number>>
  maxPair: number
}

/** Rolls bucket-level edges up to market level for the ring and matrix views. */
export function regionAggregates(edges: Edge[]): RegionAggregates {
  const nets: Record<string, number> = {}
  const pairs: Record<string, Record<string, number>> = {}

  for (const region of REGION_CODES) {
    nets[region] = 0
    pairs[region] = {}
    for (const other of REGION_CODES) pairs[region][other] = 0
  }

  for (const edge of edges) {
    const from = edge.from.split('|')[0]
    const to = edge.to.split('|')[0]
    nets[from] -= edge.value
    nets[to] += edge.value
    pairs[from][to] += edge.value
  }

  let maxPair = 0
  for (const from of REGION_CODES) {
    for (const to of REGION_CODES) maxPair = Math.max(maxPair, pairs[from][to])
  }

  return { nets, pairs, maxPair: maxPair || 1 }
}

/** Builds the locale-aware bucket labellers. */
export function makeLabeller(locale: Locale) {
  const label = (key: BucketKey): string => {
    const [region, sector] = key.split('|')
    return sector === '*'
      ? locale.reg[region as RegionCode]
      : `${region} · ${locale.sec[sector as SectorKey]}`
  }
  const shortLabel = (key: BucketKey): string => {
    const [region, sector] = key.split('|')
    return sector === '*'
      ? locale.reg[region as RegionCode]
      : `${region} · ${locale.sshort[sector as SectorKey]}`
  }
  return { label, shortLabel }
}

export interface BreakdownEntry {
  name: string
  value: number
  fraction: number
}

export interface CounterpartyEntry {
  key: string
  arrow: string
  name: string
  value: number
}

export interface TickerEntry {
  key: string
  symbol: string
  name: string
  value: number
}

export interface SelectionDetail {
  key: BucketKey
  title: string
  /** True when the selection is a whole market rather than a market·sector bucket. */
  isRegion: boolean
  net: number
  series: number[]
  breakdown: BreakdownEntry[]
  counterparties: CounterpartyEntry[]
  names: TickerEntry[]
  breakdownLabel: string
}

/**
 * Everything the detail panel shows for the current selection.
 *
 * A region selection matches every bucket in that market; a bucket selection
 * matches only itself.
 */
export function selectionDetail(
  edges: Edge[],
  selectedKey: BucketKey,
  range: RangeKey,
  locale: Locale,
): SelectionDetail {
  const [region, sector] = selectedKey.split('|')
  const isRegion = sector === '*'
  const { label } = makeLabeller(locale)

  const matches = (key: BucketKey) => (isRegion ? key.split('|')[0] === region : key === selectedKey)
  const inbound = edges.filter((e) => matches(e.to))
  const outbound = edges.filter((e) => matches(e.from))
  const net = inbound.reduce((acc, e) => acc + e.value, 0) - outbound.reduce((acc, e) => acc + e.value, 0)

  const breakdownNames = isRegion
    ? SECTOR_KEYS.map((key) => locale.sec[key])
    : locale.indu[sector as SectorKey]

  const rawBreakdown = breakdownNames.map((name, i) => ({
    name,
    value: net * (0.16 + 0.5 * rnd(hash(selectedKey + name) + i)),
  }))
  const breakdownMax = Math.max(...rawBreakdown.map((b) => Math.abs(b.value))) || 1
  const breakdown = rawBreakdown
    .slice()
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 5)
    .map((entry) => ({ ...entry, fraction: Math.abs(entry.value) / breakdownMax }))

  // Japanese and Korean put the directional word after the place name.
  const directional = (key: BucketKey, word: string) =>
    locale.suffix ? `${label(key)} ${word}` : `${word} ${label(key)}`

  const counterparties: CounterpartyEntry[] = [
    ...inbound.slice(0, 3).map((e) => ({
      key: `in:${e.from}`,
      arrow: '←',
      name: directional(e.from, locale.ui.from),
      value: e.value,
    })),
    ...outbound.slice(0, 3).map((e) => ({
      key: `out:${e.to}`,
      arrow: '→',
      name: directional(e.to, locale.ui.to),
      value: -e.value,
    })),
  ]

  const tickerKey = isRegion
    ? `${region}|${SECTOR_KEYS.find((s) => TICKERS[`${region}|${s}`]) ?? ''}`
    : selectedKey
  const tickers = TICKERS[tickerKey] ?? [['—', locale.ui.noCov] as const]

  const names: TickerEntry[] = tickers.map((ticker, i) => ({
    key: ticker[0],
    symbol: ticker[0],
    name: ticker[1],
    value: net * (0.42 - i * 0.11) * (0.8 + 0.4 * rnd(hash(ticker[0]))),
  }))

  return {
    key: selectedKey,
    title: label(selectedKey),
    isRegion,
    net,
    series: walkSeries(selectedKey + range, 30, net),
    breakdown,
    counterparties,
    names,
    breakdownLabel: isRegion ? locale.ui.sectorBreak : locale.ui.induBreak,
  }
}

export interface TickerExtremes {
  bought: TickerEntry[]
  sold: TickerEntry[]
}

/** The largest single-name moves in either direction. */
export function tickerExtremes(cellValues: Record<BucketKey, number>, range: RangeKey): TickerExtremes {
  const all: TickerEntry[] = []

  for (const bucket of Object.keys(TICKERS)) {
    const base = cellValues[bucket] || 0
    TICKERS[bucket].forEach((ticker, i) => {
      const value = base * (0.4 - i * 0.1) * (0.7 + 0.6 * rnd(hash(ticker[0] + range)))
      // Sub-$1M names are noise at this resolution.
      if (Math.abs(value) > 1) {
        all.push({ key: ticker[0], symbol: ticker[0], name: ticker[1], value })
      }
    })
  }

  return {
    bought: all
      .filter((t) => t.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5),
    sold: all
      .filter((t) => t.value < 0)
      .sort((a, b) => a.value - b.value)
      .slice(0, 5),
  }
}

export interface SectorMomentum {
  key: SectorKey
  name: string
  value: number
  share: string
  series: number[]
  /** Bucket to select when this card is clicked — the sector's strongest market. */
  focusKey: BucketKey
}

export function sectorMomentum(
  edges: Edge[],
  cellValues: Record<BucketKey, number>,
  total: number,
  range: RangeKey,
  locale: Locale,
): SectorMomentum[] {
  const sums: Record<string, number> = {}
  for (const sector of SECTOR_KEYS) sums[sector] = 0
  for (const edge of edges) {
    sums[edge.to.split('|')[1]] += edge.value
    sums[edge.from.split('|')[1]] -= edge.value
  }

  return SECTOR_KEYS.map((sector) => {
    const value = sums[sector]
    const share = ((Math.abs(value) / (total || 1)) * 100).toFixed(1)
    return {
      key: sector,
      name: locale.sec[sector],
      value,
      share: `${value >= 0 ? '+' : '−'}${share}${locale.ui.ofFlow}`,
      series: walkSeries(sector + range, 22, value),
      focusKey: REGION_CODES.map((region) => `${region}|${sector}`).sort(
        (a, b) => (cellValues[b] || 0) - (cellValues[a] || 0),
      )[0],
    }
  })
}

export interface MacroReading {
  key: string
  label: string
  value: string
  change: number
  changeText: string
  series: number[]
}

export function macroReadings(range: RangeKey, locale: Locale): MacroReading[] {
  return MACRO_ROWS.map(([labelKey, value, baseChange]) => {
    const label = labelKey === '__gold__' ? locale.ui.gold : labelKey
    const change = baseChange * (RANGE_SCALE[range] || 1)
    return {
      key: labelKey,
      label,
      value,
      change,
      changeText: `${change >= 0 ? '+' : '−'}${Math.abs(change).toFixed(1)}%`,
      series: walkSeries(label + range, 14, change),
    }
  })
}

export interface NarrativeEntry {
  key: string
  title: string
  value: string
  body: string
  /** Alternating tone so consecutive cards stay visually separable. */
  tone: number
}

export function narrative(edges: Edge[], locale: Locale, why: string[] | undefined): NarrativeEntry[] {
  const { label } = makeLabeller(locale)
  return edges.slice(0, 4).map((edge, i) => ({
    key: `narrative:${i}`,
    title: `${label(edge.from)} → ${label(edge.to)}`,
    value: formatFlow(edge.value),
    body: why?.[edge.sourceIndex] ?? edge.why,
    tone: i % 2 ? -1 : 1,
  }))
}

/** The bucket shown when the user has not picked one: the biggest net receiver. */
export function defaultSelection(nets: Record<BucketKey, number>): BucketKey {
  return Object.keys(nets).sort((a, b) => nets[b] - nets[a])[0]
}
