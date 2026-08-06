# @notyet/capital-flow-ds

A design system for cross-border capital-flow interfaces, extracted from the
**Capital Flow Tracker** prototype, plus the tracker itself as its showcase.

The system is small and opinionated: it exists to make signed financial flow
legible. Teal means capital arriving, rust means capital leaving, and every
figure is set in monospace so signed columns stay optically flush.

```
src/
  styles/tokens.css    every design token, both themes
  tokens.ts            JS mirror — only what SVG attributes genuinely need
  lib/                 pure geometry & formatting (no React)
  components/          the design system
  hooks.ts             useMeasure, useEscapeKey
  tracker/             the Capital Flow Tracker, built from the components above
```

## Quick start

```tsx
import { ThemeProvider, Panel, StatTile, MacroStrip } from '@notyet/capital-flow-ds'
import '@notyet/capital-flow-ds/styles.css'
import '@notyet/capital-flow-ds/fonts.css' // optional — see Fonts below

export function App() {
  return (
    <ThemeProvider theme="dark">
      <Panel>
        <MacroStrip>
          <StatTile label="USD/JPY" value="145.9" change="+0.5%" changeValue={0.5} trend={[1, 3, 2, 5]} />
        </MacroStrip>
      </Panel>
    </ThemeProvider>
  )
}
```

### `ThemeProvider` is required

Every component styles itself from `--cf-*` custom properties, and
`ThemeProvider` is what defines them. Outside one, components render unstyled —
transparent backgrounds and browser-default text — because every colour they
reference resolves to nothing. It also sets `data-theme`, which is how the light
palette is selected.

### Fonts

The system is set in **IBM Plex Sans** with **IBM Plex Mono** for all figures,
plus Noto Sans SC/JP/KR for the tracker's Chinese, Japanese and Korean copy.
Import `fonts.css` to pull them from Google Fonts, or self-host and skip it —
nothing else in the library depends on how they arrive.

## Tokens

| Group | Tokens | Notes |
| --- | --- | --- |
| Surfaces | `--cf-bg` `--cf-panel` `--cf-panel-2` `--cf-line` | flip with the theme |
| Text | `--cf-text` `--cf-dim` `--cf-dim-2` | flip with the theme |
| Flow | `--cf-inflow` `--cf-outflow` `--cf-neutral` | **theme-invariant** |
| Type | `--cf-text-micro` … `--cf-text-5xl` | 10.5px → 27px |
| Radii | `--cf-radius-swatch` … `--cf-radius-panel` | named for what they wrap |
| Motion | `--cf-ease` `--cf-duration-flow` `--cf-duration-fade` | one easing curve throughout |

Flow colours stay fixed across themes on purpose: the meaning of teal must not
depend on whether the room lights are on. `flowColor(value)` returns the right
one for a signed number.

## Components

**Theme** — `ThemeProvider`, `useTheme`, `ThemeToggle`

**Layout** — `Panel`, `PanelHeading`, `PageHeader`

**Controls** — `SegmentedControl`, `Tabs`, `Select`, `IconButton`, `GhostButton`,
`Eyebrow`, `Legend`

Use `SegmentedControl` for filters that change *what the data is*, and `Tabs` for
switching between views of the same data.

**Data display** — `MacroStrip`, `StatTile`, `Sparkline`, `HeatGrid`,
`RotationMatrix`, `BreakdownBar`, `DataRow`, `NarrativeItem`, `MomentumCard`

**Charts** — `SankeyFlow`, `RotationRing`

Both charts lay out in real CSS pixels rather than a scaled `viewBox`, because
their labels are HTML and must not scale with the drawing. Give them a measured
`width` — `useMeasure` returns one:

```tsx
const [ref, { width }] = useMeasure<HTMLDivElement>()
return (
  <div ref={ref}>
    <SankeyFlow links={links} width={width || 880} selectedId={selected} onSelect={setSelected} />
  </div>
)
```

## Utilities

`formatFlow` / `formatBillions` / `formatPercent` format money in millions.
They use U+2212 MINUS SIGN (`−`), not a hyphen — in IBM Plex Mono the true minus
aligns with the plus, keeping signed columns flush. It also permits a line break
before a following `$`, which is why every figure style in the system sets
`white-space: nowrap`.

`rnd` / `hash` / `walkSeries` / `seriesPath` / `heatStyle` / `sankeyLayout` /
`ringLayout` are pure and React-free — usable for server rendering, tests, or a
different view layer.

## The Capital Flow Tracker

`src/tracker/` implements the original prototype on top of the system:

- three hero views — flow ribbons, region × sector grid, rotation ring
- filters for lookback (1D/5D/15D/30D) and flow source (institutional/ETF/combined)
- click any bucket to focus it everywhere; Escape clears
- four languages (en/zh/ja/ko), including per-language narrative copy
- dark and light themes
- responsive down to phone width

```tsx
import { CapitalFlowTracker } from './tracker/CapitalFlowTracker'

<CapitalFlowTracker theme="dark" lang="en" initialRange="15D" metric="combined" heroView="flow" />
```

Props seed the initial state only; each one is then user-controllable in the page.

> **The data is synthetic.** `src/tracker/data.ts` is hand-written prototype data
> for design review, not market data. All figures derive from a seeded PRNG, so
> the same inputs always produce the same chart — no `Math.random()` anywhere.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Vite dev server for the tracker |
| `npm run storybook` | Storybook on :6006 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build:lib` | library → `dist/` (ESM + CJS + types + CSS) |
| `npm run build:app` | tracker demo → `dist-app/` |
| `npm run build` | both |

## Accessibility notes

Chart selection is keyboard-reachable: the HTML labels beside Sankey nodes and
ring bubbles are real `<button>`s, and heat-grid cells are buttons with
`aria-pressed`. Tabs and segmented controls carry `tablist`/`radiogroup`
semantics. `prefers-reduced-motion` collapses every transition.
