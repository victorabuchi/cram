import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { questions } from '../data/webprog/jsSyntax'
import { renderApp } from '../test/helpers.jsx'

const editor = () => screen.getByLabelText('Your code')
const write = (value) => fireEvent.change(editor(), { target: { value } })

describe('Code exercises', () => {
  it('is reachable from week 4, and not from week 5', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp('/s/webprog/4')
    expect(screen.getByRole('link', { name: /Code exercises/ })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /Code exercises/ }))
    expect(await screen.findByRole('heading', { name: 'getGrade' })).toBeInTheDocument()
    unmount()
    renderApp('/s/webprog/5')
    expect(screen.queryByRole('link', { name: /Code exercises/ })).not.toBeInTheDocument()
  })

  it('starts with the starter code and the task text', () => {
    renderApp('/s/webprog/4/code')
    expect(editor()).toHaveValue(questions[0].starter)
    expect(screen.getByText(/getGrade\(95\) returns 5/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Question 1' })).toHaveAttribute('aria-current', 'step')
  })

  it('shows which tests fail, with the expected and the actual value', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/4/code')
    write('const getGrade = (points) => { return 5; };')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(await screen.findByText(/of 15 tests pass/)).toBeInTheDocument()
    const table = screen.getByRole('table', { name: 'Test results' })
    const row = within(table).getByText('getGrade(72)').closest('tr')
    expect(within(row).getAllByRole('cell').map((c) => c.textContent)).toEqual(['getGrade(72)', '3', '5', '✗ failed'])
  })

  it('accepts a correct solution, marks the question done and records progress once', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/4/code')
    write(questions[0].solution)
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(await within(await screen.findByRole('status')).findByText('All tests pass!')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Question 1, done' })).toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: 'Check' }))
    const stored = JSON.parse(localStorage.getItem('scribletics_progress'))
    expect(stored['js-syntax-1']).toMatchObject({ seen: 1, right: 1 })
  })

  it('reports a syntax error in the student\'s code', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/4/code')
    write('const getGrade = (points) => {')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(await screen.findByText(/Your code could not run/)).toBeInTheDocument()
  })

  it('moves between questions and keeps the code that was typed', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/4/code')
    write('// my first attempt')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('heading', { name: 'playRound' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Question 1' }))
    expect(editor()).toHaveValue('// my first attempt')
  })

  it('also checks the for...of requirement of question 5', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/4/code')
    await user.click(screen.getByRole('button', { name: 'Question 5' }))
    write(`const countNamesOfType = (names, letter) => names.filter(n => n.startsWith(letter) && n[0] === n[0].toUpperCase()).length;`)
    await user.click(screen.getByRole('button', { name: 'Check' }))
    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent('Use a for...of loop in your solution.')
    expect(status).not.toHaveTextContent('All tests pass!')
    write(questions[4].solution)
    await user.click(screen.getByRole('button', { name: 'Check' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('All tests pass!'))
  })

  it('shows the solution after confirming, and counts it as missed', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderApp('/s/webprog/4/code')
    await user.click(screen.getByRole('button', { name: 'Show solution' }))
    expect(screen.getByText(/One possible solution/)).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('scribletics_progress'))
    expect(stored['js-syntax-1']).toMatchObject({ seen: 1, right: 0 })
  })

  it('indents with Tab and lets Esc then Tab leave the editor', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/4/code')
    write('')
    editor().focus()
    await user.keyboard('{Tab}')
    expect(editor()).toHaveValue('    ')
    await user.keyboard('{Escape}{Tab}')
    expect(editor()).toHaveValue('    ')
    expect(editor()).not.toHaveFocus()
  })

  it('is not part of practice sessions or the practice test', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/4/practice')
    expect(screen.queryByLabelText(/JavaScript syntax exercises/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start session' }))
    expect(screen.queryByText(/Write the function/)).not.toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderApp('/s/webprog/4/code')
    await screen.findByRole('heading', { name: 'getGrade' })
    expect(await axe(container)).toHaveNoViolations()
  })
})
