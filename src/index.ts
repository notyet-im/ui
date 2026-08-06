/**
 * @notyet/capital-flow-ds
 *
 * A design system for cross-border capital-flow interfaces, extracted from the
 * Capital Flow Tracker prototype.
 *
 * Everything renders inside `<ThemeProvider>` — it defines the `--cf-*` custom
 * properties the components style themselves with.
 */

import './styles/tokens.css'

/* Theme ------------------------------------------------------------------- */
export { ThemeProvider, useTheme } from './components/ThemeProvider'
export type { ThemeProviderProps } from './components/ThemeProvider'
export { ThemeToggle } from './components/ThemeToggle'
export type { ThemeToggleProps } from './components/ThemeToggle'

/* Layout ------------------------------------------------------------------ */
export { Panel, PanelHeading } from './components/Panel'
export type { PanelProps, PanelHeadingProps } from './components/Panel'
export { PageHeader } from './components/PageHeader'
export type { PageHeaderProps } from './components/PageHeader'

/* Controls ---------------------------------------------------------------- */
export { SegmentedControl } from './components/SegmentedControl'
export type { SegmentedControlProps, SegmentedControlItem } from './components/SegmentedControl'
export { Tabs } from './components/Tabs'
export type { TabsProps, TabItem } from './components/Tabs'
export { IconButton, GhostButton, Select, Eyebrow, Legend } from './components/Controls'
export type {
  IconButtonProps,
  GhostButtonProps,
  SelectProps,
  SelectOption,
  EyebrowProps,
  LegendProps,
  LegendItem,
} from './components/Controls'

/* Data display ------------------------------------------------------------ */
export { Sparkline } from './components/Sparkline'
export type { SparklineProps } from './components/Sparkline'
export { MacroStrip, StatTile } from './components/MacroStrip'
export type { MacroStripProps, StatTileProps } from './components/MacroStrip'
export { HeatGrid, RotationMatrix } from './components/HeatGrid'
export type { HeatGridProps, HeatGridRow, HeatGridColumn, RotationMatrixProps } from './components/HeatGrid'
export { BreakdownBar, DataRow, NarrativeItem, MomentumCard } from './components/Details'
export type {
  BreakdownBarProps,
  DataRowProps,
  NarrativeItemProps,
  MomentumCardProps,
} from './components/Details'

/* Charts ------------------------------------------------------------------ */
export { SankeyFlow } from './components/SankeyFlow'
export type { SankeyFlowProps } from './components/SankeyFlow'
export { RotationRing } from './components/RotationRing'
export type { RotationRingProps } from './components/RotationRing'

/* Tokens ------------------------------------------------------------------ */
export { flowColors, flowColor, surfaces, fonts, motion } from './tokens'
export type { ThemeName, FlowDirection } from './tokens'

/* Utilities --------------------------------------------------------------- */
export { formatFlow, formatBillions, formatPercent, MINUS } from './lib/format'
export { rnd, hash } from './lib/prng'
export { walkSeries, seriesPath } from './lib/series'
export type { SeriesPath } from './lib/series'
export { heatStyle } from './lib/heat'
export type { HeatStyle } from './lib/heat'
export { sankeyLayout } from './lib/sankey'
export type { FlowLink, SankeyLayout, SankeyNode, SankeyRibbon, SankeyLabel, SankeyOptions } from './lib/sankey'
export { ringLayout } from './lib/ring'
export type {
  RingLayout,
  RingNode,
  RingNodeInput,
  RingPairInput,
  RingChord,
  RingLabel,
  RingOptions,
} from './lib/ring'
export { useMeasure, useEscapeKey } from './hooks'
export type { Measurements } from './hooks'
