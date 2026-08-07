# design-sync notes — @notyet/ui

Repo-specific knowledge for future syncs. Read this before running the driver.

## Setup facts

- **Shape**: storybook. Config dir `.storybook/`, reference built to
  `.design-sync/sb-reference` (gitignored — rebuild it whenever stories or DS
  source change; they must move together).
- **Entry**: the package is its own source repo, so `node_modules/@notyet/ui`
  does not exist — the converter needs `--entry dist/index.js`, and
  `--node-modules ./node_modules` (repo root).
- **Build order**: `npm run build:lib` must run before the storybook reference —
  stories import from `../tokens` and `../lib`, but the bundle comes from `dist/`.
- **Gate before syncing**: `npm run check` (biome → tsc → vitest). It must exit 0.

## The two-category contract — the thing most likely to break silently

Story titles must be **exactly two segments**: `UI/<Name>` or `Charts/<Name>`,
where the second segment exactly matches an export from `src/index.ts`.

`titleParts` (`.ds-sync/lib/common.mjs:72-91`) scans a title's segments
right-to-left for the first that is a real export, then takes **the segment
before it** as the group. So `UI/Forms/Button` yields a group called `forms` and
silently creates a third category; a title that resolves to no export vanishes
from the sync **with no error at all**.

`src/stories.lint.test.ts` guards all of this and runs in `npm run check`. If you
add a component, it will tell you what you forgot. Trust it over your memory.

⚠️ **Never name a Foundations page after a real export.** `titleMap` is keyed by
the derived component name, so nulling a docs page called `Grid` would also null
the real `UI/Grid` component. The docs page is `Foundations/Tokens` for this
reason.

## Placement rule (settled — do not relitigate)

*Charts = the component's primary job is a geometric encoding of a data series.
UI = everything else.*

- **Charts (6):** SankeyFlow, RotationRing, Sparkline, HeatGrid, RotationMatrix,
  BreakdownBar
- **UI (47):** everything else. StatTile and MomentumCard embed a Sparkline but
  are KPI tiles, so they are UI. MacroStrip is a container. Legend renders no
  encoding.

## Known warnings — triaged, expect them again

- `[FONT_REMOTE] "IBM Plex Sans", "IBM Plex Mono"` — the DS loads fonts from
  Google Fonts via an `@import` in `styles.css`. Expected, not a defect:
  claude.ai/design reaches the font host at runtime. It does make local render
  checks slower, and a transient `page.goto Timeout` on one component is usually
  this, not a broken preview — re-run validate before chasing it.
- `[ASSETS_BLOCKED] example.invalid` — **a false positive.** `Avatar.stories.tsx`
  deliberately points one story at `https://example.invalid/missing.png` to prove
  the initials fallback. `.invalid` is a reserved TLD that never resolves
  anywhere (RFC 2606), so it fails identically for real users. Do **not** re-run
  compare outside the sandbox chasing this.
- `docs: 0/53 components matched` — the repo has no separate MDX per component;
  `.prompt.md` is generated from the `.d.ts` and stories, which is sufficient.

## Overlay stories: the storybook reference is blank, and that is correct

`Dialog`, `Tooltip`, `Popover` and `Toast` render in the **browser top layer**
(native `<dialog>` + `showModal()`, and the `popover` attribute). The top layer
is attached to the *document*, not to the story root — so Storybook's
element-box crop cannot contain it and the **reference panel captures blank**
while the preview (which captures the full viewport) shows the overlay
correctly.

This is a reference-side capture artifact, not a component defect. Grade these
`match` on the preview render, and check the panels agree wherever both are
visible. Two stories prove the mechanism rather than assuming it:
`Dialog / Scrolling (long content)` and `Toast / Top placement` are anchored
near the top of the viewport, fall *inside* the crop, and then agree exactly.

Every overlay has an "Open (no interaction)" story specifically so a static
capture has something to show. Stories that need a click legitimately capture
with the overlay closed in **both** panels — that is a `match`, not a defect.

## Card overrides in `config.json`

- `cardMode: "single"` — Dialog, Popover, Tooltip, Toast. An open overlay paints
  over sibling cells in the grid card.
- `cardMode: "column"` — SankeyFlow, RotationRing, Sparkline (fixed `width={880}`
  charts), Table (wider than a cell), Heading (the `Truncated` story overflows).

## Re-sync risks — what to watch

- **New components need their own story title AND a barrel export.** The lint
  test catches both; run `npm run check` before syncing.
- **Chart stories hardcode `width={880}`.** `SankeyFlow` and `RotationRing`
  require a measured pixel width (their labels are HTML and must not scale). If
  those stories change width, re-check `[GRID_OVERFLOW]` and the `cardMode`s.
- **Synthetic data is seeded, not random.** `src/tracker/data.ts` + the PRNG in
  `src/lib/prng.ts` make every figure deterministic, so captures are stable. If
  anyone introduces `Math.random()` or `new Date()` into a story, grades will
  churn every capture — pin the values instead.
- **`useId` is used** (Field, RadioGroup, Dialog, Tooltip, Popover, Table
  caption) and has been **verified not to churn**: two consecutive builds of the
  same source produced identical `renderHashes` for all 53 components, and
  identical `styleSha`, `bundleSha12` and `sourceKeys`. React ids are
  deterministic per tree shape. If hashes ever do churn on a no-change run,
  re-run that double-capture first — it takes two builds and rules `useId` in or
  out immediately.
- **`container-type: inline-size` re-parents absolutely-positioned descendants.**
  `Container`, `Panel` and `Card` set it. If an absolutely-positioned child ever
  lands in the wrong place, that is the first thing to check —
  `.ny-select__chevron` is the known precedent.
- **The showcase is excluded by choice.** `TrackerShowcase` is not exported from
  `src/index.ts` and is nulled in `titleMap`. To ship it, export it first (which
  pulls the whole app plus ~22 KB of i18n data into the library bundle).

## Upload facts

- Project: `NOT YET Dashboard Design System`
  (`08a144c3-b949-4751-9eef-342d9527b153`), pinned in `config.json`.
- **Two remote files are app-generated, not build output**: `_ds_manifest.json`
  (compiled from each preview's `@dsCard` marker) and `_adherence.oxlintrc.json`.
  They appear in `list_files` but are not in `ds-bundle/`, and they sit outside
  the plan's delete globs. Do **not** treat them as orphans during reconciliation.
- The repo has no `fonts/` or `tokens/` directory — fonts come from the remote
  `@import` and tokens live inside `_ds_bundle.css`. Empty `guidelines/` and
  `tokens/` dirs in the build are expected.
- **The 2026-08 rebrand renamed the global** from `window.CapitalFlowDS` to
  `window.NotYetUI`, and every component directory changed group. That sync had a
  large `deletePaths` (all 22 old component dirs) and broke any artifact
  previously authored against the old global. Not repeatable — noted so the size
  of that diff isn't mistaken for a bug later.
