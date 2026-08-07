import { useCallback, useMemo, useState } from 'react'
import type { ThemeName } from '..'
import {
  BreakdownBar,
  Container,
  DataRow,
  deltaColors,
  Eyebrow,
  formatDelta,
  GhostButton,
  Grid,
  GridItem,
  HeatGrid,
  Legend,
  MacroStrip,
  MomentumCard,
  NarrativeItem,
  PageHeader,
  Panel,
  PanelHeading,
  RotationMatrix,
  RotationRing,
  SankeyFlow,
  SegmentedControl,
  Select,
  Sparkline,
  Stack,
  StatTile,
  Tabs,
  ThemeProvider,
  ThemeToggle,
  useEscapeKey,
  useMeasure,
} from '..'
import type { BucketKey, LangKey, MetricKey, RangeKey, ViewKey } from './data'
import { LANG_KEYS, METRIC_KEYS, RANGE_KEYS, REGION_CODES, SECTOR_KEYS, VIEW_KEYS } from './data'
import { LOCALES, WHY } from './i18n'
import {
  bucketNets,
  buildEdges,
  defaultSelection,
  macroReadings,
  makeLabeller,
  narrative,
  regionAggregates,
  sectorMomentum,
  selectionDetail,
  tickerExtremes,
} from './model'
import './tracker.css'

export interface TrackerShowcaseProps {
  /** Initial palette. The in-page toggle takes over from here. */
  theme?: ThemeName
  /** Initial interface language. */
  lang?: LangKey
  /** Initial lookback window. */
  initialRange?: RangeKey
  /** Initial flow source filter. */
  metric?: MetricKey
  /** Initial hero visualisation. */
  heroView?: ViewKey
}

/** Number of flows drawn in the ribbon view — beyond this it stops being readable. */
const RIBBON_LIMIT = 9

const LANGUAGE_LABELS: Record<LangKey, string> = {
  en: 'English',
  zh: '中文',
  ko: '한국어',
  ja: '日本語',
}
/** Display order for the language picker, which differs from `LANG_KEYS`. */
const LANGUAGE_ORDER: LangKey[] = ['en', 'zh', 'ko', 'ja']

export function TrackerShowcase({
  theme: initialTheme = 'dark',
  lang: initialLang = 'en',
  initialRange = '15D',
  metric: initialMetric = 'combined',
  heroView = 'flow',
}: TrackerShowcaseProps) {
  const [theme, setTheme] = useState<ThemeName>(initialTheme)
  const [lang, setLang] = useState<LangKey>(initialLang)
  const [range, setRange] = useState<RangeKey>(initialRange)
  const [metric, setMetric] = useState<MetricKey>(initialMetric)
  const [view, setView] = useState<ViewKey>(heroView)
  const [selected, setSelected] = useState<BucketKey | null>(null)

  const [chartRef, { width: chartWidth }] = useMeasure<HTMLDivElement>()

  const clearSelection = useCallback(() => setSelected(null), [])
  useEscapeKey(selected != null, clearSelection)

  const toggle = useCallback((key: BucketKey) => {
    setSelected((current) => (current === key ? null : key))
  }, [])

  const locale = LOCALES[lang] ?? LOCALES.en
  const ui = locale.ui
  const { label, shortLabel } = useMemo(() => makeLabeller(locale), [locale])

  /* Responsive content ----------------------------------------------------
   *
   * Layout is entirely CSS now — `Container`, `Grid` and `Stack` own it. What
   * is left here is *content* choice, which CSS genuinely cannot make: whether
   * to render a region's full name or just its code, and whether the flow chart
   * should reserve less room for labels.
   *
   * It keys off the measured **container**, not the viewport. That distinction
   * is the whole point: a chart in a 400px panel on a 1600px monitor is narrow,
   * and the old `window.innerWidth` test called it wide. */

  const narrow = chartWidth > 0 && chartWidth < 560

  // The measured width is handed to the charts rather than letting them measure
  // the same box again: two ResizeObservers on one element means two render
  // passes per resize frame over this whole subtree.

  /* Derived data ---------------------------------------------------------- */

  const edges = useMemo(() => buildEdges(range, metric), [range, metric])
  const nets = useMemo(() => bucketNets(edges), [edges])
  const total = edges.reduce((acc, e) => acc + e.value, 0)
  const selectionKey = selected ?? defaultSelection(nets)

  const regions = useMemo(() => regionAggregates(edges), [edges])
  const detail = useMemo(
    () => selectionDetail(edges, selectionKey, range, locale),
    [edges, selectionKey, range, locale],
  )
  const extremes = useMemo(() => tickerExtremes(nets, range), [nets, range])
  const momentum = useMemo(
    () => sectorMomentum(edges, nets, total, range, locale),
    [edges, nets, total, range, locale],
  )
  const macros = useMemo(() => macroReadings(range, locale), [range, locale])
  const stories = useMemo(() => narrative(edges, locale, WHY[lang]), [edges, locale, lang])

  const heatMax = Object.values(nets).reduce((acc, value) => Math.max(acc, Math.abs(value)), 0)

  const ribbonLinks = useMemo(
    () => edges.slice(0, RIBBON_LIMIT).map((e) => ({ from: e.from, to: e.to, value: e.value })),
    [edges],
  )
  const ringNodes = useMemo(
    () => REGION_CODES.map((code) => ({ id: code, net: regions.nets[code] })),
    [regions],
  )
  const ringPairs = useMemo(
    () =>
      REGION_CODES.flatMap((from) =>
        REGION_CODES.map((to) => ({ from, to, value: regions.pairs[from][to] })),
      ),
    [regions],
  )

  const selectedRegion = selected ? selected.split('|')[0] : null

  /* Render ---------------------------------------------------------------- */

  return (
    <ThemeProvider theme={theme} className="ny-showcase-page">
      <Container size="xl">
        <Stack gap={16}>
          <PageHeader
            kicker={ui.kicker}
            title={ui.title}
            subtitle={
              <>
                {ui.sub} <span className="ny-showcase-title-time">{ui.asOf}</span>
              </>
            }
            actions={
              <>
                <SegmentedControl
                  label={ui.selected}
                  items={METRIC_KEYS.map((key, i) => ({ value: key, label: ui.metrics[i] }))}
                  value={metric}
                  onChange={setMetric}
                />
                <SegmentedControl
                  label={ui.netOver}
                  variant="mono"
                  items={RANGE_KEYS.map((key) => ({ value: key, label: key }))}
                  value={range}
                  onChange={setRange}
                />
                <Select
                  label="Language"
                  options={LANGUAGE_ORDER.map((key) => ({ value: key, label: LANGUAGE_LABELS[key] }))}
                  value={lang}
                  onChange={(next) => setLang(LANG_KEYS.includes(next) ? next : 'en')}
                />
                <ThemeToggle theme={theme} onChange={setTheme} />
              </>
            }
          />

          <MacroStrip>
            {macros.map((macro) => (
              <StatTile
                key={macro.key}
                label={macro.label}
                value={macro.value}
                change={macro.changeText}
                changeValue={macro.change}
                trend={macro.series}
              />
            ))}
          </MacroStrip>

          <Grid columns={{ base: 1, lg: 12 }} gap={12}>
            <GridItem span={{ base: 1, lg: 8 }}>
              <Panel padding="chart" column>
                <div className="ny-showcase-hero-head">
                  <Tabs
                    label={ui.title}
                    items={VIEW_KEYS.map((key, i) => ({ value: key, label: ui.tabs[i] }))}
                    value={view}
                    onChange={setView}
                  />
                  <Legend
                    items={[
                      { color: deltaColors.positive, label: ui.inflow },
                      { color: deltaColors.negative, label: ui.outflow },
                    ]}
                    note={`${formatDelta(total)} ${ui.rotated}`}
                  />
                </div>

                <div className="ny-showcase-hint">{ui.hints[VIEW_KEYS.indexOf(view)]}</div>

                <div className="ny-showcase-chart-frame" ref={chartRef}>
                  {view === 'flow' && (
                    <SankeyFlow
                      links={ribbonLinks}
                      width={chartWidth}
                      narrow={narrow}
                      selectedId={selected}
                      onSelect={toggle}
                      renderLabel={narrow ? shortLabel : label}
                      startCaption={ui.soldDown}
                      endCaption={ui.boughtInto}
                    />
                  )}

                  {view === 'grid' && (
                    <HeatGrid
                      rows={REGION_CODES.map((code) => ({
                        key: code,
                        code,
                        name: narrow ? undefined : locale.reg[code],
                      }))}
                      columns={SECTOR_KEYS.map((key) => ({ key, label: locale.sshort[key] }))}
                      value={(row, column) => nets[`${row}|${column}`] ?? 0}
                      max={heatMax}
                      selectedKey={selectionKey}
                      onSelect={toggle}
                      rowLabelWidth={narrow ? 30 : 92}
                      minHeight={narrow ? 380 : 452}
                    />
                  )}

                  {view === 'ring' && (
                    <RotationRing
                      nodes={ringNodes}
                      pairs={ringPairs}
                      width={chartWidth}
                      selectedId={selectedRegion}
                      onSelect={(id) => toggle(`${id}|*`)}
                      renderLabel={(id) => locale.reg[id as (typeof REGION_CODES)[number]]}
                    />
                  )}
                </div>
              </Panel>
            </GridItem>

            <GridItem span={{ base: 1, lg: 4 }}>
              <Panel column className="ny-showcase-detail">
                <div className="ny-showcase-detail__head">
                  <div className="ny-showcase-detail__head-row">
                    <Eyebrow>{ui.selected}</Eyebrow>
                    {selected != null && <GhostButton onClick={clearSelection}>✕ {ui.clear}</GhostButton>}
                  </div>
                  <div className="ny-showcase-detail__title">{detail.title}</div>
                  <div className="ny-showcase-detail__figures">
                    <span
                      className="ny-showcase-detail__net"
                      style={{ color: detail.net >= 0 ? deltaColors.positive : deltaColors.negative }}
                    >
                      {formatDelta(detail.net, true)}
                    </span>
                    <span className="ny-showcase-detail__net-caption">
                      {ui.netOver} {locale.rlab[range]}
                    </span>
                  </div>
                  {selected == null && <div className="ny-showcase-detail__auto">{ui.auto}</div>}
                </div>

                <div>
                  <Sparkline
                    values={detail.series}
                    width={330}
                    height={74}
                    pad={8}
                    color={detail.net >= 0 ? deltaColors.positive : deltaColors.negative}
                    area
                    areaOpacity={0.12}
                    strokeWidth={1.7}
                    baseline
                    fluid
                  />
                  <div className="ny-showcase-detail__chart-caption">
                    <span>{ui.cumFlow}</span>
                    <span>{ui.asOfShort}</span>
                  </div>
                </div>

                <div className="ny-showcase-detail__section">
                  <Eyebrow>{detail.breakdownLabel}</Eyebrow>
                  {detail.breakdown.map((entry) => (
                    <BreakdownBar
                      key={entry.name}
                      label={entry.name}
                      value={formatDelta(entry.value, true)}
                      fraction={entry.fraction}
                      tone={entry.value}
                    />
                  ))}
                </div>

                <div className="ny-showcase-detail__section ny-showcase-detail__section--divided">
                  <Eyebrow>{ui.counterparties}</Eyebrow>
                  {detail.counterparties.map((entry) => (
                    <DataRow
                      key={entry.key}
                      leading={entry.arrow}
                      label={entry.name}
                      value={formatDelta(entry.value, true)}
                      tone={entry.value}
                    />
                  ))}
                </div>

                <div className="ny-showcase-detail__section ny-showcase-detail__section--divided">
                  <Eyebrow>{ui.topNames}</Eyebrow>
                  {detail.names.map((entry) => (
                    <DataRow
                      key={entry.key}
                      monoLabel
                      label={entry.symbol}
                      caption={entry.name}
                      value={formatDelta(entry.value, true)}
                      tone={entry.value}
                    />
                  ))}
                </div>
              </Panel>
            </GridItem>
          </Grid>

          <Grid columns={{ base: 1, lg: 3 }} gap={12}>
            <Panel column>
              <PanelHeading title={ui.tickerTitle} subtitle={`${ui.tickerSub} ${locale.rlab[range]}`} />
              <Grid columns={{ base: 1, sm: 2 }} gap={12}>
                <Stack gap={4}>
                  <Eyebrow variant="tile" style={{ color: deltaColors.positive }}>
                    {ui.bought}
                  </Eyebrow>
                  {extremes.bought.map((entry) => (
                    <DataRow
                      key={entry.key}
                      layout="stacked"
                      monoLabel
                      label={entry.symbol}
                      caption={entry.name}
                      value={formatDelta(entry.value)}
                      valueColor={deltaColors.positive}
                    />
                  ))}
                </Stack>
                <Stack gap={4}>
                  <Eyebrow variant="tile" style={{ color: deltaColors.negative }}>
                    {ui.sold}
                  </Eyebrow>
                  {extremes.sold.map((entry) => (
                    <DataRow
                      key={entry.key}
                      layout="stacked"
                      monoLabel
                      label={entry.symbol}
                      caption={entry.name}
                      value={formatDelta(-entry.value)}
                      valueColor={deltaColors.negative}
                    />
                  ))}
                </Stack>
              </Grid>
            </Panel>

            <Panel column>
              <PanelHeading title={ui.matrixTitle} subtitle={ui.matrixSub} />
              <RotationMatrix
                codes={REGION_CODES}
                value={(from, to) => regions.pairs[from][to]}
                max={regions.maxPair}
              />
            </Panel>

            <Panel column>
              <PanelHeading title={ui.narrTitle} subtitle={ui.narrSub} />
              <Stack gap={12}>
                {stories.map((story) => (
                  <NarrativeItem key={story.key} title={story.title} value={story.value} tone={story.tone}>
                    {story.body}
                  </NarrativeItem>
                ))}
              </Stack>
            </Panel>

            <Panel>
              <PanelHeading
                inline
                title={ui.momTitle}
                subtitle={`${ui.momSub} ${locale.rlab[range]} ${ui.momSub2}`}
              />
              <Grid columns={{ base: 2, md: 3 }} gap={8}>
                {momentum.map((sector) => (
                  <MomentumCard
                    key={sector.key}
                    name={sector.name}
                    value={formatDelta(sector.value, true)}
                    share={sector.share}
                    tone={sector.value}
                    trend={sector.series}
                    onClick={() => toggle(sector.focusKey)}
                  />
                ))}
              </Grid>
            </Panel>
          </Grid>

          <div className="ny-showcase-footer">{ui.footer}</div>
        </Stack>
      </Container>
    </ThemeProvider>
  )
}
