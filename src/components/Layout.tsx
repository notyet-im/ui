import type { CSSProperties, ReactNode } from 'react'
import './Layout.css'

/* Responsive values ------------------------------------------------------- */

/**
 * The spacing steps a layout gap may use — the value-named scale from
 * `tokens.css`, so `gap={16}` resolves to `var(--ny-space-16)`.
 */
export type SpaceToken = 0 | 2 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64

/**
 * A value that changes at the four system breakpoints (480 / 768 / 1024 /
 * 1280px). `base` is required and applies below `sm`; every step is optional
 * and holds until the next one overrides it.
 */
export interface Responsive<T> {
  base: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

const BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const

type StyleVars = Record<string, string>

function isResponsive<T>(value: T | Responsive<T>): value is Responsive<T> {
  return typeof value === 'object' && value !== null && 'base' in value
}

/**
 * Turns a scalar or a `Responsive` object into inline custom properties —
 * `--ny-grid-cols`, `--ny-grid-cols-md`, and so on.
 *
 * Sparse objects are **filled forward**: `{ base: 1, md: 2 }` emits `-md`, `-lg`
 * and `-xl` all as 2. That is what makes the cascade mobile-first (a value set
 * at `md` has to survive `lg`, not snap back to `base`, and the media queries
 * are `min-width` so they all still match), and it is what keeps `Layout.css`
 * down to a two-step fallback per breakpoint instead of a five-deep chain.
 */
function responsiveVars<T>(
  name: string,
  value: T | Responsive<T> | undefined,
  format: (value: T) => string,
): StyleVars {
  if (value == null) return {}
  if (!isResponsive(value)) return { [name]: format(value) }

  const vars: StyleVars = { [name]: format(value.base) }
  let carried: T | undefined
  for (const breakpoint of BREAKPOINTS) {
    const at = value[breakpoint] ?? carried
    if (at === undefined) continue
    carried = at
    vars[`${name}-${breakpoint}`] = format(at)
  }
  return vars
}

const asCount = (value: number) => String(value)
const asSpace = (value: SpaceToken) => `var(--ny-space-${value})`

/**
 * Container, Grid, GridItem and Stack are the **only** components in this system
 * allowed to merge the caller's `style`. They exist to be positioned, and the
 * props that position them are already custom properties on that same object —
 * refusing the caller's would mean inventing an escape hatch instead.
 *
 * The caller's declarations go last, so they win over the generated ones.
 */
function withVars(vars: StyleVars, style: CSSProperties | undefined): CSSProperties {
  return { ...vars, ...style } as CSSProperties
}

/* Container --------------------------------------------------------------- */

export interface ContainerProps {
  /**
   * Maximum content width: `sm` 720px, `md` 960px, `lg` 1280px, `xl` 1560px,
   * `full` none. Default `lg`.
   *
   * `xl` is the dashboard tier — dense, multi-column screens genuinely want
   * more measure than reading content does, and the jump from 1280 straight to
   * unbounded left them with no honest option.
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children?: ReactNode
  className?: string
  /** Merged over the generated declarations — the caller wins. */
  style?: CSSProperties
}

/**
 * Centred page measure with the system gutter.
 *
 * Also opens a container query context named `ny-panel`, so anything inside can
 * reflow against the container's width rather than the viewport's.
 */
export function Container({ size = 'lg', children, className, style }: ContainerProps) {
  const classes = ['ny-container', `ny-container--${size}`, className]
  return (
    <div className={classes.filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}

/* Grid -------------------------------------------------------------------- */

export interface GridProps {
  /** Column count. Default 12. */
  columns?: number | Responsive<number>
  /** Both axes at once. Default `--ny-gutter`. */
  gap?: SpaceToken | Responsive<SpaceToken>
  /** Overrides `gap` on the column axis. */
  columnGap?: SpaceToken | Responsive<SpaceToken>
  /** Overrides `gap` on the row axis. */
  rowGap?: SpaceToken | Responsive<SpaceToken>
  /** How items sit in their row. Default `stretch`, as CSS grid does. */
  align?: 'start' | 'center' | 'end' | 'stretch'
  children?: ReactNode
  className?: string
  /** Merged over the generated declarations — the caller wins. */
  style?: CSSProperties
}

/** The grid. Lay `GridItem`s into it and give them a `span`. */
export function Grid({ columns = 12, gap, columnGap, rowGap, align, children, className, style }: GridProps) {
  const vars: StyleVars = {
    ...responsiveVars('--ny-grid-cols', columns, asCount),
    ...responsiveVars('--ny-grid-col-gap', columnGap ?? gap, asSpace),
    ...responsiveVars('--ny-grid-row-gap', rowGap ?? gap, asSpace),
  }
  const classes = ['ny-grid', align != null && `ny-grid--align-${align}`, className]
  return (
    <div className={classes.filter(Boolean).join(' ')} style={withVars(vars, style)}>
      {children}
    </div>
  )
}

/* GridItem ---------------------------------------------------------------- */

export interface GridItemProps {
  /** Columns to cover. Default 1. */
  span?: number | Responsive<number>
  /** 1-based column line to begin at. Omit to flow into the next free slot. */
  start?: number
  children?: ReactNode
  className?: string
  /** Merged over the generated declarations — the caller wins. */
  style?: CSSProperties
}

/** A cell in a `Grid`. Only meaningful as a direct child of one. */
export function GridItem({ span, start, children, className, style }: GridItemProps) {
  const vars: StyleVars = {
    ...responsiveVars('--ny-grid-span', span, asCount),
    ...(start != null ? { '--ny-grid-start': asCount(start) } : {}),
  }
  const classes = ['ny-grid-item', className]
  return (
    <div className={classes.filter(Boolean).join(' ')} style={withVars(vars, style)}>
      {children}
    </div>
  )
}

/* Stack ------------------------------------------------------------------- */

export interface StackProps {
  /** Default `column`. */
  direction?: 'row' | 'column'
  /** Space between children. Default `--ny-stack`. */
  gap?: SpaceToken | Responsive<SpaceToken>
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'between'
  /** Let children wrap onto another line. */
  wrap?: boolean
  children?: ReactNode
  className?: string
  /** Merged over the generated declarations — the caller wins. */
  style?: CSSProperties
}

/**
 * One-dimensional flow with a consistent gap — the answer to every "I need a
 * bit of space between these two things". There is no `Spacer`; use `gap`.
 */
export function Stack({
  direction = 'column',
  gap,
  align,
  justify,
  wrap = false,
  children,
  className,
  style,
}: StackProps) {
  const vars = responsiveVars('--ny-stack-gap', gap, asSpace)
  const classes = [
    'ny-stack',
    direction === 'row' && 'ny-stack--row',
    align != null && `ny-stack--align-${align}`,
    justify != null && `ny-stack--justify-${justify}`,
    wrap && 'ny-stack--wrap',
    className,
  ]
  return (
    <div className={classes.filter(Boolean).join(' ')} style={withVars(vars, style)}>
      {children}
    </div>
  )
}
