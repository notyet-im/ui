# `--cf-*` → `--ny-*` migration map

The authoritative table for the rename sweep. **This is a semantic remap, not a
find-and-replace** — the type scale collapses 12→9, radii 8→7, and several
spacing values genuinely change. A naive `sed` produces valid CSS with the wrong
visuals and nothing catches it.

Delete this file once the sweep has landed and been verified.

## Colour — values unchanged, names semantic

| Old | New | Value |
|---|---|---|
| `--cf-bg` | `--ny-bg` | unchanged |
| `--cf-panel` | `--ny-surface` | unchanged |
| `--cf-panel-2` | `--ny-surface-sunken` | unchanged |
| `--cf-line` | `--ny-border` | unchanged |
| `--cf-text` | `--ny-text` | unchanged |
| `--cf-dim` | `--ny-text-muted` | unchanged |
| `--cf-dim-2` | `--ny-text-subtle` | unchanged |
| `--cf-inflow` | `--ny-positive` | unchanged (`#2fbfa8`) |
| `--cf-outflow` | `--ny-negative` | unchanged (`#e0703f`) |
| `--cf-neutral` | `--ny-neutral` | unchanged (`#7f8a99`) |

Focus rings previously used `--cf-inflow` directly. They now use `--ny-focus-ring`
(which defaults to `--ny-accent`, itself the same teal) — **decoupled on purpose**, so
changing the data-positive colour never moves the focus ring.

## Typography — 12 steps → 9, px → rem

| Old | px | New | px |
|---|---|---|---|
| `--cf-text-micro` | 10.5 | `--ny-font-size-2xs` | 11 |
| `--cf-text-tiny` | 11 | `--ny-font-size-2xs` | 11 |
| `--cf-text-xs` | 11.5 | `--ny-font-size-xs` | 12 |
| `--cf-text-sm` | 12 | `--ny-font-size-xs` | 12 |
| `--cf-text-base` | 12.5 | `--ny-font-size-sm` | 13 |
| `--cf-text-md` | 13 | `--ny-font-size-sm` | 13 |
| `--cf-text-lg` | 13.5 | `--ny-font-size-md` | 14 |
| `--cf-text-xl` | 14.5 | `--ny-font-size-md` | 14 |
| `--cf-text-2xl` | 15 | `--ny-font-size-lg` | 16 |
| `--cf-text-3xl` | 18 | `--ny-font-size-xl` | 18 |
| `--cf-text-4xl` | 25 | `--ny-font-size-2xl` | 22 |
| `--cf-text-5xl` | 27 | `--ny-font-size-3xl` | 28 |

`--ny-font-size-4xl` (36px) is new — no old equivalent.

Tracking: `kicker` (0.14em) and `label` (0.12em) both collapse to `--ny-tracking-wider`
(0.12em); `tile` (0.1em) → `--ny-tracking-wide` (0.08em); `title` (-0.02em) →
`--ny-tracking-tight`. The two hardcoded `-0.01em` values → `--ny-tracking-tight`.

New, replacing hardcoded literals: `--ny-line-height-{tight,snug,normal}` = 1.2 / 1.35 / 1.5
(replaces the 4 hardcoded 1.2/1.28/1.45) and `--ny-font-weight-{regular,medium,semibold}` =
400 / 500 / 600 (replaces all 15 hardcoded).

## Spacing — odd 9-step scale → 4px base, named by value

Old scale could not express a 4/8px rhythm, which is why 10 of the 16 px literals in use
had no token at all. New rule, mechanical: **any px literal in `margin`/`padding`/`gap`
becomes `--ny-space-<that value>`; if the value has no token, round to the nearest.**

| Old | px | New | px |
|---|---|---|---|
| `--cf-space-1` | 3 | `--ny-space-4` | 4 |
| `--cf-space-2` | 5 | `--ny-space-4` | 4 |
| `--cf-space-3` | 7 | `--ny-space-8` | 8 |
| `--cf-space-4` | 9 | `--ny-space-8` | 8 |
| `--cf-space-5` | 11 | `--ny-space-12` | 12 |
| `--cf-space-6` | 14 | `--ny-space-12` | 12 |
| `--cf-space-7` | 16 | `--ny-space-16` | 16 |
| `--cf-space-8` | 18 | `--ny-space-16` | 16 |
| `--cf-space-9` | 24 | `--ny-space-24` | 24 |

Literals found in the audit → token: `1`→`--ny-space-px`, `2`→`2`, `3`/`4`/`5`→`4`,
`6`/`7`→`8`, `9`/`10`/`11`→`8` or `12` (judge by role), `12`/`13`→`12`, `15`/`16`/`18`→`16`,
`30`→`32`.

Semantic aliases — use these for component chrome rather than raw steps:
`--ny-inset` (16px, default padding), `--ny-inset-compact` (8px, dense controls),
`--ny-stack` (12px, vertical rhythm), `--ny-gutter` (24px, 16px below 768).

## Radii — 8 role-named → 7 size-named

| Old | px | New |
|---|---|---|
| `--cf-radius-swatch` | 2 | `--ny-radius-xs` |
| `--cf-radius-bar` | 3 | `--ny-radius-sm` (4) |
| `--cf-radius-cell` | 4 | `--ny-radius-sm` |
| `--cf-radius-control` | 6 | `--ny-radius-md` |
| `--cf-radius-field` | 8 | `--ny-radius-lg` |
| `--cf-radius-tile` | 9 | `--ny-radius-lg` (8) |
| `--cf-radius-strip` | 10 | `--ny-radius-xl` (12) |
| `--cf-radius-panel` | 12 | `--ny-radius-xl` |

`--ny-radius-none` and `--ny-radius-full` are new.

## Motion — renamed by speed, values preserved

| Old | New | Value |
|---|---|---|
| `--cf-ease` | `--ny-ease-standard` | unchanged |
| `--cf-duration-fade` | `--ny-duration-base` | 0.3s, unchanged |
| `--cf-duration-flow` | `--ny-duration-slow` | 0.5s, unchanged |

`--ny-duration-fast` (150ms), `--ny-ease-out`, `--ny-ease-in` are new. The two chart ribbon
morphs are tuned to 300/500ms, so those are deliberately **not** retimed.

## Sizing

| Old | New |
|---|---|
| `--cf-control-height` (34px) | `--ny-control-height-md` (34px, still the default) |

New: `--ny-control-height-sm` (28), `-lg` (44), `--ny-control-padding-x-{sm,md,lg}`,
`--ny-icon-size-{sm,md,lg}`.

## Entirely new — no old equivalent

- **Surface states:** `--ny-surface-hover`, `--ny-surface-active`, `--ny-surface-raised`,
  `--ny-surface-selected`, `--ny-overlay`
- **Border:** `--ny-border-strong`
- **Text:** `--ny-text-disabled`, `--ny-text-inverse`, `--ny-text-on-accent`
- **Accent:** `--ny-accent`, `-hover`, `-active`, `-subtle`
- **Feedback:** `--ny-{success,warning,danger,info}` × `{solid, -subtle, -text}`
- **Focus:** `--ny-focus-ring`, `-width`, `-offset`
- **Elevation:** `--ny-shadow-{none,sm,md,lg}` (theme-aware)
- **Layering:** `--ny-z-{base,sticky,dropdown,toast}`
- **Breakpoints:** `--ny-bp-{sm,md,lg,xl}` — ⚠️ **JS/docs parity only.** Custom properties do
  not work inside `@media` conditions; `@media (min-width: var(--ny-bp-md))` is invalid CSS
  and fails silently. Media queries hardcode 480/768/1024/1280 and nothing else.

## Class prefixes

`.cf-*` → `.ny-*` (97 classes, BEM shape preserved).
`.cft-*` → `.ny-showcase-*` (25 classes, demo only).

## Identifiers

| Old | New |
|---|---|
| `flowColors` | `deltaColors` |
| `flowColor(v)` | `deltaColor(v)` |
| `FlowDirection` | `DeltaDirection` |
| `flowColors.inflow` / `.outflow` | `deltaColors.positive` / `.negative` |
| `formatFlow` | `formatDelta` |
| `formatBillions` | `formatCompact` |
| `CapitalFlowTracker{,Props}` | `TrackerShowcase{,Props}` |
| `CapitalFlowDS` (global) | `NotYetUI` |
| `@notyet/capital-flow-ds` | `@notyet/ui` |

**Unchanged on purpose:** `SankeyFlow`, `FlowLink`, `SankeyLayout`, `FlowChart.css` — "flow"
is generic dataviz vocabulary, not finance.
