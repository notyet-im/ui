import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { Heading, Text, VisuallyHidden } from './Text'

describe('Text', () => {
  it('renders a span by default', () => {
    renderInTheme(<Text>Net flow</Text>)

    const el = screen.getByText('Net flow')
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveClass('ny-text', 'ny-text--size-md')
  })

  it('renders the element asked for by `as`', () => {
    renderInTheme(
      <>
        <Text as="p">paragraph</Text>
        <Text as="div">block</Text>
        <Text as="label">caption</Text>
      </>,
    )

    expect(screen.getByText('paragraph').tagName).toBe('P')
    expect(screen.getByText('block').tagName).toBe('DIV')
    expect(screen.getByText('caption').tagName).toBe('LABEL')
  })

  it('emits a modifier class per size', () => {
    renderInTheme(
      <>
        <Text size="2xs">micro</Text>
        <Text size="lg">lead</Text>
      </>,
    )

    expect(screen.getByText('micro')).toHaveClass('ny-text--size-2xs')
    expect(screen.getByText('lead')).toHaveClass('ny-text--size-lg')
  })

  it('only emits weight, tone and align when they are set, so they otherwise inherit', () => {
    renderInTheme(
      <>
        <Text>plain</Text>
        <Text weight="semibold" tone="negative" align="end">
          styled
        </Text>
      </>,
    )

    const plain = screen.getByText('plain')
    expect(plain.className).not.toMatch(/ny-text--(weight|tone|align)-/)

    expect(screen.getByText('styled')).toHaveClass(
      'ny-text--weight-semibold',
      'ny-ink--negative',
      'ny-text--align-end',
    )
  })

  it('applies the numeric and truncate modifiers', () => {
    renderInTheme(
      <Text numeric truncate>
        +1,284.05
      </Text>,
    )

    expect(screen.getByText('+1,284.05')).toHaveClass('ny-text--numeric', 'ny-truncate')
  })

  it('keeps a caller className alongside the modifiers', () => {
    renderInTheme(<Text className="app-total">total</Text>)

    expect(screen.getByText('total')).toHaveClass('ny-text', 'ny-text--size-md', 'app-total')
  })
})

describe('Heading', () => {
  it('renders an h2 at size xl by default', () => {
    renderInTheme(<Heading>Ticker-level extremes</Heading>)

    const el = screen.getByRole('heading', { level: 2, name: 'Ticker-level extremes' })
    expect(el).toHaveClass('ny-heading', 'ny-heading--size-xl')
  })

  it('keeps level and size independent', () => {
    renderInTheme(
      <Heading as="h3" size="4xl">
        Display at level three
      </Heading>,
    )

    const el = screen.getByRole('heading', { level: 3, name: 'Display at level three' })
    expect(el.tagName).toBe('H3')
    expect(el).toHaveClass('ny-heading--size-4xl')
    expect(el.className).not.toMatch(/ny-heading--size-(lg|xl|2xl|3xl)\b/)
  })

  it('applies tone and truncate modifiers', () => {
    renderInTheme(
      <Heading tone="positive" truncate>
        Inflows
      </Heading>,
    )

    expect(screen.getByRole('heading', { name: 'Inflows' })).toHaveClass('ny-ink--positive', 'ny-truncate')
  })
})

describe('VisuallyHidden', () => {
  it('stays in the accessibility tree', () => {
    renderInTheme(
      <button type="button">
        ↑<VisuallyHidden>Sort ascending</VisuallyHidden>
      </button>,
    )

    // Resolving the button by this name is the assertion: the hidden run is part
    // of its computed accessible name.
    expect(screen.getByRole('button', { name: '↑Sort ascending' })).toBeInTheDocument()
  })

  it('is clipped out of the visual layout', () => {
    renderInTheme(<VisuallyHidden>Figures in billions</VisuallyHidden>)

    const el = screen.getByText('Figures in billions')
    expect(el).toHaveClass('ny-visually-hidden')

    // The clip comes from styles/base.css, which ThemeProvider imports — the
    // component must not redefine it.
    const styles = getComputedStyle(el)
    expect(styles.position).toBe('absolute')
    expect(styles.width).toBe('1px')
    expect(styles.height).toBe('1px')
    expect(styles.overflow).toBe('hidden')
  })

  it('renders the element asked for by `as`', () => {
    renderInTheme(
      <>
        <VisuallyHidden>inline</VisuallyHidden>
        <VisuallyHidden as="div">block</VisuallyHidden>
      </>,
    )

    expect(screen.getByText('inline').tagName).toBe('SPAN')
    expect(screen.getByText('block').tagName).toBe('DIV')
  })
})

describe('accessibility', () => {
  it('has no axe violations across the three components', async () => {
    const { container } = renderInTheme(
      <div>
        <Heading as="h1" size="3xl">
          Cross-border equity flows
        </Heading>
        <Heading as="h2" size="lg" tone="muted">
          Regional breakdown
          <VisuallyHidden>, sorted by net flow</VisuallyHidden>
        </Heading>
        <Text as="p" size="sm" tone="muted">
          Net institutional flow turned positive in the last five sessions.
        </Text>
        <Text size="sm" tone="positive" numeric>
          +1,284.05
        </Text>
      </div>,
    )

    await expectNoAxeViolations(container)
  })
})
