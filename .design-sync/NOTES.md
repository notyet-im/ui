# design-sync notes — @notyet.im/ui

Repo-specific knowledge for future syncs. Read this before running the driver.

## Setup facts

- **Shape**: storybook. Config dir `.storybook/`, reference built to
  `.design-sync/sb-reference` (gitignored — rebuild it whenever stories or DS
  source change; they must move together).
- **Entry**: the package is its own source repo, so `node_modules/@notyet.im/ui`
  does not exist — the converter needs `--entry dist/index.js`, and
  `--node-modules ./node_modules` (repo root).
- **Build order**: `npm run build:lib` must run before the storybook reference —
  stories import from `../tokens` and `../lib`, but the bundle comes from `dist/`.
  ⚠️ It must also run before any **manual** `package-build.mjs` invocation. The
  driver (`resync.mjs`) runs `cfg.buildCmd` for you; calling the converter
  directly does **not**. Skipping it bundles a stale `dist/`, and the symptom is
  brutal to read: previews render the *previous* version of a component while
  the storybook reference renders the current one, so compare shows a real,
  confusing mismatch that no source change explains. This has happened once —
  Panel's new header/footer slots were simply absent from every preview.
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
- ~~`[ASSETS_BLOCKED] example.invalid`~~ — **fixed at the source, should not
  recur.** `Avatar.stories.tsx` proved its initials fallback with a remote URL on
  a reserved TLD, which fired this warning on every capture and could never be
  cleared by re-running with egress. It now uses an undecodable `data:` URI:
  same `onError` path, zero network. If `[ASSETS_BLOCKED]` appears again it is a
  **real** egress problem — treat it as one.
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

## Anything `.storybook/preview.tsx` imports lands in the preview bundle

design-sync bundles `.storybook/preview` as its preview-decorator wrapper and
stubs every `@storybook/*` module with inert callables. So a Storybook API is
safe to *reference* inside that import graph and **fatal to call at module
scope**.

This has bitten once, and expensively: `.storybook/theme.ts` built both manager
palettes eagerly with `create()` from `storybook/theming/create`, and
`preview.tsx` imports it for the docs container. Merely importing the module
threw, and **all 52 component cards** failed with
`TypeError: (0 , import_create.create) is not a function`. The build and
validate stages passed; only the render check caught it.

`chromeThemes` is a memoised *function* for this reason — do not turn it back
into an eagerly-built object. If you add anything to `preview.tsx`'s import
graph that touches a Storybook API, run `package-validate.mjs` and check the
render count before assuming it is fine.

## Card overrides in `config.json`

- `cardMode: "single"` — Dialog, Popover, Tooltip, Toast. An open overlay paints
  over sibling cells in the grid card.
- `cardMode: "column"` — SankeyFlow, RotationRing, Sparkline (charts that want the
  full card width), Table (wider than a cell), Heading (`Truncated` overflows).

## Re-sync risks — what to watch

- **New components need their own story title AND a barrel export.** The lint
  test catches both; run `npm run check` before syncing.
- **Removing a component needs the remote anchor to have `sourceHashes`.**
  `deletePaths` is derived from them (`lib/remote-diff.mjs`), so a hand-written
  or truncated sidecar cannot compute deletes — the tool warns loudly rather
  than silently orphaning, but you then have to `list_files` and clean up by
  hand. Fetch the real `_ds_sync.json` whole.
- **`SankeyFlow` and `RotationRing` measure their own container.** `width` is
  optional; omitted, the component measures via `useMeasure` and draws to fit.
  They still lay out in real CSS pixels — their labels are HTML and must not
  scale — so a *hardcoded* width overflows any narrower container. That was a
  real bug: the stories passed `width={880}` inside a 916px Panel, which
  overflowed every design-tool cell. Do not reintroduce a fixed width.
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

## The package version is a placeholder — expect it in the uploaded README

`package.json` reads `0.0.0-development` on purpose. The release workflow
takes the version from the git tag and writes it in CI, so the committed value
is never the published one (see `.github/workflows/release.yml`).

The converter stamps that value into the generated README's heading, so the
design agent reads **`# NotYetUI (@notyet.im/ui@0.0.0-development)`** rather
than a real version. That is expected, not a build defect — do not "fix" it by
hand-editing the README or putting a real number back in `package.json`, which
would reintroduce the tag/manifest drift the placeholder exists to remove.

The real published version is whatever `npm view @notyet.im/ui version` says.
If that heading ever needs to be accurate, the fix belongs in the converter's
version source, not in the manifest.

## Re-sync traps (2026-09-11)

- **A component-source-only change is carried forward as verified — the driver
  will not capture it.** Pagination's `.tsx` and `.css` both changed this run
  (the native-button-border fix); its *story* did not. `sourceKeys` are keyed on
  story sources, so the diff put Pagination in `unchanged` with 43 others —
  "44 verified-by-upload (skip capture/grade)" — and it was never re-rendered
  against the storybook reference. The verdict was `ok: true` either way.

  This is the operational half of the 2026-08-11 `renderHashes` bullet below,
  which explains the *mechanism*; the consequence is what bites. It is by
  design (grades follow your sources, and `verification.canary` samples the
  rest), but it means: **if you changed how a component renders, rebuild
  `.design-sync/sb-reference` and grade that component by hand before the driver
  run.** A scoped `compare.mjs --components <Name>` plus a written
  `.grade.json` takes a minute; the alternative is shipping a component whose
  verified-by-upload stamp was earned against the previous design.

- **A skill/toolchain update alone does not invalidate grades.** `scriptsSha`
  moved this run (`489fe541dac44703` → `305b4cbe288ffd65`) while `keyRecipe`
  stayed at 7, and no component's `sourceKeys` moved because of it. Don't read a
  changed `scriptsSha` as a reason to `--force`.

## Re-sync traps (2026-08-12)

- **Renaming `pkg` re-uploads all 49 components while reporting `changed: 0`.**
  The npm rename `@notyet/ui` → `@notyet.im/ui` produced a diff of
  `unchanged: 49, changed: 0, added: 0, removed: 0, renderChurned: []` and
  `styleChanged: false` — and an upload set of *every* component. Both are
  correct and not a contradiction: the changed/unchanged split is keyed on
  `sourceKeys` (story sources, untouched), but each `.prompt.md` opens with
  `<Name> from <pkg>`, so `sourceHashes` moved for all 49. `bundle: true` and
  `aux: true` came from the version bump landing in the bundle header and README.
  Do not go hunting for a component change on a rename-only sync.

- **The local `ds-bundle/_ds_sync.json` is a valid remote anchor *only* if the
  last sync completed and nothing has rebuilt since.** Check before trusting it:
  `bundleSha12`, `styleSha`, `auxSha` and `scriptsSha` must all equal the remote
  copy fetched with `get_file`. They did here, which saved re-emitting 10 KB of
  JSON. When they don't, fetch the remote — seeding from a *rebuilt* local bundle
  makes it compare against itself and report nothing changed.

- **The conventions.md token audit has a known false positive.** The type-size
  family is written as a prefix plus separate suffixes —
  `` `--ny-font-size-` `2xs` `xs` … `` — so a `` `(--ny-[a-z0-9-]+)` `` regex
  reports the bare prefix `--ny-font-size-` as unresolved. All nine members do
  exist. Expand the family by hand before believing that one.

## Re-sync traps (2026-08-11)

- **`storybookStatic` goes stale silently, and stale grades ride on it.**
  `.design-sync/sb-reference` is *not* rebuilt by `resync.mjs` — `cfg.buildCmd`
  only runs `build:lib`. A reference four days older than the source still
  produces `ok: true` with every grade carried forward, because the carry
  decision is keyed on `sourceKeys` (story sources), which a component-only
  change does not touch. Rebuild it explicitly before trusting a compare:
  `npx storybook build -o .design-sync/sb-reference`. Doing so flips the canary
  trigger to `reference_drift` and correctly invalidates the carried grades.

- **`renderHashes` do not move when a component's own source changes.** The
  preview `.html`/`.js` are a card shell plus story args; the component code
  lives in the shared `_ds_bundle.js`. So a change to `Checkbox.tsx` shows up as
  `bundle: true` + `styling: true` and *no* per-component churn — which is
  correct, because designs render from the bundle. What does churn is a change
  to the story args, to markup the preview module inlines, or to any file that
  co-resides with other components (adding an import to `Controls.tsx` churned
  Eyebrow, InlineAction, Legend and Select together).

- **A deleted CSS block is invisible to every gate except the eye.** Folding
  `IconButton` into `Button` deleted `.ny-icon-button` and took the adjacent
  `.ny-select` block with it; `Select` then passed `tsc`, biome, 211 unit tests,
  axe, `package-validate`, and a 51/51 render check while rendering completely
  unstyled — the render check only asks whether a preview drew *something*.
  `src/styles.contract.test.ts` now asserts that every `.ny-*` class a component
  emits has a rule somewhere. Keep it: jsdom applies no stylesheets, so it is the
  only automated check that can see this class of break.

## Doc traps (2026-08-11)

- **The same rule lives in two files and they drift apart.** The "charts need a
  measured width" rule was corrected in `conventions.md` in the morning and was
  still wrong in `README.md` that evening — both are shipped to consumers, and
  neither references the other. When a component's contract changes, grep both:
  `conventions.md` becomes the uploaded README header, `README.md` ships to npm.

- **`conventions.md` names tokens by hand.** Nothing checks it. A quick audit is
  worth running whenever tokens move:

      python3 - <<'PY'
      import re, pathlib
      css = re.sub(r'/\*[\s\S]*?\*/', '', pathlib.Path('src/styles/tokens.css').read_text())
      defined = set(re.findall(r'(--ny-[a-z0-9-]+):', css))
      doc = pathlib.Path('.design-sync/conventions.md').read_text()
      named = set(re.findall(r'`(--ny-[a-z0-9-]+)`', doc))
      print(sorted(n for n in named if n not in defined))
      PY

  The `{a,b,c}` shorthand forms in the table are invisible to that check —
  `--ny-icon-size-{sm,md,lg}` stayed wrong through a token addition because the
  family is written as one string, not as members.
