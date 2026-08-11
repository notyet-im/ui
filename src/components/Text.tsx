import type { CSSProperties, ReactNode } from 'react'
import './Text.css'

/* Text -------------------------------------------------------------------- */

export interface TextProps {
  /**
   * Which element to render. The default `span` is inert — it is safe to nest
   * inside other text and adds no block box.
   *
   * `p` — a real paragraph of prose.
   * `span` — a run of text inside a larger line. The default.
   * `div` — a standalone block that is not prose.
   * `label` — a caption sitting next to a control it wraps.
   */
  as?: 'p' | 'span' | 'div' | 'label'
  /**
   * Step on the type scale. Each step pairs a font-size with the line-height it
   * was drawn against — that pairing is most of why this component exists.
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
 * Body text at a chosen step of the type scale.
 *
 * The system ships no composite text tokens and no utility classes, so this is
 * the supported way to set type: a `font` shorthand custom property silently
 * resets `line-height`, and a composite token cannot be partially overridden.
 * `Text` binds each size to its line-height for you.
 *
 * Use `Heading` for anything that is a document heading — `Text` never enters
 * the heading outline. Use `Eyebrow` for the uppercase monospace label above a
 * section; it is a fixed role, not a size on this scale.
 */
export function Text({
  as = 'span',
  size = 'md',
  weight,
  tone,
  numeric = false,
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
    truncate && 'ny-truncate',
    className,
  ]
  return (
    <Tag id={id} className={classes.filter(Boolean).join(' ')} style={style}>
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
   */
  tone?: 'default' | 'muted' | 'subtle' | 'positive' | 'negative' | 'accent'
  /** Clamp to a single line with an ellipsis. See `TextProps.truncate`. */
  truncate?: boolean
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
    <Tag className={classes.filter(Boolean).join(' ')} style={style}>
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
 * For the name of a control that has none — an icon button, say — prefer
 * `aria-label`: it is one attribute and no DOM. Reach for `VisuallyHidden` when
 * the text is *content* rather than a name: the expansion of an abbreviated
 * column header, a "sorted ascending" annotation, a skip link that appears only
 * on focus, or a live-region message with no visual counterpart.
 *
 * It renders the shared `.ny-visually-hidden` class from the base layer, so it
 * stays clip-path based — `display: none` and `visibility: hidden` would take
 * the text out of the accessibility tree too, which defeats the purpose.
 */
export function VisuallyHidden({ as = 'span', children, className }: VisuallyHiddenProps) {
  const Tag = as
  return <Tag className={['ny-visually-hidden', className].filter(Boolean).join(' ')}>{children}</Tag>
}
