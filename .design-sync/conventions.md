## How to build with this design system

A dark-first system for **signed financial flow**. Teal means capital arriving,
rust means capital leaving — in both themes. Every figure is monospace.

### 1. Wrap everything in `ThemeProvider` — nothing is styled without it

`ThemeProvider` is what defines the `--cf-*` custom properties. Outside it,
components render with transparent backgrounds and browser-default text,
because every colour they reference resolves to nothing. It also sets
`data-theme`, which is how the light palette is selected.

```jsx
<ThemeProvider theme="dark">   {/* "dark" | "light" */}
  <Panel>…</Panel>
</ThemeProvider>
```

There is no other provider and no required load order. `useTheme()` reads the
current theme inside it.

### 2. Styling idiom: **CSS custom properties, not utility classes**

This system has **no utility-class vocabulary** — do not invent `bg-*`, `p-*`,
or `text-*` classes; they will not resolve. The `.cf-*` classes in the
stylesheet are component-internal (`.cf-panel`, `.cf-segmented`, …) — never
apply them yourself. Style your own layout glue with inline styles or your own
CSS, reading these tokens:

| Family | Real names |
|---|---|
| Surfaces | `--cf-bg` `--cf-panel` `--cf-panel-2` `--cf-line` |
| Text | `--cf-text` `--cf-dim` `--cf-dim-2` |
| Flow (theme-invariant) | `--cf-inflow` `--cf-outflow` `--cf-neutral` |
| Type scale | `--cf-text-micro` `-tiny` `-xs` `-sm` `-base` `-md` `-lg` `-xl` `-2xl` `-3xl` `-4xl` `-5xl` |
| Fonts | `--cf-font-sans` `--cf-font-mono` |
| Radii | `--cf-radius-swatch` `-bar` `-cell` `-control` `-field` `-tile` `-strip` `-panel` |
| Spacing | `--cf-space-1` … `--cf-space-9` |
| Motion | `--cf-ease` `--cf-duration-flow` `--cf-duration-fade` |

The one utility class is `.cf-mono` (switches to the monospace face).

### 3. Rules that are easy to get wrong

- **Components never format numbers.** Pass pre-formatted strings, plus the
  signed raw value that picks the accent colour (`tone`, `changeValue`). Use the
  exported `formatFlow(millions, signed)` / `formatBillions(v)` — they emit
  U+2212 MINUS (`−`), which keeps signed columns optically flush.
- **`SankeyFlow` and `RotationRing` need a measured pixel `width`.** They lay
  out in real CSS pixels because their labels are HTML and must not scale with
  the drawing. Pass a measured number — the exported `useMeasure()` hook returns
  one. A missing or zero width renders nothing.
- **`StatTile` only works inside `MacroStrip`**, which supplies the tile
  background and the hairline rules between tiles.
- **Colour by value, not by hand:** `flowColor(value)` returns the right teal or
  rust for a signed number. `flowColors.inflow` / `.outflow` / `.neutral` are the
  literals.

### 4. Where the truth lives

Read `styles.css` and the `_ds_bundle.css` it imports for the real token values,
and `components/<group>/<Name>/<Name>.prompt.md` + `<Name>.d.ts` for a
component's exact API before using it.

### 5. Idiomatic example

```jsx
<ThemeProvider theme="dark">
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--cf-space-6)' }}>
    <PageHeader kicker="Cross-border equity flows" title="Where the hot money went" />
    <MacroStrip>
      <StatTile label="USD/JPY" value="145.9" change="+0.5%" changeValue={0.5} trend={[1, 3, 2, 5]} />
    </MacroStrip>
    <Panel padding="chart" column>
      <PanelHeading title="Region rotation matrix" subtitle="Row sold → column bought, $B" />
      <DataRow leading="←" label="from KR · Semiconductors" value={formatFlow(5300, true)} tone={1} />
    </Panel>
  </div>
</ThemeProvider>
```
