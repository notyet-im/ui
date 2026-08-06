import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Runs axe against a rendered container and fails with a readable report.
 *
 * `color-contrast` is disabled: jsdom performs no layout or paint, so axe
 * cannot resolve computed colors and the rule reports "incomplete" on
 * everything. Contrast is verified visually instead, through the design-sync
 * storybook compare loop, which renders in real chromium.
 */
export async function expectNoAxeViolations(container: HTMLElement): Promise<void> {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  })

  if (results.violations.length === 0) return

  const report = results.violations
    .map((violation) => {
      const targets = violation.nodes.map((node) => `      ${node.target.join(' ')}`).join('\n')
      return `  [${violation.impact}] ${violation.id} — ${violation.help}\n${targets}\n      ${violation.helpUrl}`
    })
    .join('\n\n')

  expect.fail(`axe found ${results.violations.length} violation(s):\n\n${report}`)
}
