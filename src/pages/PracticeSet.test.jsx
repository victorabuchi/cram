import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { questions } from '../data/webprog/practiceSet'
import { renderApp } from '../test/helpers.jsx'

const nav = () => within(screen.getByRole('navigation', { name: 'Main' }))
const optionButtons = () => within(screen.getByRole('group', { name: 'Answer options' })).getAllByRole('button')

describe('Practice quiz', () => {
  it('is in the top bar of Web Programming I only', () => {
    const { unmount } = renderApp('/s/webprog')
    expect(nav().getByRole('link', { name: 'Practice quiz' })).toBeInTheDocument()
    unmount()
    renderApp('/s/bmc')
    expect(nav().queryByRole('link', { name: 'Practice quiz' })).not.toBeInTheDocument()
  })

  it('numbers the Moodle questions 1, 2, 3 ... without gaps', () => {
    expect(questions.map((q) => q.setNo)).toEqual(questions.map((_, i) => i + 1))
  })

  it('asks every question in the Moodle order, with no feedback until the end', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/all/test')
    expect(screen.getByRole('heading', { name: 'Practice quiz' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Attempt quiz' }))

    for (const [n, q] of questions.entries()) {
      expect(screen.getByText(`Question ${n + 1} of ${questions.length}`, { exact: false })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(q.q)
      if (q.kind === 'mcq') {
        expect(optionButtons().map((b) => b.textContent).sort()).toEqual([...q.options].sort())
        await user.click(screen.getByRole('button', { name: q.options[0] })) // the right answer
      } else {
        await user.type(screen.getByRole('textbox'), 'my explanation')
      }
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /^(Next question|Finish test)$/ }))
    }
    expect(screen.getByRole('heading', { name: 'Practice quiz results' })).toBeInTheDocument()
    const mcqs = questions.filter((q) => q.kind === 'mcq').length
    expect(screen.getByRole('status')).toHaveTextContent(`Multiple choice: ${mcqs} of ${mcqs} correct.`)
  })

  it('shows the code of the explain-the-code questions and a model answer to compare with at the end', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/all/test')
    await user.click(screen.getByRole('button', { name: 'Attempt quiz' }))
    for (const q of questions) {
      if (q.kind === 'explain') {
        expect(screen.getByText(q.code.split('\n')[0], { exact: false })).toBeInTheDocument()
        await user.type(screen.getByRole('textbox'), 'my explanation')
      } else await user.click(optionButtons()[0])
      await user.click(screen.getByRole('button', { name: /^(Next question|Finish test)$/ }))
    }
    expect(screen.getByText(/Open questions are not graded here/)).toBeInTheDocument()
    expect(screen.getByText(/implicit return/)).toBeInTheDocument() // question 10
    expect(screen.getAllByText(/reloads \(or navigates\) the page/).length).toBeGreaterThan(0) // question 14
    expect(screen.getAllByText(/renders two different cards/).length).toBeGreaterThan(0) // question 16
  })

  it('has no accessibility violations', async () => {
    const { container } = renderApp('/s/webprog/all/test')
    await screen.findByRole('button', { name: 'Attempt quiz' })
    expect(await axe(container)).toHaveNoViolations()
  })
})
