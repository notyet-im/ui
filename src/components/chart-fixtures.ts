/**
 * Story fixtures for the chart components.
 *
 * Deliberately literal, and deliberately not `.stories.tsx` — the story-title
 * lint would demand a title for a module that renders nothing.
 *
 * The four chart stories used to import `buildEdges`, `regionAggregates` and
 * the locale tables from `src/tracker/`, which is a demo and is not exported.
 * That made four *library* components undocumentable without a fictional
 * fund-flow domain that ships in no bundle: rename a market code and four doc
 * pages break, and a consumer reading them sees an API expressed in concepts
 * they cannot import. These values were captured from that demo, so the stories
 * render exactly as before — they just no longer reach across the boundary.
 */

export const MARKETS = [
  { key: 'US', code: 'US', name: 'United States' },
  { key: 'EU', code: 'EU', name: 'Europe' },
  { key: 'JP', code: 'JP', name: 'Japan' },
  { key: 'KR', code: 'KR', name: 'Korea' },
  { key: 'TW', code: 'TW', name: 'Taiwan' },
  { key: 'HK', code: 'HK', name: 'Hong Kong' },
  { key: 'SG', code: 'SG', name: 'Singapore' },
] as const

export const MARKET_CODES = MARKETS.map((m) => m.key)

export const SECTORS = [
  { key: 'SEMI', label: 'Semi' },
  { key: 'TECH', label: 'Tech' },
  { key: 'FIN', label: 'Fin' },
  { key: 'IND', label: 'Ind' },
  { key: 'HLTH', label: 'Hlth' },
  { key: 'ENE', label: 'Enrg' },
  { key: 'CON', label: 'Cons' },
  { key: 'MAT', label: 'Mat' },
  { key: 'PROP', label: 'Prop' },
] as const

const CELLS: Record<string, number> = {
  'US|TECH': 1810.71,
  'US|HLTH': 284.55,
  'US|ENE': -1130.07,
  'US|CON': 1265.15,
  'US|MAT': -649.51,
  'EU|FIN': -996.29,
  'EU|IND': 1130.07,
  'EU|HLTH': 1087.5,
  'EU|ENE': 649.51,
  'EU|CON': -1265.15,
  'JP|FIN': 996.29,
  'JP|IND': 2138.49,
  'JP|CON': -1372.05,
  'KR|SEMI': -4394.3,
  'KR|CON': -981.41,
  'TW|SEMI': -2574.48,
  'TW|TECH': -856.74,
  'HK|TECH': 6554.74,
  'HK|FIN': 2003.09,
  'HK|PROP': -1303.71,
  'SG|FIN': -393.31,
  'SG|PROP': -2003.09,
}
const PAIRS: Record<string, number> = {
  'US|EU': 2867,
  'US|JP': 1745,
  'EU|US': 1265,
  'EU|JP': 996,
  'JP|US': 1372,
  'KR|TW': 981,
  'KR|HK': 5251,
  'TW|US': 3556,
  'TW|KR': 857,
  'HK|HK': 1304,
  'SG|JP': 393,
  'SG|HK': 2003,
}
const LABELS: Record<string, { long: string; short: string }> = {
  'KR|SEMI': { long: 'KR · Semiconductors', short: 'KR · Semi' },
  'HK|TECH': { long: 'HK · Tech & Internet', short: 'HK · Tech' },
  'TW|SEMI': { long: 'TW · Semiconductors', short: 'TW · Semi' },
  'US|TECH': { long: 'US · Tech & Internet', short: 'US · Tech' },
  'SG|PROP': { long: 'SG · Property', short: 'SG · Prop' },
  'HK|FIN': { long: 'HK · Financials', short: 'HK · Fin' },
  'JP|IND': { long: 'JP · Industrials', short: 'JP · Ind' },
  'JP|CON': { long: 'JP · Consumer', short: 'JP · Cons' },
  'US|HLTH': { long: 'US · Healthcare', short: 'US · Hlth' },
  'HK|PROP': { long: 'HK · Property', short: 'HK · Prop' },
  'EU|CON': { long: 'EU · Consumer', short: 'EU · Cons' },
  'US|CON': { long: 'US · Consumer', short: 'US · Cons' },
  'US|ENE': { long: 'US · Energy', short: 'US · Enrg' },
  'EU|IND': { long: 'EU · Industrials', short: 'EU · Ind' },
  'EU|HLTH': { long: 'EU · Healthcare', short: 'EU · Hlth' },
}

export const cellValue = (row: string, column: string) => CELLS[`${row}|${column}`] ?? 0
export const CELL_MAX = 6554.74

export const pairValue = (from: string, to: string) => PAIRS[`${from}|${to}`] ?? 0
export const PAIR_MAX = 5251

export const RING_NODES = [
  { id: 'US', net: 1581 },
  { id: 'EU', net: 606 },
  { id: 'JP', net: 1763 },
  { id: 'KR', net: -5376 },
  { id: 'TW', net: -3431 },
  { id: 'HK', net: 7254 },
  { id: 'SG', net: -2396 },
]
export const RING_PAIRS = [
  { from: 'US', to: 'EU', value: 2867 },
  { from: 'US', to: 'JP', value: 1745 },
  { from: 'EU', to: 'US', value: 1265 },
  { from: 'EU', to: 'JP', value: 996 },
  { from: 'JP', to: 'US', value: 1372 },
  { from: 'KR', to: 'TW', value: 981 },
  { from: 'KR', to: 'HK', value: 5251 },
  { from: 'TW', to: 'US', value: 3556 },
  { from: 'TW', to: 'KR', value: 857 },
  { from: 'HK', to: 'HK', value: 1304 },
  { from: 'SG', to: 'JP', value: 393 },
  { from: 'SG', to: 'HK', value: 2003 },
]

export const FLOW_LINKS = [
  { from: 'KR|SEMI', to: 'HK|TECH', value: 5251 },
  { from: 'TW|SEMI', to: 'US|TECH', value: 3556 },
  { from: 'SG|PROP', to: 'HK|FIN', value: 2003 },
  { from: 'US|TECH', to: 'JP|IND', value: 1745 },
  { from: 'JP|CON', to: 'US|HLTH', value: 1372 },
  { from: 'HK|PROP', to: 'HK|TECH', value: 1304 },
  { from: 'EU|CON', to: 'US|CON', value: 1265 },
  { from: 'US|ENE', to: 'EU|IND', value: 1130 },
  { from: 'US|HLTH', to: 'EU|HLTH', value: 1087 },
]

export const marketName = (code: string) => MARKETS.find((m) => m.key === code)?.name ?? code
export const flowLabel = (id: string) => LABELS[id]?.long ?? id
export const flowLabelShort = (id: string) => LABELS[id]?.short ?? id
