import { useCallback, useMemo, useState } from 'react'
import {
  BreakdownBar,
  DataRow,
  Eyebrow,
  GhostButton,
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
  StatTile,
  Tabs,
  ThemeProvider,
  ThemeToggle,
  flowColors,
  formatFlow,
  useEscapeKey,
  useMeasure,
} from '..'
import type { ThemeName } from '..'
import {
  LANG_KEYS,
  METRIC_KEYS,
  RANGE_KEYS,
  REGION_CODES,
  SECTOR_KEYS,
  VIEW_KEYS,
} from './data'
import type { BucketKey, LangKey, MetricKey, RangeKey, ViewKey } from './data'
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

export interface CapitalFlowTrackerProps {
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

export function CapitalFlowTracker({
  theme: initialTheme = 'dark',
  lang: initialLang = 'en',
  initialRange = '15D',
  metric: initialMetric = 'combined',
  heroView = 'flow',
}: CapitalFlowTrackerProps) {
  const [theme, setTheme] = useState<ThemeName>(initialTheme)
  const [lang, setLang] = useState<LangKey>(initialLang)
  const [range, setRange] = useState<RangeKey>(initialRange)
  const [metric, setMetric] = useState<MetricKey>(initialMetric)
  const [view, setView] = useState<ViewKey>(heroView)
  const [selected, setSelected] = useState<BucketKey | null>(null)

  const [chartRef, { width: measuredWidth, viewportWidth }] = useMeasure<HTMLDivElement>()

  const clearSelection = useCallback(() => setSelected(null), [])
  useEscapeKey(selected != null, clearSelection)

  const toggle = useCallback((key: BucketKey) => {
    setSelected((current) => (current === key ? null : key))
  }, [])

  const locale = LOCALES[lang] ?? LOCALES.en
  const ui = locale.ui
  const { label, shortLabel } = useMemo(() => makeLabeller(locale), [locale])

  /* Responsive geometry --------------------------------------------------- */

  const viewport = viewportWidth || (typeof window !== 'undefined' ? window.innerWidth : 1440)
  const narrow = viewport < 760
  const tiny = viewport < 480
  const chartWidth = measuredWidth || (narrow ? Math.max(240, viewport - 92) : 880)

  const rowLabelWidth = tiny ? 26 : narrow ? 30 : 92
  const headerFontSize = `${Math.max(
    8,
    Math.min(10.5, ((chartWidth - rowLabelWidth - 30) / SECTOR_KEYS.length) * 0.245),
  ).toFixed(1)}px`

  /* Derived data ---------------------------------------------------------- */

  const edges = useMemo(() => buildEdges(range, metric), [range, metric])
  const nets = useMemo(() => bucketNets(edges), [edges])
  const total = useMemo(() => edges.reduce((acc, e) => acc + e.value, 0), [edges])
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

  const heatMax = useMemo(
    () => Object.values(nets).reduce((acc, value) => Math.max(acc, Math.abs(value)), 0),
    [nets],
  )

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
    <ThemeProvider
      theme={theme}
      className="cft-page"
      style={{ padding: tiny ? '16px 12px 28px' : narrow ? '18px 16px 32px' : '22px 26px 40px' }}
    >
      <div className="cft-shell">
        <PageHeader
          kicker={ui.kicker}
          title={ui.title}
          subtitle={
            <>
              {ui.sub} <span className="cft-title-time">{ui.asOf}</span>
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

        <div
          className="cft-main-grid"
          style={{ gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(0,1fr) 372px' }}
        >
          <Panel padding="chart" column>
            <div className="cft-hero-head">
              <Tabs
                label={ui.title}
                items={VIEW_KEYS.map((key, i) => ({ value: key, label: ui.tabs[i] }))}
                value={view}
                onChange={setView}
              />
              <Legend
                items={[
                  { color: flowColors.inflow, label: ui.inflow },
                  { color: flowColors.outflow, label: ui.outflow },
                ]}
                note={`${formatFlow(total)} ${ui.rotated}`}
              />
            </div>

            <div className="cft-hint">{ui.hints[VIEW_KEYS.indexOf(view)]}</div>

            <div className="cft-chart-frame" ref={chartRef}>
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
                  rowLabelWidth={rowLabelWidth}
                  headerFontSize={headerFontSize}
                  cellFontSize={tiny ? '9.5px' : narrow ? '10.5px' : '11.5px'}
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

          <Panel column className="cft-detail">
            <div className="cft-detail__head">
              <div className="cft-detail__head-row">
                <Eyebrow>{ui.selected}</Eyebrow>
                {selected != null && (
                  <GhostButton onClick={clearSelection}>✕ {ui.clear}</GhostButton>
                )}
              </div>
              <div className="cft-detail__title">{detail.title}</div>
              <div className="cft-detail__figures">
                <span
                  className="cft-detail__net"
                  style={{ color: detail.net >= 0 ? flowColors.inflow : flowColors.outflow }}
                >
                  {formatFlow(detail.net, true)}
                </span>
                <span className="cft-detail__net-caption">
                  {ui.netOver} {locale.rlab[range]}
                </span>
              </div>
              {selected == null && <div className="cft-detail__auto">{ui.auto}</div>}
            </div>

            <div>
              <Sparkline
                values={detail.series}
                width={330}
                height={74}
                pad={8}
                color={detail.net >= 0 ? flowColors.inflow : flowColors.outflow}
                area
                areaOpacity={0.12}
                strokeWidth={1.7}
                baseline
                fluid
              />
              <div className="cft-detail__chart-caption">
                <span>{ui.cumFlow}</span>
                <span>{ui.asOfShort}</span>
              </div>
            </div>

            <div className="cft-detail__section cft-detail__section--breakdown">
              <Eyebrow>{detail.breakdownLabel}</Eyebrow>
              {detail.breakdown.map((entry) => (
                <BreakdownBar
                  key={entry.name}
                  label={entry.name}
                  value={formatFlow(entry.value, true)}
                  fraction={entry.fraction}
                  tone={entry.value}
                />
              ))}
            </div>

            <div className="cft-detail__section cft-detail__section--divided">
              <Eyebrow>{ui.counterparties}</Eyebrow>
              {detail.counterparties.map((entry) => (
                <DataRow
                  key={entry.key}
                  leading={entry.arrow}
                  label={entry.name}
                  value={formatFlow(entry.value, true)}
                  tone={entry.value}
                />
              ))}
            </div>

            <div className="cft-detail__section cft-detail__section--divided">
              <Eyebrow>{ui.topNames}</Eyebrow>
              {detail.names.map((entry) => (
                <DataRow
                  key={entry.key}
                  monoLabel
                  label={entry.symbol}
                  caption={entry.name}
                  value={formatFlow(entry.value, true)}
                  tone={entry.value}
                />
              ))}
            </div>
          </Panel>
        </div>

        <div
          className="cft-bottom-grid"
          style={{ gridTemplateColumns: narrow ? 'minmax(0,1fr)' : '1.05fr .95fr 1.15fr' }}
        >
          <Panel column>
            <PanelHeading
              title={ui.tickerTitle}
              subtitle={`${ui.tickerSub} ${locale.rlab[range]}`}
            />
            <div className="cft-ticker-grid">
              <div className="cft-ticker-column">
                <Eyebrow variant="tile" style={{ color: flowColors.inflow }}>
                  {ui.bought}
                </Eyebrow>
                {extremes.bought.map((entry) => (
                  <DataRow
                    key={entry.key}
                    layout="stacked"
                    monoLabel
                    label={entry.symbol}
                    caption={entry.name}
                    value={formatFlow(entry.value)}
                    valueColor={flowColors.inflow}
                  />
                ))}
              </div>
              <div className="cft-ticker-column">
                <Eyebrow variant="tile" style={{ color: flowColors.outflow }}>
                  {ui.sold}
                </Eyebrow>
                {extremes.sold.map((entry) => (
                  <DataRow
                    key={entry.key}
                    layout="stacked"
                    monoLabel
                    label={entry.symbol}
                    caption={entry.name}
                    value={formatFlow(-entry.value)}
                    valueColor={flowColors.outflow}
                  />
                ))}
              </div>
            </div>
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
            <div className="cft-narrative-list">
              {stories.map((story) => (
                <NarrativeItem key={story.key} title={story.title} value={story.value} tone={story.tone}>
                  {story.body}
                </NarrativeItem>
              ))}
            </div>
          </Panel>
        </div>

        <Panel>
          <PanelHeading
            inline
            title={ui.momTitle}
            subtitle={`${ui.momSub} ${locale.rlab[range]} ${ui.momSub2}`}
          />
          <div className="cft-momentum-grid">
            {momentum.map((sector) => (
              <MomentumCard
                key={sector.key}
                name={sector.name}
                value={formatFlow(sector.value, true)}
                share={sector.share}
                tone={sector.value}
                trend={sector.series}
                onClick={() => toggle(sector.focusKey)}
              />
            ))}
          </div>
        </Panel>

        <div className="cft-footer">{ui.footer}</div>
      </div>
    </ThemeProvider>
  )
}
