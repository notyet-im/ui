import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { Avatar } from './Avatar'
import { ThemeProvider } from './ThemeProvider'

const PORTRAIT = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"/>'

describe('Avatar', () => {
  it('renders the image, named by `name`, when `src` loads', () => {
    render(
      <ThemeProvider>
        <Avatar name="Ada Lovelace" src={PORTRAIT} />
      </ThemeProvider>,
    )

    const image = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(image.tagName).toBe('IMG')
    expect(image).toHaveAttribute('src', PORTRAIT)
  })

  it('falls back to initials when there is no `src`', () => {
    render(
      <ThemeProvider>
        <Avatar name="Ada Lovelace" />
      </ThemeProvider>,
    )

    const fallback = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(fallback).toHaveTextContent('AL')
  })

  it('falls back to initials when the image fails to load', () => {
    render(
      <ThemeProvider>
        <Avatar name="Grace Hopper" src="https://example.invalid/missing.png" />
      </ThemeProvider>,
    )

    fireEvent.error(screen.getByRole('img', { name: 'Grace Hopper' }))

    const fallback = screen.getByRole('img', { name: 'Grace Hopper' })
    expect(fallback.tagName).not.toBe('IMG')
    expect(fallback).toHaveTextContent('GH')
  })

  it('retries when `src` changes after a failure', () => {
    const { rerender } = render(
      <ThemeProvider>
        <Avatar name="Grace Hopper" src="https://example.invalid/missing.png" />
      </ThemeProvider>,
    )

    fireEvent.error(screen.getByRole('img', { name: 'Grace Hopper' }))
    expect(screen.getByRole('img', { name: 'Grace Hopper' })).toHaveTextContent('GH')

    rerender(
      <ThemeProvider>
        <Avatar name="Grace Hopper" src={PORTRAIT} />
      </ThemeProvider>,
    )

    expect(screen.getByRole('img', { name: 'Grace Hopper' }).tagName).toBe('IMG')
  })

  it('takes one letter for a single-word name and the outer two otherwise', () => {
    render(
      <ThemeProvider>
        <Avatar name="grace" />
        <Avatar name="Katherine Coleman Goble Johnson" />
      </ThemeProvider>,
    )

    expect(screen.getByRole('img', { name: 'grace' })).toHaveTextContent('G')
    expect(screen.getByRole('img', { name: 'Katherine Coleman Goble Johnson' })).toHaveTextContent('KJ')
  })

  it('has no axe violations in either state, at any size', async () => {
    const { container } = render(
      <ThemeProvider>
        <Avatar name="Ada Lovelace" src={PORTRAIT} size="sm" />
        <Avatar name="Grace Hopper" size="md" />
        <Avatar name="Bridgewater Associates" size="lg" shape="square" />
      </ThemeProvider>,
    )

    await expectNoAxeViolations(container)
  })
})
