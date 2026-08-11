import type { CSSProperties, ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { Container, Grid, GridItem, Stack } from './Layout'

/**
 * These components have no visible behaviour of their own — what they *do* is
 * emit custom properties that `Layout.css` reads inside its four media queries.
 * So that is what is asserted here: the exact properties, their fill-forward
 * cascade, and that a caller's `style` still beats them.
 */

function renderLayout(ui: ReactElement) {
  const { container } = renderInTheme(ui)
  return container
}

function find(container: HTMLElement, selector: string): HTMLElement {
  const element = container.querySelector<HTMLElement>(selector)
  if (element === null) throw new Error(`nothing matched "${selector}" in the rendered output`)
  return element
}

function cssVar(element: HTMLElement, name: string): string {
  return element.style.getPropertyValue(name).trim()
}

describe('Container', () => {
  it('defaults to the lg measure', () => {
    const container = renderLayout(<Container>page</Container>)
    expect(find(container, '.ny-container').className).toBe('ny-container ny-container--lg')
  })

  it('applies the size modifier and keeps the caller className', () => {
    const container = renderLayout(
      <Container size="sm" className="report">
        page
      </Container>,
    )
    expect(find(container, '.ny-container').className).toBe('ny-container ny-container--sm report')
  })

  it('passes the caller style through', () => {
    const container = renderLayout(<Container style={{ paddingBlock: '8px' }}>page</Container>)
    expect(find(container, '.ny-container').style.paddingBlock).toBe('8px')
  })
})

describe('Grid', () => {
  it('emits the default column count and no gap properties', () => {
    const grid = find(renderLayout(<Grid>cells</Grid>), '.ny-grid')
    expect(cssVar(grid, '--ny-grid-cols')).toBe('12')
    expect(cssVar(grid, '--ny-grid-col-gap')).toBe('')
    expect(cssVar(grid, '--ny-grid-row-gap')).toBe('')
  })

  it('accepts a scalar gap on both axes', () => {
    const grid = find(renderLayout(<Grid gap={16}>cells</Grid>), '.ny-grid')
    expect(cssVar(grid, '--ny-grid-col-gap')).toBe('var(--ny-space-16)')
    expect(cssVar(grid, '--ny-grid-row-gap')).toBe('var(--ny-space-16)')
  })

  it('accepts a Responsive gap, and fills sparse steps forward', () => {
    const grid = find(renderLayout(<Grid gap={{ base: 8, md: 24 }}>cells</Grid>), '.ny-grid')
    expect(cssVar(grid, '--ny-grid-row-gap')).toBe('var(--ny-space-8)')
    expect(cssVar(grid, '--ny-grid-row-gap-sm')).toBe('')
    expect(cssVar(grid, '--ny-grid-row-gap-md')).toBe('var(--ny-space-24)')
    // Filled forward: a value set at md has to survive lg and xl, because the
    // media queries are min-width and all of them still match up there.
    expect(cssVar(grid, '--ny-grid-row-gap-lg')).toBe('var(--ny-space-24)')
    expect(cssVar(grid, '--ny-grid-row-gap-xl')).toBe('var(--ny-space-24)')
  })

  it('emits a zero gap rather than dropping it', () => {
    const grid = find(renderLayout(<Grid gap={0}>cells</Grid>), '.ny-grid')
    expect(cssVar(grid, '--ny-grid-col-gap')).toBe('var(--ny-space-0)')
  })

  it('lets columnGap and rowGap override gap per axis', () => {
    const grid = find(
      renderLayout(
        <Grid gap={16} columnGap={32}>
          cells
        </Grid>,
      ),
      '.ny-grid',
    )
    expect(cssVar(grid, '--ny-grid-col-gap')).toBe('var(--ny-space-32)')
    expect(cssVar(grid, '--ny-grid-row-gap')).toBe('var(--ny-space-16)')
  })

  it('emits one property per declared breakpoint for columns', () => {
    const grid = find(
      renderLayout(<Grid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 6 }}>cells</Grid>),
      '.ny-grid',
    )
    expect(cssVar(grid, '--ny-grid-cols')).toBe('1')
    expect(cssVar(grid, '--ny-grid-cols-sm')).toBe('2')
    expect(cssVar(grid, '--ny-grid-cols-md')).toBe('3')
    expect(cssVar(grid, '--ny-grid-cols-lg')).toBe('4')
    expect(cssVar(grid, '--ny-grid-cols-xl')).toBe('6')
  })

  it('adds an alignment modifier only when asked', () => {
    expect(find(renderLayout(<Grid>cells</Grid>), '.ny-grid').className).toBe('ny-grid')
    const aligned = find(renderLayout(<Grid align="center">cells</Grid>), '.ny-grid')
    expect(aligned.className).toBe('ny-grid ny-grid--align-center')
  })

  it('lets the caller style win over the generated properties', () => {
    const grid = find(
      renderLayout(
        <Grid columns={12} gap={16} style={{ '--ny-grid-cols': '5', outline: 'none' } as CSSProperties}>
          cells
        </Grid>,
      ),
      '.ny-grid',
    )
    expect(cssVar(grid, '--ny-grid-cols')).toBe('5')
    expect(cssVar(grid, '--ny-grid-col-gap')).toBe('var(--ny-space-16)')
    expect(grid.style.outline).toBe('none')
  })
})

describe('GridItem', () => {
  it('emits nothing until it is given a span', () => {
    const item = find(renderLayout(<GridItem>cell</GridItem>), '.ny-grid-item')
    expect(cssVar(item, '--ny-grid-span')).toBe('')
    expect(cssVar(item, '--ny-grid-start')).toBe('')
  })

  it('emits a scalar span and a start line', () => {
    const item = find(renderLayout(<GridItem span={4} start={3} />), '.ny-grid-item')
    expect(cssVar(item, '--ny-grid-span')).toBe('4')
    expect(cssVar(item, '--ny-grid-start')).toBe('3')
  })

  it('emits a Responsive span across the breakpoints', () => {
    const item = find(renderLayout(<GridItem span={{ base: 12, md: 6, xl: 3 }} />), '.ny-grid-item')
    expect(cssVar(item, '--ny-grid-span')).toBe('12')
    expect(cssVar(item, '--ny-grid-span-sm')).toBe('')
    expect(cssVar(item, '--ny-grid-span-md')).toBe('6')
    expect(cssVar(item, '--ny-grid-span-lg')).toBe('6')
    expect(cssVar(item, '--ny-grid-span-xl')).toBe('3')
  })
})

describe('Stack', () => {
  it('is a column with no modifiers by default', () => {
    const stack = find(renderLayout(<Stack>rows</Stack>), '.ny-stack')
    expect(stack.className).toBe('ny-stack')
    expect(cssVar(stack, '--ny-stack-gap')).toBe('')
  })

  it('carries direction, alignment and wrap as static modifiers', () => {
    const stack = find(
      renderLayout(
        <Stack direction="row" align="center" justify="between" wrap>
          rows
        </Stack>,
      ),
      '.ny-stack',
    )
    expect(stack.className).toBe(
      'ny-stack ny-stack--row ny-stack--align-center ny-stack--justify-between ny-stack--wrap',
    )
  })

  it('accepts a scalar gap', () => {
    const stack = find(renderLayout(<Stack gap={8}>rows</Stack>), '.ny-stack')
    expect(cssVar(stack, '--ny-stack-gap')).toBe('var(--ny-space-8)')
  })

  it('accepts a Responsive gap', () => {
    const stack = find(renderLayout(<Stack gap={{ base: 4, lg: 20 }}>rows</Stack>), '.ny-stack')
    expect(cssVar(stack, '--ny-stack-gap')).toBe('var(--ny-space-4)')
    expect(cssVar(stack, '--ny-stack-gap-md')).toBe('')
    expect(cssVar(stack, '--ny-stack-gap-lg')).toBe('var(--ny-space-20)')
    expect(cssVar(stack, '--ny-stack-gap-xl')).toBe('var(--ny-space-20)')
  })

  it('lets the caller style win', () => {
    const stack = find(
      renderLayout(
        <Stack gap={8} style={{ '--ny-stack-gap': 'var(--ny-space-48)' } as CSSProperties}>
          rows
        </Stack>,
      ),
      '.ny-stack',
    )
    expect(cssVar(stack, '--ny-stack-gap')).toBe('var(--ny-space-48)')
  })
})

describe('composed layout', () => {
  it('has no axe violations', async () => {
    const container = renderLayout(
      <Container size="md">
        <Stack gap={16}>
          <h1>Flows</h1>
          <Grid columns={{ base: 1, md: 12 }} gap={{ base: 8, md: 24 }}>
            <GridItem span={{ base: 1, md: 8 }}>
              <p>Institutional</p>
            </GridItem>
            <GridItem span={{ base: 1, md: 4 }}>
              <p>ETF</p>
            </GridItem>
          </Grid>
        </Stack>
      </Container>,
    )
    await expectNoAxeViolations(container)
  })
})
