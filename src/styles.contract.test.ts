import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Every `.ny-*` class a component emits must exist in a stylesheet.
 *
 * This exists because it did not. Folding `IconButton` into `Button` deleted
 * `.ny-icon-button` and, because the two blocks were adjacent in the same file,
 * silently took `.ny-select` with it. `Select` then shipped — through a build, a
 * full test suite, and a design-system sync — rendering an unstyled native
 * dropdown with a chevron floating loose beside it. Nothing caught it: jsdom
 * applies no stylesheets, so no unit test can see a missing rule, and the
 * component still passed every behavioural and axe assertion it had.
 *
 * The class name is the seam between the two halves of a component, and it is
 * the only part of that seam nothing else checks. So check it here.
 */

const SRC = join(process.cwd(), 'src')

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path, out)
    else out.push(path)
  }
  return out
}

const files = walk(SRC)
const sources = files.filter(
  (f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx') && !f.endsWith('.stories.tsx'),
)
const stylesheets = files.filter((f) => f.endsWith('.css'))

/**
 * Comments are stripped first. A stylesheet that *mentions* a class in prose —
 * "`.ny-matrix*`, nine selectors mirroring these" — was being read as defining
 * it, so a class could be deleted, described in the comment explaining its
 * deletion, and still pass. Which is exactly what happened.
 */
const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g

/** Each stylesheet, stripped, with its path — read once and shared by the checks below. */
const sheets = stylesheets.map((f) => [f, readFileSync(f, 'utf8').replace(BLOCK_COMMENT, '')] as const)

const css = sheets.map(([, text]) => text).join('\n')

/** Class names a stylesheet defines a rule for. */
const defined = new Set<string>()
for (const match of css.matchAll(/\.(ny-[a-zA-Z0-9_-]+)/g)) defined.add(match[1])

/**
 * Strips `key={…}` attributes.
 *
 * React keys are namespaced the same way class names are — `ny-breadcrumb-item-0`
 * — but no stylesheet should define them, so they would read as false failures.
 * Brace-matched rather than regexed, because a key is often a template literal
 * and `${…}` closes a naive `[^}]*`.
 */
function stripKeys(text: string): string {
  let out = ''
  let i = 0
  while (i < text.length) {
    const at = text.indexOf('key={', i)
    if (at === -1) return out + text.slice(i)
    out += text.slice(i, at)
    let depth = 0
    let j = at + 4
    for (; j < text.length; j++) {
      if (text[j] === '{') depth++
      else if (text[j] === '}' && --depth === 0) break
    }
    i = j + 1
  }
  return out
}

/**
 * Emitted class names, split by how they are written.
 *
 * Both are checked by prefix rather than exact match, because a root class
 * legitimately carries no rule of its own when its modifiers do all the work —
 * `.ny-skeleton` has no block, but `.ny-skeleton--rect` does. What the prefix
 * rule still catches is a whole family vanishing at once, which is exactly how
 * `.ny-select` was lost.
 *
 * Comments are stripped rather than requiring the name to sit against a quote.
 * The quote rule kept prose out, but it also meant a name had to be the *whole*
 * string: `"ny-select__input ny-input"` matched nothing, and neither did any
 * `${cond ? ' ny-x--y' : ''}` modifier. That hid 61 of the 244 class names in
 * the codebase — `ny-select__input` among them, the one this test exists for.
 *
 * `--ny-*` is excluded: a custom property is not a class, and components set
 * plenty of them inline.
 */
const literals = new Map<string, string>()
const prefixes = new Map<string, string>()

function stripComments(text: string): string {
  return text.replace(BLOCK_COMMENT, '').replace(/\/\/[^\n]*/g, '')
}

for (const file of sources) {
  const text = stripComments(stripKeys(readFileSync(file, 'utf8')))
  const rel = file.slice(SRC.length + 1)

  for (const match of text.matchAll(/`(ny-[a-zA-Z0-9_-]*)\$\{/g)) {
    if (!prefixes.has(match[1])) prefixes.set(match[1], rel)
  }

  // Trailing `-` is trimmed: the static head of a template literal is a prefix,
  // and the loop above already holds it as one.
  for (const match of text.matchAll(/(?<!-)\bny-[a-zA-Z0-9_-]*[a-zA-Z0-9_]/g)) {
    if (!literals.has(match[0])) literals.set(match[0], rel)
  }
}

const definedList = [...defined]
const isStyled = (name: string) => definedList.some((seen) => seen.startsWith(name))

describe('style contract', () => {
  it('finds components and stylesheets to check', () => {
    expect(sources.length).toBeGreaterThan(20)
    expect(stylesheets.length).toBeGreaterThan(20)
    expect(literals.size).toBeGreaterThan(50)
  })

  it('defines a rule for every class a component emits', () => {
    const missing = [...literals]
      .filter(([name]) => !isStyled(name))
      .map(([name, file]) => `${name}  (emitted by ${file})`)

    expect(missing, `no stylesheet defines:\n  ${missing.join('\n  ')}`).toEqual([])
  })

  it('defines a rule for every class family built from a template', () => {
    const orphaned = [...prefixes]
      .filter(([prefix]) => !isStyled(prefix))
      .map(([prefix, file]) => `${prefix}*  (built in ${file})`)

    expect(orphaned, `no stylesheet defines any of:\n  ${orphaned.join('\n  ')}`).toEqual([])
  })

  /**
   * The same failure as above wearing different clothes: CSS that jsdom cannot
   * see, shipping past every behavioural and axe assertion the component has.
   *
   * A `<button>` carries a UA border — `2px outset ButtonBorder` — and clearing
   * its background is what stops the native widget rendering and lets that
   * border paint. `Pagination` overrode only `border-bottom`, so every page
   * number sat in a three-sided grey box with an open bottom, and its two state
   * rules set the `border-color` *shorthand*, which coloured all four sides:
   * the current page rendered as a solid accent rectangle. The stylesheet's own
   * comment said "a rule under the digit, not a box around it".
   *
   * `appearance: none` is deliberately not an exemption: it drops the native
   * widget but leaves the UA border declaration standing, so such a rule still
   * has to reset the box. Chrome computes `2px outset` either way.
   *
   * Keyed on `cursor: pointer`, which finds the rule that *is* a whole control.
   * That is the limit, and it is deliberate: a bare background split into a
   * separate modifier rule is not caught — `.ny-button--ghost` is one, and is
   * correct only because `.ny-button` sets the border above it. The single-rule
   * control is what this misses nothing on, and is how the bug got in.
   */
  it('resets the native border on every control that clears its own background', () => {
    const unreset: string[] = []

    for (const [file, text] of sheets) {
      for (const rule of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const [, selector, body] = rule
        if (!/background:\s*(none|transparent)/.test(body)) continue
        if (!/cursor:\s*pointer/.test(body)) continue
        // `(?<!-)` so a custom property does not read as a reset: `.ny-switch`
        // declares `--ny-switch-track-border: 1px` beside its real `border: 0`.
        if (/(?<!-)\bborder:\s*(0|none|\d)/.test(body)) continue
        unreset.push(`${selector.trim()}  (in ${file.slice(SRC.length + 1)})`)
      }
    }

    expect(unreset, `clears its background but leaves the UA border:\n  ${unreset.join('\n  ')}`).toEqual([])
  })
})
