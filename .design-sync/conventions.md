## How to build with NotYet UI

A dense, dark-first system in two halves: **UI** for building interfaces, **Charts**
for encoding data. Teal means a value went up, rust means it went down — in both
themes. Every figure is monospace.

### 1. Wrap everything in `ThemeProvider` — nothing is styled without it

`ThemeProvider` defines the `--ny-*` custom properties, sets `data-theme`, and
scopes the reset and the shared focus ring. Outside it, components render with
transparent backgrounds and browser-default text, because every colour they
reference resolves to nothing.

```jsx
<ThemeProvider theme="dark">   {/* "dark" | "light" */}
  <Container><Panel>…</Panel></Container>
</ThemeProvider>
```

There is no other provider and no required load order. `useTheme()` reads the
current theme inside it.

### 2. Styling idiom: **CSS custom properties, not utility classes**

There is **no utility-class vocabulary** — do not invent `bg-*`, `p-*` or
`text-*` classes; they will not resolve. The `.ny-*` classes in the stylesheet
are component-internal (`.ny-panel`, `.ny-badge`, …) — never apply them
yourself. Style your own layout glue with the layout components below, or with
inline styles reading these tokens:

| Family | Real names |
|---|---|
| Surface | `--ny-bg` `--ny-surface` `--ny-surface-sunken` `--ny-surface-raised` `--ny-surface-hover` `--ny-surface-active` `--ny-surface-selected` `--ny-overlay` |
| Border | `--ny-border` `--ny-border-strong` |
| Text | `--ny-text` `--ny-text-muted` `--ny-text-subtle` `--ny-text-disabled` `--ny-text-inverse` |
| Accent | `--ny-accent` `--ny-accent-hover` `--ny-accent-active` `--ny-accent-subtle` `--ny-accent-text` `--ny-text-on-accent` |
| Feedback | `--ny-{success,warning,danger,info}` plus `-subtle` (tint), `-text` (ink on tint), and `--ny-text-on-{tone}` (ink on solid) |
| Data (theme-invariant) | `--ny-positive` `--ny-negative` `--ny-neutral` |
| Type size | `--ny-font-size-` `2xs` `xs` `sm` `md` `lg` `xl` `2xl` `3xl` `4xl` — in `rem`, `md` is the body default |
| Type detail | `--ny-line-height-{tight,snug,normal}` `--ny-font-weight-{regular,medium,semibold}` `--ny-tracking-{tight,normal,wide,wider}` |
| Fonts | `--ny-font-sans` `--ny-font-mono` `--ny-font-numeric` |
| Spacing | `--ny-space-{0,px,2,4,8,12,16,20,24,32,40,48,64}` — **each token is named for the pixel value it holds** |
| Spacing roles | `--ny-inset` (16) `--ny-inset-compact` (8) `--ny-stack` (12) `--ny-gutter` (24, 16 below 768px) |
| Radii | `--ny-radius-{none,xs,sm,md,lg,xl,full}` |
| Elevation | `--ny-shadow-{none,sm,md,lg}` |
| Motion | `--ny-ease-{standard,out,in}` `--ny-duration-{fast,base,slow}` |
| Controls | `--ny-control-height-{sm,md,lg}` (28/34/44) `--ny-control-padding-x-{sm,md,lg}` `--ny-icon-size-{sm,md,lg}` |
| Layering | `--ny-z-{base,sticky,dropdown,toast}` |

Prefer the **spacing roles** over raw steps for component chrome — they are what
keeps padding, margin and gutter consistent. The one utility class is `.ny-mono`
(switches to the monospace face).

### 3. Layout: use the primitives, don't hand-roll a grid

```jsx
<Container size="lg">                        {/* 720 | 960 | 1280 | full */}
  <Grid columns={{ base: 1, md: 12 }} gap={16}>
    <GridItem span={{ base: 1, md: 8 }}>…</GridItem>
    <GridItem span={{ base: 1, md: 4 }}>…</GridItem>
  </Grid>
  <Stack direction="row" gap={8} align="center">…</Stack>
</Container>
```

`columns`, `span` and `gap` accept a plain value or a `Responsive` object
(`{ base, sm, md, lg, xl }`). Breakpoints are 480 / 768 / 1024 / 1280.
**Do not write your own media queries** — components adapt to the space they are
in via container queries, and the four breakpoints live in the primitives.

### 4. Rules that are easy to get wrong

- **Components never format numbers.** Pass pre-formatted strings, plus the
  signed raw value that picks the accent colour (`tone`, `changeValue`). Use the
  exported `formatDelta(millions, signed)` / `formatCompact(v)` — they emit
  U+2212 MINUS (`−`), which keeps signed columns optically flush.
- **`SankeyFlow` and `RotationRing` need a measured pixel `width`.** They lay out
  in real CSS pixels because their labels are HTML and must not scale. The
  exported `useMeasure()` hook returns one. A missing or zero width renders nothing.
- **`StatTile` only works inside `MacroStrip`**, which supplies the tile
  background and the hairline rules between tiles.
- **Colour by value, not by hand:** `deltaColor(value)` returns the right teal or
  rust for a signed number. `deltaColors.positive` / `.negative` / `.neutral` are
  the literals.
- **Form controls take `value` or `defaultValue`, both work.** `Tabs`,
  `SegmentedControl` and `Select` are controlled-only: pass `value` + `onChange`.
- **Wrap inputs in `Field`** rather than wiring labels yourself — it generates the
  ids and the `aria-describedby`/`aria-invalid` links.
- **Never set `z-index` on an overlay.** `Dialog`, `Popover`, `Tooltip` and
  `Toast` render in the browser top layer and always paint above everything.

### 5. Where the truth lives

Read `styles.css` and the `_ds_bundle.css` it imports for the real token values,
and `components/<group>/<Name>/<Name>.prompt.md` + `<Name>.d.ts` for a
component's exact API before using it.

### 6. Idiomatic example

```jsx
<ThemeProvider theme="dark">
  <Container size="lg">
    <Stack gap={24}>
      <PageHeader kicker="Cross-border equity flows" title="Where the hot money went" />
      <MacroStrip>
        <StatTile label="USD/JPY" value="145.9" change="+0.5%" changeValue={0.5} trend={[1, 3, 2, 5]} />
      </MacroStrip>
      <Grid columns={{ base: 1, md: 12 }} gap={16}>
        <GridItem span={{ base: 1, md: 8 }}>
          <Panel padding="chart" column>
            <PanelHeading title="Region rotation" subtitle="Row sold → column bought, $B" />
            <DataRow leading="←" label="from KR · Semiconductors" value={formatDelta(5300, true)} tone={1} />
          </Panel>
        </GridItem>
        <GridItem span={{ base: 1, md: 4 }}>
          <Card header={<Heading size="lg">Alerts</Heading>}>
            <Stack gap={8}>
              <Alert tone="warning" title="Position limit">KR desk at 92% of cap.</Alert>
              <Badge tone="success">Settled</Badge>
            </Stack>
          </Card>
        </GridItem>
      </Grid>
    </Stack>
  </Container>
</ThemeProvider>
```
