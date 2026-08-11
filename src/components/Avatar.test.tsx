import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme, themed } from '../test/render'
import { Avatar } from './Avatar'

const PORTRAIT = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"/>'

describe('Avatar', () => {
  it('renders the image, named by `name`, when `src` loads', () => {
    renderInTheme(<Avatar name="Ada Lovelace" src={PORTRAIT} />)

    const image = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(image.tagName).toBe('IMG')
    expect(image).toHaveAttribute('src', PORTRAIT)
  })

  it('falls back to initials when there is no `src`', () => {
    renderInTheme(<Avatar name="Ada Lovelace" />)

    const fallback = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(fallback).toHaveTextContent('AL')
  })

  it('falls back to initials when the image fails to load', () => {
    renderInTheme(<Avatar name="Grace Hopper" src="https://example.invalid/missing.png" />)

    fireEvent.error(screen.getByRole('img', { name: 'Grace Hopper' }))

    const fallback = screen.getByRole('img', { name: 'Grace Hopper' })
    expect(fallback.tagName).not.toBe('IMG')
    expect(fallback).toHaveTextContent('GH')
  })

  it('retries when `src` changes after a failure', () => {
    const { rerender } = renderInTheme(
      <Avatar name="Grace Hopper" src="https://example.invalid/missing.png" />,
    )

    fireEvent.error(screen.getByRole('img', { name: 'Grace Hopper' }))
    expect(screen.getByRole('img', { name: 'Grace Hopper' })).toHaveTextContent('GH')

    rerender(themed(<Avatar name="Grace Hopper" src={PORTRAIT} />))

    expect(screen.getByRole('img', { name: 'Grace Hopper' }).tagName).toBe('IMG')
  })

  it('takes one letter for a single-word name and the outer two otherwise', () => {
    renderInTheme(
      <>
        <Avatar name="grace" />
        <Avatar name="Katherine Coleman Goble Johnson" />
      </>,
    )

    expect(screen.getByRole('img', { name: 'grace' })).toHaveTextContent('G')
    expect(screen.getByRole('img', { name: 'Katherine Coleman Goble Johnson' })).toHaveTextContent('KJ')
  })

  it('has no axe violations in either state, at any size', async () => {
    const { container } = renderInTheme(
      <>
        <Avatar name="Ada Lovelace" src={PORTRAIT} size="sm" />
        <Avatar name="Grace Hopper" size="md" />
        <Avatar name="Bridgewater Associates" size="lg" shape="square" />
      </>,
    )

    await expectNoAxeViolations(container)
  })
})
