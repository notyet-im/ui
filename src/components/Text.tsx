import type { CSSProperties, ReactNode } from 'react'
import './Text.css'
import { cx } from '../lib/cx'

/* Text -------------------------------------------------------------------- */

export interface TextProps {
  /**
   * Which element to render. `span`, the default, adds no block box and is safe
   * to nest inside other text.
   *
   * `p` — a real paragraph of prose.
   * `span` — a run of text inside a larger line.
   * `div` — a standalone block that is not prose.
   * `label` — a caption sitting next to a control it wraps.
   */
  as?: 'p' | 'span' | 'div' | 'label'
  /**
   * Step on the type scale. Each step carries the line-height it was drawn
   * against.
   *
   * `2xs` — micro copy: matrix cells, annotations.
   * `xs` — captions and help text.
   * `sm` — dense body and control labels.
   * `md` — body copy. The default.
   * `lg` — lead-in copy at the top of a section.
   */
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Omit to inherit the surrounding weight.
   *
   * `regular` — body copy.
   * `medium` — the emphasis step; use this before reaching for `semibold`.
   * `semibold` — a label carrying real weight against a heading.
   */
  weight?: 'regular' | 'medium' | 'semibold'
  /**
   * Omit to inherit the surrounding colour, which at the root is `default`.
   *
   * `default` — primary reading colour.
   * `muted` — secondary copy: subtitles, captions.
   * `subtle` — the quietest step still meant to be read: units, timestamps.
   * `positive` — a value that went up. Teal in both themes.
   * `negative` — a value that went down. Rust in both themes.
   * `accent` — draws the eye to one figure. Never for a whole paragraph.
   * `danger` — something is wrong: a validation message, a failed state. Not
   *   the same as `negative`, which is a *number* that fell; the palette keeps
   *   the two apart so a chart never recolours when the UI's danger does.
   */
  tone?: 'default' | 'muted' | 'subtle' | 'positive' | 'negative' | 'accent' | 'danger'
  /**
   * Tabular figures, via `--ny-font-numeric`. Set this on every number that
   * sits in a column — proportional digits make a column jitter as it updates.
   */
  numeric?: boolean
  /**
   * The monospace face, without `numeric`'s tabular figures. For a timestamp,
   * a ticker or region code, a caption — where the face is the point and the
   * digits are not in a column.
   */
  mono?: boolean
  /**
   * Clamp to a single line with an ellipsis. The parent must be able to shrink:
   * inside a flex or grid child, that means `min-width: 0` on the parent, or
   * the text pushes the track wider instead of truncating.
   */
  truncate?: boolean
  /**
   * Omit to inherit alignment. `start`/`end` are writing-direction aware.
   */
  align?: 'start' | 'center' | 'end'
  /** Needed when something points at this text — `aria-describedby`, say. */
  id?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Body text at a chosen step of the type scale, with the matching line-height.
 * The system has no text tokens or utility classes, so this is how you set type.
 *
 * Use `Heading` for a document heading — `Text` never enters the heading
 * outline — and `Eyebrow` for the uppercase label above a section.
 */
export function Text({
  as = 'span',
  size = 'md',
  weight,
  tone,
  numeric = false,
  mono = false,
  truncate = false,
  align,
  id,
  children,
  className,
  style,
}: TextProps) {
  const Tag = as
  const classes = [
    'ny-text',
    `ny-text--size-${size}`,
    weight != null && `ny-text--weight-${weight}`,
    tone != null && `ny-ink--${tone}`,
    align != null && `ny-text--align-${align}`,
    numeric && 'ny-text--numeric',
    mono && 'ny-mono',
    truncate && 'ny-truncate',
    className,
  ]
  return (
    <Tag id={id} className={cx(...classes)} style={style}>
      {children}
    </Tag>
  )
}

/* Heading ----------------------------------------------------------------- */

export interface HeadingProps {
  /**
   * The heading level — document structure, not appearance. Pick it from where
   * the heading sits in the outline: exactly one `h1` per page, and never skip
   * a level to get a smaller heading. Use `size` for that.
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /**
   * The visual step, independent of `as`.
   *
   * `lg` — a heading inside dense content.
   * `xl` — panel and dialog titles. The default.
   * `2xl` — a major section on a page.
   * `3xl` — the page title.
   * `4xl` — display type, for a landing surface.
   */
  size?: 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  /**
   * Omit to inherit the surrounding colour, which at the root is `default`.
   *
   * `default` — primary reading colour.
   * `muted` — a heading deliberately stepped back from the content below it.
   * `subtle` — the quietest step still meant to be read.
   * `positive` — a heading naming a value that went up. Teal in both themes.
   * `negative` — a heading naming a value that went down. Rust in both themes.
   * `accent` — one heading pulled forward. Never more than one in a view.
   * `danger` — names something that failed. See `TextProps.tone`.
   */
  tone?: 'default' | 'muted' | 'subtle' | 'positive' | 'negative' | 'accent' | 'danger'
  /** Clamp to a single line with an ellipsis. See `TextProps.truncate`. */
  truncate?: boolean
  /** Needed when something points at this heading — `aria-labelledby`, say. */
  id?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * A document heading.
 *
 * `as` and `size` are independent on purpose. Heading *level* is document
 * structure — it is what screen-reader users navigate by, and it must follow
 * the outline. Heading *size* is visual. Conflating the two forces people to
 * pick the wrong tag to get the look they want, which is how outlines end up
 * with three `h1`s and no `h2`: `<Heading as="h3" size="2xl">` is a correct
 * third-level heading that happens to be large, and that is the point.
 *
 * For body copy use `Text` — it stays out of the outline entirely.
 */
export function Heading({
  as = 'h2',
  size = 'xl',
  tone,
  truncate = false,
  id,
  children,
  className,
  style,
}: HeadingProps) {
  const Tag = as
  const classes = [
    'ny-heading',
    `ny-heading--size-${size}`,
    tone != null && `ny-ink--${tone}`,
    truncate && 'ny-truncate',
    className,
  ]
  return (
    <Tag id={id} className={cx(...classes)} style={style}>
      {children}
    </Tag>
  )
}

/* Visually hidden --------------------------------------------------------- */

export interface VisuallyHiddenProps {
  /** `span` by default; `div` when the content needs a block box. */
  as?: 'span' | 'div'
  children?: ReactNode
  className?: string
}

/**
 * Text removed from the visual layout but left in the accessibility tree.
 *
 * To *name* a control that has none, prefer `aria-label` — one attribute, no
 * DOM. Use this when the text is content rather than a name: the expansion of
 * an abbreviated column header, a "sorted ascending" annotation, a skip link.
 */
export function VisuallyHidden({ as = 'span', children, className }: VisuallyHiddenProps) {
  const Tag = as
  return <Tag className={cx('ny-visually-hidden', className)}>{children}</Tag>
}
