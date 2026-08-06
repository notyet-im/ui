import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

/**
 * Guards the two-category contract, which nothing else can catch.
 *
 * design-sync derives a component's group from `titleParts` in
 * `.ds-sync/lib/common.mjs`: it scans the title's segments right-to-left for the
 * first that is a real export, then takes **the segment immediately before it**.
 * So `UI/Forms/Button` yields a group called `forms`, silently creating a third
 * category — and a component whose title doesn't resolve vanishes from the sync
 * with no error at all.
 *
 * Both failures are invisible until someone opens the published project. Hence
 * a test.
 */

const ALLOWED_GROUPS = ['UI', 'Charts', 'Foundations', 'Showcase']
const TITLE = /^(UI|Charts|Foundations|Showcase)\/[A-Za-z][A-Za-z0-9]*$/

const root = process.cwd()

const storyFiles = execSync('git ls-files "src/**/*.stories.tsx"', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)

/** Untracked stories count too — agents add files before they are committed. */
const untracked = execSync('git ls-files --others --exclude-standard "src/**/*.stories.tsx"', {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)

const allStoryFiles = [...new Set([...storyFiles, ...untracked])]

const titles = allStoryFiles.map((file) => {
  const source = readFileSync(join(root, file), 'utf8')
  const match = /^\s*title:\s*'([^']+)'/m.exec(source)
  return { file, title: match?.[1] }
})

const barrel = readFileSync(join(root, 'src/index.ts'), 'utf8')
/** Every name the barrel re-exports as a value. */
const exported = new Set(
  [...barrel.matchAll(/export\s*\{([^}]*)\}/g)]
    .filter((match) => !/export\s*type/.test(match[0]))
    .flatMap((match) => match[1].split(','))
    .map((name) => name.trim().split(/\s+as\s+/).pop() ?? '')
    .filter(Boolean),
)

describe('story titles', () => {
  it('every story file declares a title', () => {
    const missing = titles.filter((t) => t.title === undefined).map((t) => t.file)
    expect(missing).toEqual([])
  })

  it('is exactly two segments from an allowed group', () => {
    const bad = titles
      .filter((t) => t.title !== undefined && !TITLE.test(t.title))
      .map((t) => `${t.file}: '${t.title}'`)
    expect(bad, `titles must match ${TITLE} — groups: ${ALLOWED_GROUPS.join(', ')}`).toEqual([])
  })

  it('never uses three segments', () => {
    // Called out separately because this is the failure with no error message:
    // it produces a valid-looking sync with an extra group nobody asked for.
    const threeSegment = titles
      .filter((t) => (t.title?.split('/').length ?? 0) > 2)
      .map((t) => `${t.file}: '${t.title}'`)
    expect(threeSegment).toEqual([])
  })

  it('has one story file per title', () => {
    const seen = new Map<string, string[]>()
    for (const { file, title } of titles) {
      if (title === undefined) continue
      seen.set(title, [...(seen.get(title) ?? []), file])
    }
    const duplicated = [...seen.entries()]
      .filter(([, files]) => files.length > 1)
      .map(([title, files]) => `${title}: ${files.join(', ')}`)
    expect(duplicated).toEqual([])
  })

  it('names a real export in UI/ and Charts/', () => {
    const unresolved = titles
      .filter((t) => t.title !== undefined && /^(UI|Charts)\//.test(t.title))
      .filter((t) => !exported.has(t.title?.split('/')[1] ?? ''))
      .map((t) => `${t.title} (${t.file})`)
    expect(
      unresolved,
      'these components are not exported from src/index.ts, so design-sync will drop them silently',
    ).toEqual([])
  })

  it('never names a Foundations page after a real export', () => {
    // `titleMap` is keyed by the derived component name, so nulling a docs page
    // called `Grid` would also null the real `UI/Grid` component.
    const collisions = titles
      .filter((t) => t.title?.startsWith('Foundations/'))
      .map((t) => t.title?.split('/')[1] ?? '')
      .filter((name) => exported.has(name))
    expect(collisions, 'rename the docs page — it would null the real component').toEqual([])
  })
})
