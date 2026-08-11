import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { Badge } from './Badge'

const TONES = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const

describe('Badge', () => {
  it('renders its content as text, so it is announced inline with the row', () => {
    renderInTheme(<Badge>Active</Badge>)

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('defaults to the neutral subtle badge at md', () => {
    renderInTheme(<Badge>Active</Badge>)

    expect(screen.getByText('Active')).toHaveClass(
      'ny-badge',
      'ny-tone--neutral',
      'ny-badge--subtle',
      'ny-badge--md',
    )
  })

  it('applies tone, variant and size independently, and keeps a caller className', () => {
    renderInTheme(
      <Badge tone="danger" variant="solid" size="sm" className="custom">
        Failed
      </Badge>,
    )

    expect(screen.getByText('Failed')).toHaveClass(
      'ny-tone--danger',
      'ny-badge--solid',
      'ny-badge--sm',
      'custom',
    )
  })

  it('has no axe violations across every tone and variant', async () => {
    const { container } = renderInTheme(
      TONES.map((tone) => (
        <div key={tone}>
          <Badge tone={tone}>{tone} subtle</Badge>
          <Badge tone={tone} variant="solid">
            {tone} solid
          </Badge>
          <Badge tone={tone} variant="outline">
            {tone} outline
          </Badge>
        </div>
      )),
    )

    await expectNoAxeViolations(container)
  })
})
