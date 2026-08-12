# Changelog

Notable changes to `@notyet.im/ui`. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows
[semver](https://semver.org/), with the `0.x` caveat that a minor bump may break
you until 1.0.

## [Unreleased]

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
- **Roving focus** on `Tabs`, `SegmentedControl`, `RadioGroup` and `Pagination`,
  per the WAI-ARIA APG.
- ESM and CJS builds with type declarations for each, plus `styles.css` and an
  optional `fonts.css`.

### Notes

- React 19 or later is required — components take `ref` as a plain prop rather
  than through `forwardRef`.
- `<ThemeProvider>` is required. It defines the custom properties every
  component styles itself with; outside it they render unstyled.
- Zero runtime dependencies.

[Unreleased]: https://github.com/notyet-im/ui/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/notyet-im/ui/releases/tag/v0.1.0
