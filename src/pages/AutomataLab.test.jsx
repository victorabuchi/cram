import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { renderApp } from '../test/helpers.jsx'

describe('Automata lab', () => {
  it('draws the selected example and tests the strings', () => {
    renderApp('/s/bmc/automata?preset=t4')
    expect(screen.getAllByRole('img', { name: /Finite automaton with states q0, q1, q2/ }).length).toBeGreaterThan(0)
    const table = screen.getByRole('table', { name: 'Test results' })
    const rows = within(table).getAllByRole('row').slice(1).map((r) => within(r).getAllByRole('cell').map((c) => c.textContent))
    expect(rows).toEqual([['1101', 'Reject'], ['01001', 'Accept'], ['00', 'Accept'], ['0101', 'Reject']])
  })

  it('redraws when the text changes and shows parse errors', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/automata')
    const box = screen.getByLabelText('Automaton')
    await user.clear(box)
    await user.type(box, 'start: x\nx a y')
    expect(screen.getByRole('alert')).toHaveTextContent('Line 2')
    await user.clear(box)
    await user.type(box, 'start: x{enter}accept: y{enter}x a -> y')
    expect(screen.getAllByRole('img', { name: /states x, y/ }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('warns about missing transitions', () => {
    renderApp('/s/bmc/automata?preset=one-b')
    expect(screen.getByRole('status')).toHaveTextContent('B has no transition on b')
  })

  it('steps through an input and reports the verdict', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/automata?preset=one-b')
    const input = screen.getAllByLabelText('Input string')[0]
    await user.type(input, 'ab')
    await user.click(screen.getAllByRole('button', { name: 'Step' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Step' })[0])
    expect(screen.getByText(/an accepting state. Accepted./)).toBeInTheDocument()
  })

  it('says when the machine gets stuck, and shows no verdict before Step or Run', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/automata?preset=one-b')
    const input = screen.getAllByLabelText('Input string')[0]
    await user.type(input, 'abb')
    expect(screen.queryByText(/Rejected/)).not.toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Run' })[0])
    expect(screen.getByText(/Stuck in B: no transition on "b". Rejected./)).toBeInTheDocument()
  })

  it('has the three download buttons', () => {
    renderApp('/s/bmc/automata')
    for (const name of ['Download SVG', 'Download PNG', 'Download for JFLAP (.jff)']) expect(screen.getByRole('button', { name })).toBeInTheDocument()
  })

  it('has no detectable accessibility violations', async () => {
    const { container } = renderApp('/s/bmc/automata?preset=t5')
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Basic Models of Computation pages', () => {
  it('have no detectable accessibility violations (the exercises and the course page)', async () => {
    for (const route of ['/s/bmc/1/exercises', '/s/bmc/2/exercises', '/s/bmc']) {
      const { container, unmount } = renderApp(route)
      await screen.findByRole('main')
      expect(await axe(container)).toHaveNoViolations()
      unmount()
    }
  })
})
