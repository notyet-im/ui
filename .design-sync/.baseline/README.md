# Pre-rebrand visual baseline

Captured 2026-08-07 from the last clean design-sync run of
`@notyet/capital-flow-ds@0.1.0` (bundle `43019ecd83a8`, styleSha `d8268908…`),
immediately before the NotYet UI overhaul.

## What's here

- `<group>__<Name>.png` — 22 component renders, one per published component
- `contact-sheet-{1,2}.png` + `contact-sheets.json` — the same 22, tiled
- `_ds_sync.json` — the sync anchor as it was uploaded
- `build-meta.json` — namespace `CapitalFlowDS`, 22 components

## Why it exists

The rebrand renames `--cf-*` → `--ny-*` **and** changes token values (type
scale collapses 12→9 steps, spacing moves off its odd-numbered scale, radii
8→7). The design-sync compare loop cannot catch a regression here: it diffs the
preview render against the *storybook* render, and the rename moves both sides
identically — they stay matching while the design silently changes.

These PNGs are the only fixed reference for "what the system looked like
before". After the rename lands, diff the fresh `ds-bundle/_screenshots/`
against this directory. Differences are expected where a token value genuinely
changed (14px gaps → 12px, 13.5px text → 14px); anything else is a bug.

Component names change too — `data-display__StatTile.png` becomes
`ui__StatTile.png` — so match on the trailing component name, not the full
filename.

Delete this directory once the overhaul has shipped and been verified.
