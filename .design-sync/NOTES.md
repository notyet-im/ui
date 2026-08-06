# design-sync notes — @notyet/capital-flow-ds

Repo-specific knowledge for future syncs. Read this before running the driver.

## Setup facts

- **Shape**: storybook. Config dir `.storybook/`, reference built to
  `.design-sync/sb-reference` (gitignored — rebuild it whenever stories or DS
  source change; they must move together).
- **Entry**: the package is its own source repo, so `node_modules/@notyet/capital-flow-ds`
  does not exist — the converter needs `--entry dist/index.js`, and
  `--node-modules ./node_modules` (repo root).
- **Build order**: `npm run build:lib` must run before the storybook reference —
  stories import from `../tokens` and `../lib`, but the bundle comes from `dist/`.

## Fixes applied on the first sync

- `[GENERAL]` **One story title per component, always.** The first build produced
  only 4 component cards from 22 exported components: story files had been
  grouped by concern (`Controls/Primitives` covered Eyebrow + Select + IconButton
  + GhostButton + Legend; `Data display/Detail rows` covered four more). In the
  storybook shape the component roster comes *only* from story titles
  (`source-storybook.mjs`), so grouped titles silently drop components from the
  sync. Split into one `<Component>.stories.tsx` per exported component → 22
  cards. **If you add a component, give it its own story title or it will not
  ship.**
- `Foundations/Tokens` is a documentation page with no component export →
  excluded via `cfg.titleMap {"Tokens": null}`.
- `Showcase/Capital Flow Tracker` is the demo application, not a library export
  (it is not in `src/index.ts`) → excluded via `cfg.titleMap {"CapitalFlowTracker": null}`.
  Note the key is the *derived* name `CapitalFlowTracker`, not the spaced title —
  the converter normalises spaces out before consulting `titleMap`.
- `[GRID_OVERFLOW] wide` on SankeyFlow, RotationRing, Sparkline: their stories
  pass a fixed `width={880}` (the charts lay out in real CSS pixels, not a scaled
  viewBox), which is wider than a grid cell → `cfg.overrides.<Name>.cardMode: "column"`.
- `[RENDER_THIN]` on Select: two stories rendered an identical component. Fixed
  at the source — the stories now differ by option set and selected value.

## Known warnings — triaged, expect them again

- `[FONT_REMOTE] "IBM Plex Sans", "IBM Plex Mono"` — the DS loads fonts from
  Google Fonts via an `@import` in `styles.css` (mirrors the original prototype).
  This is expected, not a defect: claude.ai/design reaches the font host at
  runtime. It does make local render checks slower, and a transient
  `page.goto Timeout` on one component is usually this, not a broken preview —
  re-run validate before chasing it.
- `docs: 0/22 components matched` — the repo has no separate MDX/markdown docs
  per component; `.prompt.md` is generated from the `.d.ts` and stories, which is
  sufficient. Not a defect.

## Upload facts

- Project: `NOT YET Dashboard Design System`
  (`08a144c3-b949-4751-9eef-342d9527b153`), pinned in `config.json`.
- First sync uploaded 121 files / 22 components. `deletePaths` was empty.
- **Two remote files are app-generated, not build output**: `_ds_manifest.json`
  (the app compiles it from each preview's `@dsCard` marker) and
  `_adherence.oxlintrc.json`. They show up in `list_files` but are not in
  `ds-bundle/`, and they sit outside the plan's delete globs. Do **not** treat
  them as orphans during reconciliation.
- The repo has no `fonts/` or `tokens/` directory — fonts come from the remote
  `@import` and tokens live inside `_ds_bundle.css`. Empty `guidelines/` and
  `tokens/` dirs in the build are expected.

## Re-sync risks — what to watch

- **New components need their own story title** (see above). A component added to
  `src/index.ts` without its own `*.stories.tsx` title will not appear in the
  sync and nothing will error.
- **Chart stories hardcode `width={880}`.** `SankeyFlow` and `RotationRing`
  require a measured pixel width (their labels are HTML and must not scale). If
  those stories change width, re-check `[GRID_OVERFLOW]` and the `cardMode`
  overrides.
- **Synthetic data is seeded, not random.** `src/tracker/data.ts` + the PRNG in
  `src/lib/prng.ts` make every figure deterministic, so captures are stable. If
  anyone introduces `Math.random()` or `new Date()` into a story, grades will
  churn every capture — pin the values instead.
- **The tracker is excluded by choice, not by accident.** If `CapitalFlowTracker`
  should ever ship as a component, it must first be exported from `src/index.ts`
  (which would pull the whole app plus ~22 KB of i18n data into the library
  bundle) and then have its `titleMap` null removed.
