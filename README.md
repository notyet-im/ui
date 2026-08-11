# @notyet/ui

**NotYet UI** — a dense, dark-first React design system in two halves: **UI**
components for building interfaces, and **Charts** for encoding data.

It is deliberately opinionated:

- **Two categories, nothing else.** Every component is `UI` or `Charts`.
- **Semantic tokens only.** Components never reference a raw colour or a literal
  pixel. There is no utility-class vocabulary to learn or to fight.
- **Zero runtime dependencies.** React is a peer; nothing else ships.
- **Density is the point.** The default control is 34px and the body size is
  14px, because this system exists for information-dense screens.

```
src/
  components/          the library — one .tsx + .css per component family
  styles/tokens.css    every design token, the single source of truth
  styles/base.css      reset, the one focus ring, disabled and reduced motion
  lib/                 pure layout maths for the charts, plus formatting
  tracker/             a showcase application built from the components
```

## Quick start

```bash
npm install @notyet/ui
```

```jsx
import { ThemeProvider, Container, Grid, GridItem, Panel, Button } from '@notyet/ui'
import '@notyet/ui/styles.css'
import '@notyet/ui/fonts.css' // optional — IBM Plex from Google Fonts

export function App() {
  return (
    <ThemeProvider theme="dark">
      <Container size="lg">
        <Grid columns={{ base: 1, md: 12 }} gap={16}>
          <GridItem span={{ base: 1, md: 8 }}>
            <Panel>
              <Button variant="primary">Rebalance</Button>
            </Panel>
          </GridItem>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}
```

### `ThemeProvider` is required

It defines the `--ny-*` custom properties, sets `data-theme`, and scopes the
reset and the shared focus ring. Outside it, components render with transparent
backgrounds and browser-default text, because every colour they reference
resolves to nothing. `useTheme()` reads the current theme; the provider is a
pure presenter, so theme *state* lives with you.

### Fonts

`styles.css` `@import`s IBM Plex Sans and Mono from Google Fonts. To self-host,
skip `fonts.css` and redefine `--ny-font-sans` / `--ny-font-mono`.

## Tokens

All ~140 tokens live in one file: `src/styles/tokens.css`. Two layers —
primitives (`--ny-ink-*`, `--ny-paper-*`) exist so the semantic layer has
something coherent to derive from, and **components may only reference the
semantic layer.**

| Family | Notes |
|---|---|
| Surface / border / text | Flip with the theme |
| Accent, feedback | `{tone}`, `{tone}-subtle` (tint), `{tone}-text` (ink on tint), `text-on-{tone}` (ink on solid) |
| Data | `--ny-positive` / `--ny-negative` / `--ny-neutral` — **theme-invariant on purpose**: teal always means up |
| Spacing | 4px base, **each token named for the pixel value it holds** (`--ny-space-12` is 12px) |
| Spacing roles | `--ny-inset`, `--ny-inset-compact`, `--ny-stack`, `--ny-gutter` — prefer these for component chrome |
| Type | 9 steps in `rem`, so the scale honours the reader's browser font size |
| Radii, elevation, motion, controls, layering | `--ny-radius-*`, `--ny-shadow-*`, `--ny-duration-*`, `--ny-control-height-*`, `--ny-z-*` |

`src/tokens.ts` mirrors the values the charts need as JS strings — SVG `stroke`
and `fill` attributes cannot read a custom property. `src/tokens.parity.test.ts`
asserts the two never drift.

**Breakpoints are 480 / 768 / 1024 / 1280.** `--ny-bp-*` exists for JS and
documentation only: a custom property inside a `@media` condition is invalid CSS
and fails *silently*, so stylesheets hardcode those four numbers and a test
enforces it.

## Layout and responsiveness

`Container`, `Grid`, `GridItem` and `Stack` are the whole system. They write
inline custom properties from their props, which four static media queries read
— four media queries for the entire library, no per-breakpoint class explosion,
SSR-safe.

```jsx
<Grid columns={{ base: 1, md: 12 }} gap={{ base: 8, md: 16 }}>
  <GridItem span={{ base: 1, md: 8 }}>…</GridItem>
</Grid>
```

Components themselves adapt with **container queries**, not media queries: they
respond to the space they are actually in, so a `HeatGrid` in a narrow panel on
a wide monitor reflows correctly.

## Components

**Charts (6)** — SankeyFlow, RotationRing, Sparkline, HeatGrid, RotationMatrix,
BreakdownBar.

**UI (43)** — layout (Container, Grid, GridItem, Stack, Panel, PanelHeading,
PageHeader, MacroStrip), typography (Text, Heading, VisuallyHidden, Eyebrow),
controls (Button, InlineAction, Select, SegmentedControl, Tabs, ThemeToggle),
forms (Input, Textarea, Checkbox, Radio, RadioGroup, Switch, Field, Label),
overlays (Dialog, Tooltip, Popover, Toast), feedback (Badge, Alert, Spinner,
Skeleton, Avatar) and data display (StatTile, DataRow, NarrativeItem,
MomentumCard, Legend, Table, Breadcrumb, Pagination).

Run `npm run storybook` for the live catalogue.

### Conventions worth knowing

- **Form controls take `value` or `defaultValue`** — both work. `Tabs`,
  `SegmentedControl` and `Select` are controlled-only.
- **Wrap inputs in `Field`** rather than wiring labels by hand; it generates the
  ids and the `aria-describedby` / `aria-invalid` links.
- **Components never format numbers.** Pass a formatted string plus the signed
  raw value that picks the colour. `formatDelta` and `formatCompact` emit U+2212
  MINUS so signed columns stay optically flush.
- **Charts measure themselves — do not hardcode a `width`.** `SankeyFlow` and
  `RotationRing` lay out in real CSS pixels because their labels are HTML and
  must not scale, so they read their own container. Pass a `width` only to pin a
  chart to a fixed size, which will overflow a narrower parent.
- **Give `HeatGrid` and `RotationMatrix` a `label`.** They render a real
  `role="grid"`, and a grid with no accessible name cannot be placed.
- **`Sparkline`'s fill follows its baseline** — closed on the zero line with
  `baseline`, on the bottom of the plot without it. Pass `baseline` when the sign
  is the point.
- **`StatTile` only works inside `MacroStrip`.**

## Utilities

`deltaColor` / `deltaColors` · `formatDelta` / `formatCompact` / `formatPercent`
· `useMeasure` / `useEscapeKey` / `useControllableState` / `useRovingFocus` /
`useAnchoredPosition` / `useTopLayer` · `sankeyLayout` / `ringLayout` / `heatStyle` /
`walkSeries` / `seriesPath`. `walkSeries` is fixture plumbing — a deterministic
demo series for a chart with no real data yet — not design-system API.

## Scripts

| | |
|---|---|
| `npm run dev` | showcase app on Vite |
| `npm run storybook` | component catalogue |
| `npm run build:lib` | the publishable `dist/` |
| `npm run check` | **the gate** — biome, tsc and vitest, all zero-error |
| `npm test` | vitest only |
| `npm run format` | biome autofix |

`styles.css` is a single stylesheet for the whole library (`cssCodeSplit` is
off), which is what the design-sync consumer expects. It is ~55 kB raw, ~8.5 kB
gzipped.

## Accessibility

- **One focus ring for the system**, in `base.css` behind `--ny-focus-ring`.
  Components never declare their own.
- **Disabled is never opacity-based** — opacity compounds through nesting and
  destroys the contrast the palette was chosen for.
- **Composite widgets implement roving focus**: `Tabs`, `SegmentedControl`,
  `RadioGroup` and `Pagination` are one tab stop that arrow keys move within,
  with Home/End, per the WAI-ARIA APG.
- **Overlays use the browser top layer** — `Dialog` is a native `<dialog>` with
  `showModal()`, so the focus trap, Escape handling and scrim are the browser's,
  not ours. Nothing sets `z-index`.
- `prefers-reduced-motion` collapses every transition, globally.
- Every component has an axe assertion in its test. Colour contrast is verified
  visually instead, because jsdom performs no layout and axe cannot compute it.
