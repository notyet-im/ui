/**
 * NotYet UI — `@notyet/ui`
 *
 * A dense, dark-first design system in two halves: **UI** components for
 * building interfaces, and **Charts** for encoding data.
 *
 * Everything renders inside `<ThemeProvider>` — it defines the `--ny-*` custom
 * properties the components style themselves with, and scopes the reset and the
 * shared focus ring.
 */

import './styles/tokens.css'
import './styles/base.css'

export type {
  EyebrowProps,
  GhostButtonProps,
  IconButtonProps,
  LegendItem,
  LegendProps,
  SelectOption,
  SelectProps,
} from './components/Controls'
export { Eyebrow, GhostButton, IconButton, Legend, Select } from './components/Controls'
export type {
  BreakdownBarProps,
  DataRowProps,
  MomentumCardProps,
  NarrativeItemProps,
} from './components/Details'
export { BreakdownBar, DataRow, MomentumCard, NarrativeItem } from './components/Details'
export type { HeatGridColumn, HeatGridProps, HeatGridRow, RotationMatrixProps } from './components/HeatGrid'
export { HeatGrid, RotationMatrix } from './components/HeatGrid'
export type { MacroStripProps, StatTileProps } from './components/MacroStrip'
export { MacroStrip, StatTile } from './components/MacroStrip'
export type { PageHeaderProps } from './components/PageHeader'
export { PageHeader } from './components/PageHeader'
export type { PanelHeadingProps, PanelProps } from './components/Panel'
/* Layout ------------------------------------------------------------------ */
export { Panel, PanelHeading } from './components/Panel'
export type { RotationRingProps } from './components/RotationRing'
export { RotationRing } from './components/RotationRing'
export type { SankeyFlowProps } from './components/SankeyFlow'
/* Charts ------------------------------------------------------------------ */
export { SankeyFlow } from './components/SankeyFlow'
export type { SegmentedControlItem, SegmentedControlProps } from './components/SegmentedControl'
/* Controls ---------------------------------------------------------------- */
export { SegmentedControl } from './components/SegmentedControl'
export type { SparklineProps } from './components/Sparkline'
/* Data display ------------------------------------------------------------ */
export { Sparkline } from './components/Sparkline'
export type { TabItem, TabsProps } from './components/Tabs'
export { Tabs } from './components/Tabs'
export type { ThemeProviderProps } from './components/ThemeProvider'
/* Theme ------------------------------------------------------------------- */
export { ThemeProvider, useTheme } from './components/ThemeProvider'
export type { ThemeToggleProps } from './components/ThemeToggle'
export { ThemeToggle } from './components/ThemeToggle'
export type { Measurements } from './hooks'
export { useEscapeKey, useMeasure } from './hooks'

/* Utilities --------------------------------------------------------------- */
export { formatCompact, formatDelta, formatPercent, MINUS } from './lib/format'
export type { HeatStyle } from './lib/heat'
export { heatStyle } from './lib/heat'
export { hash, rnd } from './lib/prng'
export type {
  RingChord,
  RingLabel,
  RingLayout,
  RingNode,
  RingNodeInput,
  RingOptions,
  RingPairInput,
} from './lib/ring'
export { ringLayout } from './lib/ring'
export type {
  FlowLink,
  SankeyLabel,
  SankeyLayout,
  SankeyNode,
  SankeyOptions,
  SankeyRibbon,
} from './lib/sankey'
export { sankeyLayout } from './lib/sankey'
export type { SeriesPath } from './lib/series'
export { seriesPath, walkSeries } from './lib/series'
export type { DeltaDirection, ThemeName } from './tokens'
/* Tokens ------------------------------------------------------------------ */
export { deltaColor, deltaColors, fonts, motion, surfaces } from './tokens'
