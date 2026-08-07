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

/* Theme ------------------------------------------------------------------- */
export { ThemeProvider, useTheme } from './components/ThemeProvider'
export type { ThemeProviderProps } from './components/ThemeProvider'
export { ThemeToggle } from './components/ThemeToggle'
export type { ThemeToggleProps } from './components/ThemeToggle'

/* Layout ------------------------------------------------------------------ */
export { Container, Grid, GridItem, Stack } from './components/Layout'
export type {
  ContainerProps,
  GridItemProps,
  GridProps,
  Responsive,
  SpaceToken,
  StackProps,
} from './components/Layout'
export { Panel, PanelHeading } from './components/Panel'
export type { PanelHeadingProps, PanelProps } from './components/Panel'
export { PageHeader } from './components/PageHeader'
export type { PageHeaderProps } from './components/PageHeader'

/* Typography -------------------------------------------------------------- */
export { Heading, Text, VisuallyHidden } from './components/Text'
export type { HeadingProps, TextProps, VisuallyHiddenProps } from './components/Text'

/* Controls ---------------------------------------------------------------- */
export { Button } from './components/Button'
export type { ButtonProps } from './components/Button'
export { SegmentedControl } from './components/SegmentedControl'
export type { SegmentedControlItem, SegmentedControlProps } from './components/SegmentedControl'
export { Tabs } from './components/Tabs'
export type { TabItem, TabsProps } from './components/Tabs'
export { Eyebrow, InlineAction, Legend, Select } from './components/Controls'
export type {
  EyebrowProps,
  InlineActionProps,
  LegendItem,
  LegendProps,
  SelectOption,
  SelectProps,
} from './components/Controls'

/* Forms ------------------------------------------------------------------- */
export { Input, Textarea } from './components/Input'
export type { InputProps, TextareaProps } from './components/Input'
export { ErrorText, Field, HelpText, Label, useFieldControl } from './components/Field'
export type { ErrorTextProps, FieldProps, HelpTextProps, LabelProps } from './components/Field'
export { Checkbox } from './components/Checkbox'
export type { CheckboxProps } from './components/Checkbox'
export { Radio, RadioGroup } from './components/Radio'
export type { RadioGroupOption, RadioGroupProps, RadioProps } from './components/Radio'
export { Switch } from './components/Switch'
export type { SwitchProps } from './components/Switch'

/* Overlays ---------------------------------------------------------------- */
/* All four render in the browser top layer via `<dialog>` and the `popover`
   attribute, so none of them participate in the `--ny-z-*` stack. */
export { Dialog } from './components/Dialog'
export type { DialogProps } from './components/Dialog'
export { Popover } from './components/Popover'
export type { PopoverProps } from './components/Popover'
export { Tooltip } from './components/Tooltip'
export type { TooltipProps } from './components/Tooltip'
export { Toast, ToastViewport } from './components/Toast'
export type { ToastProps, ToastViewportProps } from './components/Toast'

/* Feedback ---------------------------------------------------------------- */
export { Alert } from './components/Alert'
export type { AlertProps } from './components/Alert'
export { Badge } from './components/Badge'
export type { BadgeProps } from './components/Badge'
export { Spinner } from './components/Spinner'
export type { SpinnerProps } from './components/Spinner'
export { Skeleton } from './components/Skeleton'
export type { SkeletonProps } from './components/Skeleton'
export { Avatar } from './components/Avatar'
export type { AvatarProps } from './components/Avatar'

/* Data display ------------------------------------------------------------ */
export { MacroStrip, StatTile } from './components/MacroStrip'
export type { MacroStripProps, StatTileProps } from './components/MacroStrip'
export { DataRow, MomentumCard, NarrativeItem } from './components/Details'
export type { DataRowProps, MomentumCardProps, NarrativeItemProps } from './components/Details'
export { Table } from './components/Table'
export type { TableColumn, TableProps, TableSort, TableSortDirection } from './components/Table'
export { Breadcrumb } from './components/Breadcrumb'
export type { BreadcrumbItem, BreadcrumbProps } from './components/Breadcrumb'
export { Pagination, paginationRange } from './components/Pagination'
export type { PaginationItem, PaginationProps } from './components/Pagination'

/* Charts ------------------------------------------------------------------ */
export { SankeyFlow } from './components/SankeyFlow'
export type { SankeyFlowProps } from './components/SankeyFlow'
export { RotationRing } from './components/RotationRing'
export type { RotationRingProps } from './components/RotationRing'
export { Sparkline } from './components/Sparkline'
export type { SparklineProps } from './components/Sparkline'
export { HeatGrid, RotationMatrix } from './components/HeatGrid'
export type {
  HeatGridColumn,
  HeatGridProps,
  HeatGridRow,
  RotationMatrixProps,
} from './components/HeatGrid'
export { BreakdownBar } from './components/Details'
export type { BreakdownBarProps } from './components/Details'

/* Tokens ------------------------------------------------------------------ */
export { breakpoints, deltaColor, deltaColors, fonts, motion, space, surfaces, zIndex } from './tokens'
export type { Breakpoint, DeltaDirection, ThemeName } from './tokens'

/* Utilities --------------------------------------------------------------- */
export { formatCompact, formatDelta, formatPercent, MINUS } from './lib/format'
export { hash, rnd } from './lib/prng'
export { seriesPath, walkSeries } from './lib/series'
export type { SeriesPath } from './lib/series'
export { heatStyle } from './lib/heat'
export type { HeatStyle } from './lib/heat'
export { sankeyLayout } from './lib/sankey'
export type {
  FlowLink,
  SankeyLabel,
  SankeyLayout,
  SankeyNode,
  SankeyOptions,
  SankeyRibbon,
} from './lib/sankey'
export { ringLayout } from './lib/ring'
export type {
  RingChord,
  RingLabel,
  RingLayout,
  RingNode,
  RingNodeInput,
  RingOptions,
  RingPairInput,
} from './lib/ring'
export { useAnchoredPosition, useControllableState, useEscapeKey, useMeasure, useRovingFocus } from './hooks'
export type { AnchoredPosition, Measurements, Placement, RovingFocus, RovingFocusOptions } from './hooks'
