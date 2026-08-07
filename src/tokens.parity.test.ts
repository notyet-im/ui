import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { accent, breakpoints, deltaColors, fonts, motion, space, surfaces, zIndex } from './tokens'

/**
 * `tokens.ts` is a hand-maintained mirror of `styles/tokens.css`. It has to be:
 * SVG `stroke`/`fill` attributes cannot read a custom property, so the charts
 * need real strings, and generating the CSS would make it unreadable — and that
 * file is what `.design-sync/conventions.md` points the design agent at.
 *
 * Hand-maintained means it drifts. This test is what stops that.
 */

const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8')

/** Comments describe the invalid patterns we check for, so strip them first. */
const source = css.replace(/\/\*[\s\S]*?\*\//g, '')

/** Drops balanced `@media (…) { … }` sections, leaving only base declarations. */
function withoutAtRules(text: string): string {
  let out = ''
  let index = 0
  while (index < text.length) {
    const at = text.indexOf('@media', index)
    if (at === -1) return out + text.slice(index)
    out += text.slice(index, at)
    let depth = 0
    let cursor = text.indexOf('{', at)
    if (cursor === -1) return out
    for (; cursor < text.length; cursor++) {
      if (text[cursor] === '{') depth++
      else if (text[cursor] === '}' && --depth === 0) break
    }
    index = cursor + 1
  }
  return out
}

const base = withoutAtRules(source)

/**
 * Every `selector { … }` block, innermost-first. Selector lists are split, so
 * `:root, [data-theme="dark"]` registers under both.
 */
const blocks = [...base.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
  selectors: match[1]
    .split(',')
    .map((selector) => selector.trim())
    .filter(Boolean),
  body: match[2],
}))

/**
 * Reads a custom property out of a specific selector block, last declaration
 * winning as the cascade does.
 *
 * Naive whole-file matching would be wrong twice over: `--ny-surface` is
 * declared in both the dark and light blocks, and `:root` opens three separate
 * blocks (primitives, dark semantics, theme-invariant). Either mistake passes
 * silently while comparing the wrong value.
 */
function cssVar(selector: string, name: string): string {
  const matching = blocks.filter((block) => block.selectors.includes(selector))
  if (matching.length === 0) throw new Error(`no "${selector}" block in tokens.css`)

  let found: string | undefined
  for (const block of matching) {
    const declaration = new RegExp(`--${name}:\\s*([^;]+);`).exec(block.body)
    if (declaration) found = declaration[1].trim()
  }
  if (found === undefined) throw new Error(`no --${name} in any "${selector}" block`)
  return found
}

/**
 * Resolves one level of `var(--x)` indirection against the primitive ramps, so
 * a semantic token declared as `var(--ny-ink-1)` compares as its literal hex.
 */
function resolve(value: string): string {
  const reference = /^var\(--([a-z0-9-]+)\)$/.exec(value)
  if (!reference) return value
  const primitive = new RegExp(`--${reference[1]}:\\s*([^;]+);`).exec(base)
  if (!primitive) throw new Error(`--${reference[1]} is referenced but never defined`)
  return primitive[1].trim()
}

describe('tokens.ts mirrors tokens.css', () => {
  it('delta colours', () => {
    expect(deltaColors.positive).toBe(cssVar(':root', 'ny-positive'))
    expect(deltaColors.negative).toBe(cssVar(':root', 'ny-negative'))
    expect(deltaColors.neutral).toBe(cssVar(':root', 'ny-neutral'))
  })

  it('accent', () => {
    expect(accent.base).toBe(cssVar(':root', 'ny-accent'))
    expect(accent.hover).toBe(cssVar(':root', 'ny-accent-hover'))
    expect(accent.active).toBe(cssVar(':root', 'ny-accent-active'))
  })

  it('dark surfaces', () => {
    const dark = '[data-theme="dark"]'
    expect(surfaces.dark.bg).toBe(resolve(cssVar(dark, 'ny-bg')))
    expect(surfaces.dark.surface).toBe(resolve(cssVar(dark, 'ny-surface')))
    expect(surfaces.dark.surfaceSunken).toBe(resolve(cssVar(dark, 'ny-surface-sunken')))
    expect(surfaces.dark.surfaceHover).toBe(resolve(cssVar(dark, 'ny-surface-hover')))
    expect(surfaces.dark.surfaceSelected).toBe(resolve(cssVar(dark, 'ny-surface-selected')))
    expect(surfaces.dark.border).toBe(resolve(cssVar(dark, 'ny-border')))
    expect(surfaces.dark.text).toBe(resolve(cssVar(dark, 'ny-text')))
    expect(surfaces.dark.textMuted).toBe(resolve(cssVar(dark, 'ny-text-muted')))
    expect(surfaces.dark.textSubtle).toBe(resolve(cssVar(dark, 'ny-text-subtle')))
  })

  it('light surfaces', () => {
    const light = '[data-theme="light"]'
    expect(surfaces.light.bg).toBe(resolve(cssVar(light, 'ny-bg')))
    expect(surfaces.light.surface).toBe(resolve(cssVar(light, 'ny-surface')))
    expect(surfaces.light.surfaceSunken).toBe(resolve(cssVar(light, 'ny-surface-sunken')))
    expect(surfaces.light.surfaceHover).toBe(resolve(cssVar(light, 'ny-surface-hover')))
    expect(surfaces.light.surfaceSelected).toBe(resolve(cssVar(light, 'ny-surface-selected')))
    expect(surfaces.light.border).toBe(resolve(cssVar(light, 'ny-border')))
    expect(surfaces.light.text).toBe(resolve(cssVar(light, 'ny-text')))
    expect(surfaces.light.textMuted).toBe(resolve(cssVar(light, 'ny-text-muted')))
    expect(surfaces.light.textSubtle).toBe(resolve(cssVar(light, 'ny-text-subtle')))
  })

  it('fonts', () => {
    // The CSS uses double quotes and the TS single; compare on family names.
    const normalise = (stack: string) => stack.replace(/["']/g, '')
    expect(normalise(fonts.sans)).toBe(normalise(cssVar(':root', 'ny-font-sans')))
    expect(normalise(fonts.mono)).toBe(normalise(cssVar(':root', 'ny-font-mono')))
  })

  it('motion', () => {
    expect(motion.easeStandard).toBe(cssVar(':root', 'ny-ease-standard'))
    expect(motion.durationFast).toBe(cssVar(':root', 'ny-duration-fast'))
    expect(motion.durationBase).toBe(cssVar(':root', 'ny-duration-base'))
    expect(motion.durationSlow).toBe(cssVar(':root', 'ny-duration-slow'))
  })

  it('breakpoints', () => {
    for (const [name, value] of Object.entries(breakpoints)) {
      expect(`${value}px`, `--ny-bp-${name}`).toBe(cssVar(':root', `ny-bp-${name}`))
    }
  })

  it('z-index layers', () => {
    for (const [name, value] of Object.entries(zIndex)) {
      expect(String(value), `--ny-z-${name}`).toBe(cssVar(':root', `ny-z-${name}`))
    }
  })

  it('spacing scale', () => {
    for (const [name, value] of Object.entries(space)) {
      const expected = value === 0 ? '0' : `${value}px`
      expect(expected, `--ny-space-${name}`).toBe(cssVar(':root', `ny-space-${name}`))
    }
  })
})

describe('tokens.css invariants', () => {
  it('never puts a custom property inside a @media condition', () => {
    // `@media (min-width: var(--ny-bp-md))` is invalid CSS and fails silently,
    // so this mistake is invisible without a check like this one.
    const offenders = source.match(/@media[^{]*var\(--[^)]+\)[^{]*\{/g)
    expect(offenders ?? []).toEqual([])
  })

  it('only ever breaks at the four declared breakpoints', () => {
    const widths = [...source.matchAll(/@media[^{]*\((?:min|max)-width:\s*([^)]+)\)/g)].map((m) =>
      m[1].trim(),
    )
    const allowed = new Set(['480px', '767px', '768px', '1023px', '1024px', '1279px', '1280px'])
    for (const width of widths) expect(allowed.has(width), `unexpected breakpoint ${width}`).toBe(true)
  })
})

/**
 * Every tone must carry the same slots. This is the whole point of the tone
 * ramps: a component resolves `--ny-{tone}-{slot}` from a variable tone, so a
 * single missing slot is a `var()` that silently resolves to nothing.
 */
describe('tone ramps are uniform', () => {
  const TONES = ['accent', 'success', 'warning', 'danger', 'info', 'neutral']
  const INVARIANT_SLOTS = ['hover', 'active']
  const THEMED_SLOTS = ['subtle', 'subtle-hover', 'border', 'text']

  it('declares every solid state for every tone', () => {
    const missing: string[] = []
    for (const tone of TONES) {
      for (const slot of INVARIANT_SLOTS) {
        try {
          cssVar(':root', `ny-${tone}-${slot}`)
        } catch {
          missing.push(`--ny-${tone}-${slot}`)
        }
      }
      // The base fill itself, wherever it is declared.
      if (!new RegExp(`--ny-${tone}:`).test(base)) missing.push(`--ny-${tone}`)
      if (!new RegExp(`--ny-text-on-${tone}:`).test(base)) missing.push(`--ny-text-on-${tone}`)
    }
    expect(missing).toEqual([])
  })

  it('declares every themed slot for every tone, in both themes', () => {
    const missing: string[] = []
    for (const theme of ['[data-theme="dark"]', '[data-theme="light"]']) {
      for (const tone of TONES) {
        for (const slot of THEMED_SLOTS) {
          try {
            cssVar(theme, `ny-${tone}-${slot}`)
          } catch {
            missing.push(`${theme} --ny-${tone}-${slot}`)
          }
        }
      }
    }
    expect(missing).toEqual([])
  })
})
