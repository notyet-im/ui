# Changelog

Notable changes to `@notyet.im/ui`. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows
[semver](https://semver.org/), with the `0.x` caveat that a minor bump may break
you until 1.0.

## [Unreleased]

## [0.2.0] — 2026-08-13

### Fixed

- **The README claimed `Pagination` implements roving focus. It never has.**
  The accessibility section listed it alongside `Tabs`, `SegmentedControl` and
  `RadioGroup` as "one tab stop that arrow keys move within" — but
  `Pagination.tsx` has no key handling of any kind, and never did. The claim was
  wrong from the commit that wrote it. `Pagination` is a `<nav>` of independent
  page links rather than a single composite control, so a tab stop per link is
  correct; the documentation now says that, and says why.

- **`seriesPath` emitted an unparseable `d` for a series too short to draw.**
  An empty series produced an `area` beginning with `L`, which browsers reject
  outright (`Expected moveto path command`); a single point divided by zero and
  produced `NaN` coordinates. Both now draw nothing, which is what they meant.
  `StatTile` had guarded this per-caller and `MomentumCard` had not — that is
  the shape of a defect that belongs in the primitive.

- **`ringLayout` scaled chords against pairs it never drew.** The maximum was
  taken over every pair handed in and only then filtered to `from !== to` with a
  positive value and two placed endpoints — so one large intra-region rotation
  thinned every chord actually on screen, against a number nothing explained.
  It now scales over the drawn set.
- **`HeatGrid`'s roving active cell is clamped to the current bounds.** Only the
  cell matching it is tabbable, so a `rows`/`columns` list that shrank under a
  stored index took the whole grid out of the tab order.

### Changed

- **`Sparkline` renders nothing below two points**, rather than an empty
  `<svg>` that still reserves its width. `seriesPath` refusing to emit a path is
  the maths; whether a chart with nothing to draw should still occupy space is
  the component's call, and it now makes it once instead of leaving three
  callers to disagree. `StatTile` already hid the chart; `MomentumCard` and the
  showcase left a 60x24 hole, and no longer do.

### Added

- **`HeatGrid` takes a `roving` prop** — one tab stop for the whole grid, with
  arrow keys moving within it, per the WAI-ARIA APG grid pattern. The library
  already applied roving focus to `Tabs`, `SegmentedControl` and `RadioGroup`,
  so a grid that was N separate tab stops was its own inconsistency: a 7x9 grid
  put 63 of them between the chart and whatever followed it.

  **It defaults to `onSelect != null`** — the same condition that decides
  whether a cell holds a `<button>` at all. A grid either has focusable cells
  and should move between them the way the APG says, or it has none and the
  question is moot; there is no third case worth asking the caller about, and
  asking only moves an accessibility decision somewhere nobody remembers to make
  it. The demo's own 63-cell grid proved the point by not opting in. Pass
  `roving={false}` for per-cell tab stops.
- **`BreakdownBar` takes an explicit `color`**, overriding `tone`, exactly as
  `DataRow`'s `valueColor` already did. A panel can hold two quantities that
  must not share the delta scale, and the only way to say so is to paint one of
  them off it. Because the colour is written inline, a consumer without this
  prop had no route but an `!important` rule against `.ny-breakdown__value` and
  `.ny-breakdown__fill` — reaching past the API into internal class names,
  which is precisely what the prop removes the need for.
- **`Panel` takes `fill`**, filling the height of what it sits in. `GridItem`
  stretches to its row but is a block box, so a panel inside one was only as
  tall as its own content and a row of panels came out ragged — visible in this
  repo's own tracker showcase. A consumer cannot supply it: a height set from
  `className` is not measured against the panel's padding and border.
- **`MomentumCard` takes `selected`** — sets `aria-pressed` and a ring that
  beats `:hover`. A consumer cannot express either from outside: a single-class
  rule loses to `.ny-momentum:hover` on specificity, so pointing at the selected
  card erased its ring, and `className` cannot carry ARIA at all. `HeatGrid` has
  `selectedKey`, `RotationRing` has `selectedId`; a card had nothing.
- **`BreakdownBar` takes `valueColor`**, the name `DataRow` uses, so the figure
  can stay at reading contrast while the fill stays quiet.
- **`Text` takes `mono`.** The monospace face is a role this system uses
  throughout its own components, but `Text` could only offer `numeric` (tabular
  figures), so every consumer hand-wrote `font-family: var(--ny-font-mono)`.
- **`RotationMatrix`'s `diagonalText` accepts `null`**, rendering the real value
  on the diagonal. `''` could not say this — an empty string still blanks the
  cell — so a caller whose diagonal carries real intra-market data had to bypass
  the wrapper and compose `HeatGrid` by hand.
- **`useRovingGrid`**, the two-dimensional counterpart to `useRovingFocus`.
  Arrows **clamp** at the edges rather than wrapping — in a grid both axes
  carry meaning, so wrapping off the end of a row crosses a row boundary and a
  column boundary in one keystroke and reads as a glitch, where wrapping a
  tablist does not. Ctrl+Home and Ctrl+End are the deliberate jumps to the
  corners. The active cell also tracks focus, so a click and the arrow keys
  cannot disagree about where the user is.

## [0.1.1] — 2026-08-12

No functional change. The library code, styles and types are identical to
`0.1.0`.

### Changed

- **First release published by CI, with build provenance.** `0.1.0` was
  published by hand and carries no attestation; from this version on, releases
  are cut by pushing a `v*` tag and npm records a signed link from the tarball
  back to the commit and workflow that built it. Verify with
  `npm audit signatures`.

## [0.1.0] — 2026-08-12

First public release.

### Added

- **49 components in two categories.** `UI` for building interfaces — layout
  primitives (`Container`, `Grid`, `GridItem`, `Stack`), typography (`Text`,
  `Heading`, `VisuallyHidden`), forms (`Input`, `Textarea`, `Select`,
  `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Field`), overlays (`Dialog`,
  `Popover`, `Tooltip`, `Toast`), navigation (`Tabs`, `SegmentedControl`,
  `Breadcrumb`, `Pagination`), and status (`Badge`, `Alert`, `Spinner`,
  `Skeleton`, `Avatar`). `Charts` for encoding data — `Sparkline`, `HeatGrid`,
  `RotationMatrix`, `BreakdownBar`, `MomentumCard`, `SankeyFlow`,
  `RotationRing`.
- **A semantic token layer.** ~130 `--ny-*` custom properties on a 4px spacing
  scale and a 9-step `rem` type scale, in light and dark themes. Components
  reference only the semantic layer, never a primitive — enforced by a test.
- **Overlays on the browser top layer.** `Dialog` is a native `<dialog>` with
  `showModal()`; tooltips and popovers use the `popover` attribute. No portals,
  no focus-trap code, and no `z-index` anywhere in the stylesheet.
- **Roving focus** on `Tabs`, `SegmentedControl` and `RadioGroup`, per the
  WAI-ARIA APG. (This entry originally also listed `Pagination`, which was never
  accurate — corrected in 0.2.0 rather than left standing as a false
  accessibility claim.)
- ESM and CJS builds with type declarations for each, plus `styles.css` and an
  optional `fonts.css`.

### Notes

- React 19 or later is required — components take `ref` as a plain prop rather
  than through `forwardRef`.
- `<ThemeProvider>` is required. It defines the custom properties every
  component styles itself with; outside it they render unstyled.
- Zero runtime dependencies.

[Unreleased]: https://github.com/notyet-im/ui/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/notyet-im/ui/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/notyet-im/ui/releases/tag/v0.1.0
