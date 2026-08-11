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
const css = stylesheets.map((f) => readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')).join('\n')

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
 */
const literals = new Map<string, string>()
const prefixes = new Map<string, string>()

for (const file of sources) {
  const text = stripKeys(readFileSync(file, 'utf8'))
  const rel = file.slice(SRC.length + 1)

  for (const match of text.matchAll(/`(ny-[a-zA-Z0-9_-]*)\$\{/g)) {
    if (!prefixes.has(match[1])) prefixes.set(match[1], rel)
  }

  // Quoted strings only — a bare `ny-` in prose or a comment is not a class.
  for (const match of text.matchAll(/['"](ny-[a-zA-Z0-9_-]+)['"]/g)) {
    if (!literals.has(match[1])) literals.set(match[1], rel)
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
})
