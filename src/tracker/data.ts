/**
 * Synthetic flow data for the Capital Flow Tracker.
 *
 * This is prototype data for design review — not market data. Figures are in
 * millions of USD. The set is deliberately small and hand-written so that every
 * view has something interesting in it at every range and metric setting.
 */

export const REGION_CODES = ['US', 'EU', 'JP', 'KR', 'TW', 'HK', 'SG'] as const
export type RegionCode = (typeof REGION_CODES)[number]

export const SECTOR_KEYS = ['SEMI', 'TECH', 'FIN', 'IND', 'HLTH', 'ENE', 'CON', 'MAT', 'PROP'] as const
export type SectorKey = (typeof SECTOR_KEYS)[number]

/** `REGION|SECTOR`, or `REGION|*` for a whole-market bucket. */
export type BucketKey = string

export const RANGE_KEYS = ['1D', '5D', '15D', '30D'] as const
export type RangeKey = (typeof RANGE_KEYS)[number]

export const METRIC_KEYS = ['inst', 'etf', 'combined'] as const
export type MetricKey = (typeof METRIC_KEYS)[number]

export const VIEW_KEYS = ['flow', 'grid', 'ring'] as const
export type ViewKey = (typeof VIEW_KEYS)[number]

export const LANG_KEYS = ['en', 'zh', 'ja', 'ko'] as const
export type LangKey = (typeof LANG_KEYS)[number]

export interface BaseEdge {
  from: BucketKey
  to: BucketKey
  /** Flow in USD millions at the 15D reference range. */
  v: number
  /** English explanation; other languages index into `WHY` by position. */
  why: string
}

/** Representative names per bucket, for the ticker-level panels. */
export const TICKERS: Record<string, ReadonlyArray<readonly [string, string]>> = {
  'KR|SEMI': [
    ['005930.KS', 'Samsung Elec'],
    ['000660.KS', 'SK Hynix'],
    ['042700.KS', 'Hanmi Semi'],
  ],
  'TW|SEMI': [
    ['2330.TW', 'TSMC'],
    ['2454.TW', 'MediaTek'],
    ['3711.TW', 'ASE'],
  ],
  'US|SEMI': [
    ['NVDA', 'NVIDIA'],
    ['AVGO', 'Broadcom'],
    ['AMAT', 'Applied Mat'],
  ],
  'HK|TECH': [
    ['0700.HK', 'Tencent'],
    ['9988.HK', 'Alibaba'],
    ['3690.HK', 'Meituan'],
  ],
  'US|TECH': [
    ['MSFT', 'Microsoft'],
    ['GOOGL', 'Alphabet'],
    ['META', 'Meta'],
  ],
  'TW|TECH': [
    ['2317.TW', 'Hon Hai'],
    ['2382.TW', 'Quanta'],
  ],
  'JP|IND': [
    ['6501.T', 'Hitachi'],
    ['6301.T', 'Komatsu'],
    ['6954.T', 'Fanuc'],
  ],
  'EU|IND': [
    ['SIE.DE', 'Siemens'],
    ['SU.PA', 'Schneider'],
  ],
  'EU|FIN': [
    ['BNP.PA', 'BNP Paribas'],
    ['SAN.MC', 'Santander'],
    ['UBSG.SW', 'UBS'],
  ],
  'JP|FIN': [
    ['8306.T', 'MUFG'],
    ['8316.T', 'SMFG'],
  ],
  'HK|FIN': [
    ['0005.HK', 'HSBC'],
    ['2388.HK', 'BOC HK'],
  ],
  'SG|FIN': [
    ['D05.SI', 'DBS'],
    ['O39.SI', 'OCBC'],
  ],
  'SG|PROP': [
    ['C38U.SI', 'CapitaLand Trust'],
    ['A17U.SI', 'Ascendas REIT'],
  ],
  'HK|PROP': [
    ['0016.HK', 'SHK Properties'],
    ['0823.HK', 'Link REIT'],
  ],
  'US|ENE': [
    ['XOM', 'Exxon Mobil'],
    ['CVX', 'Chevron'],
  ],
  'EU|ENE': [
    ['SHEL.L', 'Shell'],
    ['ORSTED.CO', 'Orsted'],
  ],
  'US|HLTH': [
    ['LLY', 'Eli Lilly'],
    ['UNH', 'UnitedHealth'],
  ],
  'EU|HLTH': [
    ['NOVN.SW', 'Novartis'],
    ['NOVOb.CO', 'Novo Nordisk'],
  ],
  'JP|CON': [
    ['7203.T', 'Toyota'],
    ['9983.T', 'Fast Retailing'],
  ],
  'US|CON': [
    ['COST', 'Costco'],
    ['NKE', 'Nike'],
  ],
  'EU|CON': [
    ['MC.PA', 'LVMH'],
    ['NESN.SW', 'Nestle'],
  ],
  'KR|CON': [
    ['051910.KS', 'LG Chem'],
    ['090430.KS', 'Amorepacific'],
  ],
  'US|MAT': [
    ['FCX', 'Freeport'],
    ['DOW', 'Dow Inc'],
  ],
}

export const BASE_EDGES: ReadonlyArray<BaseEdge> = [
  {
    from: 'KR|SEMI',
    to: 'HK|TECH',
    v: 3820,
    why: 'Foreign desks trimmed Korean memory after a hot 6-month run and redeployed into Hong Kong platform names on cheaper multiples and southbound buying.',
  },
  {
    from: 'US|TECH',
    to: 'JP|IND',
    v: 2610,
    why: 'Profit-taking in US megacap software funded a rotation into Japanese automation and capital goods, helped by a softer yen and buyback announcements.',
  },
  {
    from: 'TW|SEMI',
    to: 'US|TECH',
    v: 2140,
    why: 'Taiwan foundry weightings were cut back into strength; the money went straight back up the AI stack into US hyperscalers.',
  },
  {
    from: 'EU|FIN',
    to: 'JP|FIN',
    v: 1760,
    why: 'European bank longs were reduced as rate-cut expectations firmed, with Japanese megabanks bought as the remaining rate-normalisation trade.',
  },
  {
    from: 'US|ENE',
    to: 'EU|IND',
    v: 1450,
    why: 'Crude softness pushed generalists out of US integrateds and into European industrials levered to grid and defence spending.',
  },
  {
    from: 'SG|PROP',
    to: 'HK|FIN',
    v: 1210,
    why: 'Singapore REIT positions were cut on funding costs; proceeds landed in Hong Kong financials as HIBOR eased.',
  },
  {
    from: 'HK|PROP',
    to: 'HK|TECH',
    v: 1640,
    why: 'Intra-market rotation: developers stayed unloved while the same investors added Hong Kong internet on earnings upgrades.',
  },
  {
    from: 'JP|CON',
    to: 'US|HLTH',
    v: 980,
    why: 'Japanese consumer names were sold into wage-cycle uncertainty and rotated into US healthcare for defensive earnings.',
  },
  {
    from: 'EU|CON',
    to: 'US|CON',
    v: 865,
    why: 'Luxury exposure was trimmed on China demand worry, with defensive US retail picking up the flow.',
  },
  {
    from: 'KR|CON',
    to: 'TW|SEMI',
    v: 745,
    why: 'Korean battery-chain consumer names funded a top-up in Taiwan advanced packaging.',
  },
  {
    from: 'US|HLTH',
    to: 'EU|HLTH',
    v: 695,
    why: 'Valuation-driven swap out of US pharma into European large-cap pharma and obesity-chain names.',
  },
  {
    from: 'SG|FIN',
    to: 'JP|IND',
    v: 615,
    why: 'Singapore bank profit-taking after record dividends; flow followed the Japan re-rating theme.',
  },
  {
    from: 'TW|TECH',
    to: 'KR|SEMI',
    v: 530,
    why: 'A small counter-flow: hardware assemblers sold, Korean chip names partially bought back on the dip.',
  },
  {
    from: 'US|MAT',
    to: 'EU|ENE',
    v: 475,
    why: 'Commodity cyclicals swapped into European energy for yield and buyback support.',
  },
]

/** Volume multiplier per range, relative to the 15D reference. */
export const RANGE_SCALE: Record<RangeKey, number> = { '1D': 0.16, '5D': 0.53, '15D': 1, '30D': 1.74 }

/** Per-range PRNG seed, so each range has its own stable jitter. */
export const RANGE_SEED: Record<RangeKey, number> = { '1D': 11, '5D': 23, '15D': 37, '30D': 53 }

/** Macro readings shown in the top strip: [labelKey, value, change%]. */
export const MACRO_ROWS: ReadonlyArray<readonly [string, string, number]> = [
  ['DXY', '96.8', -0.7],
  ['USD/JPY', '145.9', 0.5],
  ['US 10Y', '4.08%', -0.4],
  ['USD/KRW', '1,338', -0.6],
  ['__gold__', '$3,412', 1.1],
]
