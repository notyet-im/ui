# NotYet UI — overhaul task list

Plan: `~/.claude/plans/splendid-twirling-sky.md`. Branch: `notyet-ui-overhaul`.

**Ownership rule:** one file has exactly one owner per wave. A collision here is a
silent last-write-wins overwrite, not a merge conflict — check the ownership table
in the plan before touching a shared file.

---

## Phase 0 — Safety net and toolchain (serial, blocks everything)

- [x] `git init` + pristine baseline commit
- [x] Archive pre-rebrand visual baseline → `.design-sync/.baseline/` (22 renders + anchor)
- [x] Snapshot `_ds_sync.json`
- [x] Working branch `notyet-ui-overhaul`
- [x] Storybook 9.1.20 → **10.5.7** (automigration: `backgrounds.disable` → `.disabled`)
- [x] Add devDeps: biome 2.5.7, vitest 4.1.10, jsdom, testing-library ×3, axe-core
- [x] Storybook addons: `@storybook/addon-a11y`
- [x] `biome.jsonc` — no semicolons, single quotes, 2-space, trailing commas, lineWidth 110
- [x] `biome check --write` once over all existing files (45 reformatted)
- [x] `peerDependencies` react/react-dom `>=18` → `>=19` (required for ref-as-prop)
- [x] Scripts: `lint`, `format`, `test`, `test:watch`, `check`
- [x] `vitest.config.ts` + `src/test/{setup.ts,axe.ts,harness.test.tsx}`
- [x] **Gate:** biome ✓ · tsc ✓ · vitest 3/3 ✓ · build:lib ✓ · build-storybook ✓

### Phase 0 deviations from the plan (deliberate)

- **Dropped `@storybook/addon-vitest`.** It requires Vitest browser mode + Playwright to run
  stories as tests. Plain Vitest + jsdom + Testing Library covers the behaviour and a11y
  testing the plan actually calls for, at a fraction of the setup. Charts stay visually
  verified through design-sync, as planned.
- **Dropped `vitest-axe`** in favour of `axe-core` + a 20-line local helper
  (`src/test/axe.ts`). One less dependency that can rot; `color-contrast` is disabled there
  because jsdom does no layout, so contrast is verified visually via design-sync instead.
- **`biome.json` → `biome.jsonc`** so the two rule-disables can carry their rationale inline.
- **Two lint rules off, with reasons in the config:** `a11y/useSemanticElements` (Tabs and
  SegmentedControl put `role="tab"`/`"radio"` on `<button>` deliberately — that is the APG
  pattern) and `complexity/noImportantStyles` (the `prefers-reduced-motion` block must beat
  every component transition).

### Fixed in passing (Biome surfaced real bugs)

- **`FlowChart.css` — `font: inherit` was silently resetting `line-height: 1.28`** on chart
  labels, so the intended line-height had never applied. Reordered.
- **The two chart `<svg>`s are now `aria-hidden`** — correct, since `FlowChart.css:28`
  already documents that the accessible, keyboard-reachable path is the label `<button>`s.
- `IconButton.stories.tsx` decorative icons given `aria-hidden`.

## Phase 1 — Token foundation (serial, 1 owner) — **done**

Merged with Phase 2 into one push: both were single-owner and splitting them would
have meant writing throwaway intermediate code (a compat shim used for one commit).

- [x] Spacing: 4px base, value-named `--ny-space-{0,px,2,4,8,12,16,20,24,32,40,48,64}`
- [x] Aliases: `--ny-gutter` / `--ny-inset` / `--ny-inset-compact` / `--ny-stack`
- [x] Type: 9 steps in `rem`, + line-height / font-weight / tracking tokens
- [x] Color: ink/paper primitives + semantic layer + 12 feedback + accent
- [x] Focus: `--ny-focus-ring{,-width,-offset}`, one rule in `base.css`
- [x] Radii 8→7 (`none`…`full`), elevation ×4, z-index ×4, motion renamed by speed
- [x] Sizing `--ny-control-height-{sm,md,lg}` = 28/34/44 (34 stays default)
- [x] Breakpoints `--ny-bp-*` (JS/docs parity only — **never** inside `@media`)
- [x] `tokens.parity.test.ts` — CSS ↔ TS contract, 10 assertions incl. two invariants
- [x] `TOKEN-MAP.md` — the authoritative old→new table

## Phase 2 — Rename sweep — **done**

Driven from `TOKEN-MAP.md` as a table of decisions, with a hard assertion that no
`--cf-*` survives the token pass before any prefix rewriting runs.

- [x] `--cf-*`→`--ny-*` across 42 files (semantic remap, not find/replace)
- [x] `.cf-*`→`.ny-*` (97 classes), `.cft-*`→`.ny-showcase-*` (25 classes)
- [x] `CapitalFlowTracker{,Props}`→`TrackerShowcase{,Props}` + file renames
- [x] `flowColors`→`deltaColors`, `flowColor()`→`deltaColor()`, `FlowDirection`→`DeltaDirection`
- [x] `formatFlow`→`formatDelta`, `formatBillions`→`formatCompact`
- [x] `CapitalFlowDS`→`NotYetUI`, `@notyet/capital-flow-ds`→`@notyet/ui`
- [x] 7 duplicated focus blocks deleted; flow label kept a slim documented override
- [x] 15 font-weights, 4 line-heights, 2 trackings, 38 spacing literals → tokens
- [x] Panel (worst offender at 30% token discipline) now uses `--ny-inset` / `--ny-stack`
- [x] **Gate:** biome ✓ · tsc ✓ · vitest 13/13 ✓ · build:lib ✓ · zero `cf-`/`CapitalFlow`
- [ ] **Gate:** diff renders vs `.design-sync/.baseline/`

> **Deferred:** the 49 deprecated `--cf-*` aliases. `globalName` changes in the same
> release, so any existing artifact breaks on the JS side regardless — a CSS-only shim
> buys nothing. Revisit only if someone reports hand-written CSS in a live artifact.

## Phase 3 — Layout primitives + hooks (2 agents, parallel)

- [ ] 3A `Layout.tsx`/`.css` — Container, Grid, GridItem, Stack (inline custom props + 4 media queries)
- [ ] 3A `Text.tsx`/`.css` — Text, Heading, VisuallyHidden
- [ ] 3B `src/hooks.ts` — `useControllableState`, `useRovingFocus`, `useAnchoredPosition` (then frozen)

## Phase 4 — Components (8 agents, concurrent)

New — quad each (`X.tsx` + `X.css` + `X.stories.tsx` + `X.test.tsx`):

- [ ] 4A Forms core — Button, Input, Textarea, Field/Label/HelpText/ErrorText
- [ ] 4B Selection — Checkbox, Radio, RadioGroup, Switch
- [ ] 4C Overlays — Dialog, Tooltip, Popover, Toast (native `<dialog>` / `popover`)
- [ ] 4D Status — Badge, Alert, Spinner, Skeleton, Avatar
- [ ] 4E Data/nav — Card, Table, Breadcrumb, Pagination

Retrofit — `disabled`, roving focus, aria wiring, `@container` reflow, 2-segment titles, tests:

- [ ] 4R1 Panel, PanelHeading, PageHeader, MacroStrip, StatTile, DataRow, NarrativeItem
- [ ] 4R2 SegmentedControl, Tabs, Select, IconButton, GhostButton, Eyebrow, Legend, ThemeToggle
- [ ] 4R3 Sparkline, HeatGrid, RotationMatrix, BreakdownBar, MomentumCard, SankeyFlow, RotationRing

## Phase 5 — Two categories, integration, docs (serial)

- [ ] Retitle every story to exactly 2 segments (`UI/X`, `Charts/X`)
- [ ] Story-title lint test (3 segments ⇒ silent third group)
- [ ] Split `foundations.stories.tsx` → `Foundations/{Color,Typography,Spacing,Elevation,Layout}`
      — **never** `Foundations/Grid`, it would null the real `UI/Grid`
- [ ] Rebuild `src/index.ts` from the Phase 4 manifests
- [ ] `package.json` name/description, `README.md`
- [ ] `.design-sync/config.json` — `pkg`, `globalName: NotYetUI`, `titleMap`, `Table` override
- [ ] Rewrite `.design-sync/conventions.md` + re-validate every name against the build
- [ ] Rebuild showcase on Container/Grid/Stack (**acceptance test for the grid**)

## Phase 6 — Quality gate + design-sync (serial)

- [ ] `biome check .` — zero errors
- [ ] `tsc --noEmit` — zero errors
- [ ] `vitest run` — all pass (incl. parity + title lint + axe)
- [ ] `build:lib` + `build-storybook`
- [ ] Double-capture diff (guards against `useId` churning renderHashes)
- [ ] `resync.mjs` → triage → grade every preview → upload
- [ ] Update `.design-sync/NOTES.md` for the next sync
