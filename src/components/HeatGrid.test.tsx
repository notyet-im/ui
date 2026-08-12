import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoAxeViolations } from '../test/axe'
import { renderInTheme } from '../test/render'
import { HeatGrid, RotationMatrix } from './HeatGrid'

const rows = [
  { key: 'us', code: 'US', name: 'United States' },
  { key: 'kr', code: 'KR', name: 'Korea' },
]
const columns = [
  { key: 'semi', label: 'Semi' },
  { key: 'tech', label: 'Tech' },
]
const value = (row: string, column: string) => (row === 'us' && column === 'tech' ? 1.8 : 0)

/**
 * The grid roles are the point of this component's markup, not decoration.
 *
 * A cell's meaning is "the value where this row meets this column", and the only
 * thing that carries it is the header structure. Without these roles a readout
 * grid announced "+1.8" with nothing to say where it sat — which is exactly what
 * happened when inert cells stopped being buttons and lost their `aria-label`.
 */
describe('HeatGrid semantics', () => {
  it('exposes a named grid of rows, headers and cells', () => {
    renderInTheme(<HeatGrid label="Region by sector" rows={rows} columns={columns} value={value} />)

    const grid = screen.getByRole('grid', { name: 'Region by sector' })
    // One header row plus one per data row.
    expect(within(grid).getAllByRole('row')).toHaveLength(3)
    // The blank corner counts — it keeps each column aligned with its header.
    expect(within(grid).getAllByRole('columnheader')).toHaveLength(3)
    expect(within(grid).getAllByRole('rowheader')).toHaveLength(2)
    expect(within(grid).getAllByRole('gridcell')).toHaveLength(4)
  })

  it('names each row and column header from the data', () => {
    renderInTheme(<HeatGrid label="Flows" rows={rows} columns={columns} value={value} />)

    expect(screen.getByRole('columnheader', { name: 'Semi' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: /United States/ })).toBeInTheDocument()
  })

  it('puts no button in a cell when there is nowhere for a click to go', () => {
    renderInTheme(<HeatGrid label="Flows" rows={rows} columns={columns} value={value} />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.getAllByRole('gridcell')).toHaveLength(4)
  })

  it('nests a real button in each cell when it can be selected', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderInTheme(<HeatGrid label="Flows" rows={rows} columns={columns} value={value} onSelect={onSelect} />)

    const cells = screen.getAllByRole('gridcell')
    expect(cells).toHaveLength(4)

    // The button is inside the cell rather than replacing it: the cell keeps the
    // grid role, the button keeps native activation.
    const button = within(cells[1]).getByRole('button')
    await user.click(button)

    expect(onSelect).toHaveBeenCalledWith('us|tech', 'us', 'tech')
  })

  it('activates from the keyboard, because the cell holds a native button', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderInTheme(<HeatGrid label="Flows" rows={rows} columns={columns} value={value} onSelect={onSelect} />)

    await user.tab()
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('marks the selected cell with aria-pressed', () => {
    renderInTheme(
      <HeatGrid
        label="Flows"
        rows={rows}
        columns={columns}
        value={value}
        selectedKey="us|tech"
        onSelect={() => {}}
      />,
    )

    const pressed = screen.getAllByRole('button', { pressed: true })
    expect(pressed).toHaveLength(1)
  })

  it('has no axe violations in either mode', async () => {
    const { container: readout } = renderInTheme(
      <HeatGrid label="Readout" rows={rows} columns={columns} value={value} />,
    )
    await expectNoAxeViolations(readout)

    const { container: interactive } = renderInTheme(
      <HeatGrid label="Drill down" rows={rows} columns={columns} value={value} onSelect={() => {}} />,
    )
    await expectNoAxeViolations(interactive)
  })
})

describe('RotationMatrix', () => {
  const codes = ['US', 'KR']
  const pair = (from: string, to: string) => (from === 'US' && to === 'KR' ? 5300 : 0)

  it('is a grid whose two axes are the same list', () => {
    renderInTheme(<RotationMatrix label="Region rotation" codes={codes} value={pair} />)

    const grid = screen.getByRole('grid', { name: 'Region rotation' })
    expect(within(grid).getAllByRole('rowheader')).toHaveLength(2)
    // Two columns plus the corner.
    expect(within(grid).getAllByRole('columnheader')).toHaveLength(3)
  })

  it('blanks the diagonal and leaves it inert', () => {
    renderInTheme(<RotationMatrix label="Region rotation" codes={codes} value={pair} />)

    // US→US and KR→KR carry the placeholder, not a value.
    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('has no axe violations', async () => {
    const { container } = renderInTheme(<RotationMatrix label="Region rotation" codes={codes} value={pair} />)
    await expectNoAxeViolations(container)
  })
})

/**
 * Roving focus is derived from `onSelect`, so all three branches need pinning:
 * the derived default, the explicit opt-out, and the explicit opt-in. The
 * default is the one worth guarding — it is the branch nobody writes down, and
 * a regression there silently returns a 63-cell grid to 63 tab stops.
 */
describe('HeatGrid roving focus', () => {
  const grid3x3 = {
    rows: [
      { key: 'a', code: 'A' },
      { key: 'b', code: 'B' },
      { key: 'c', code: 'C' },
    ],
    columns: [
      { key: 'x', label: 'X' },
      { key: 'y', label: 'Y' },
      { key: 'z', label: 'Z' },
    ],
    value: () => 1,
  }

  const tabIndexes = () => screen.getAllByRole('button').map((b) => b.getAttribute('tabindex'))

  it('is a single tab stop whenever the cells are selectable', () => {
    // No `roving` passed: a grid with `onSelect` derives it, because those are
    // exactly the cells that hold a focusable element.
    renderInTheme(<HeatGrid label="G" {...grid3x3} onSelect={() => {}} />)
    expect(tabIndexes().filter((t) => t === '0')).toHaveLength(1)
    expect(tabIndexes().filter((t) => t === '-1')).toHaveLength(8)
  })

  it('leaves every cell independently tabbable when opted out', () => {
    renderInTheme(<HeatGrid label="G" roving={false} {...grid3x3} onSelect={() => {}} />)
    expect(tabIndexes()).toEqual([null, null, null, null, null, null, null, null, null])
  })

  it('collapses to a single tab stop when asked explicitly', () => {
    renderInTheme(<HeatGrid label="G" roving {...grid3x3} onSelect={() => {}} />)
    expect(tabIndexes().filter((t) => t === '0')).toHaveLength(1)
    expect(tabIndexes().filter((t) => t === '-1')).toHaveLength(8)
  })

  it('moves focus on both axes', async () => {
    const user = userEvent.setup()
    renderInTheme(<HeatGrid label="G" roving {...grid3x3} onSelect={() => {}} />)
    const cells = screen.getAllByRole('button')

    cells[0]?.focus()
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(cells[1])
    await user.keyboard('{ArrowDown}')
    // Three columns per row.
    expect(document.activeElement).toBe(cells[4])
    await user.keyboard('{ArrowLeft}{ArrowUp}')
    expect(document.activeElement).toBe(cells[0])
  })

  /*
   * Clamping, not wrapping. Wrapping off the end of a row crosses a row AND a
   * column boundary on one keystroke, which reads as a glitch rather than as
   * navigation — the deliberate difference from `useRovingFocus`.
   */
  it('clamps at every edge instead of wrapping', async () => {
    const user = userEvent.setup()
    renderInTheme(<HeatGrid label="G" roving {...grid3x3} onSelect={() => {}} />)
    const cells = screen.getAllByRole('button')

    cells[0]?.focus()
    await user.keyboard('{ArrowUp}{ArrowLeft}')
    expect(document.activeElement).toBe(cells[0])

    cells[8]?.focus()
    await user.keyboard('{ArrowDown}{ArrowRight}')
    expect(document.activeElement).toBe(cells[8])
  })

  it('takes Home/End to the ends of the row, and Ctrl+Home/End to the corners', async () => {
    const user = userEvent.setup()
    renderInTheme(<HeatGrid label="G" roving {...grid3x3} onSelect={() => {}} />)
    const cells = screen.getAllByRole('button')

    cells[4]?.focus()
    await user.keyboard('{End}')
    expect(document.activeElement).toBe(cells[5])
    await user.keyboard('{Home}')
    expect(document.activeElement).toBe(cells[3])

    await user.keyboard('{Control>}{End}{/Control}')
    expect(document.activeElement).toBe(cells[8])
    await user.keyboard('{Control>}{Home}{/Control}')
    expect(document.activeElement).toBe(cells[0])
  })

  it('leaves Tab alone, so the grid is escapable', async () => {
    const user = userEvent.setup()
    renderInTheme(<HeatGrid label="G" roving {...grid3x3} onSelect={() => {}} />)
    const cells = screen.getAllByRole('button')

    cells[0]?.focus()
    await user.tab()
    expect(document.activeElement).not.toBe(cells[1])
  })

  it('still selects the focused cell', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderInTheme(<HeatGrid label="G" roving {...grid3x3} onSelect={onSelect} />)

    screen.getAllByRole('button')[0]?.focus()
    await user.keyboard('{ArrowRight}{Enter}')
    expect(onSelect).toHaveBeenCalledWith('a|y', 'a', 'y')
  })

  it('has no axe violations', async () => {
    const { container } = renderInTheme(<HeatGrid label="G" roving {...grid3x3} onSelect={() => {}} />)
    await expectNoAxeViolations(container)
  })
})
