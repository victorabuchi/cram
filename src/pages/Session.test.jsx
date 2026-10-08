import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { renderApp } from '../test/helpers.jsx'

const optionButtons = () => within(screen.getByRole('group', { name: 'Answer options' })).getAllByRole('button')

describe('Practice test: going back', () => {
  it('has no Back on the first question, and Back shows the earlier answer as it was left', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/2/mock')
    await user.click(screen.getByRole('button', { name: 'Start practice test' }))
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()

    const before = optionButtons().map((b) => b.textContent)
    await user.click(optionButtons()[2])
    const picked = optionButtons()[2].textContent
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    expect(screen.getByText(/Question 2 of/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText(/Question 1 of/)).toBeInTheDocument()
    expect(optionButtons().map((b) => b.textContent)).toEqual(before) // same order
    expect(screen.getByRole('button', { name: picked })).toHaveAttribute('aria-pressed', 'true')
  })

  it('lets the answer be changed after going back', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/2/mock')
    await user.click(screen.getByRole('button', { name: 'Start practice test' }))
    await user.click(optionButtons()[0])
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await user.click(optionButtons()[1])
    expect(optionButtons()[1]).toHaveAttribute('aria-pressed', 'true')
    expect(optionButtons()[0]).toHaveAttribute('aria-pressed', 'false')
  })

  it('reviews every multiple-choice question afterwards, with your answer and the correct one', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/1/mock')
    await user.click(screen.getByRole('button', { name: 'Start practice test' }))
    const total = Number(screen.getByText(/Question 1 of (\d+)/).textContent.match(/of (\d+)/)[1])
    const answers = []
    for (let i = 0; i < total; i++) {
      const group = screen.queryByRole('group', { name: 'Answer options' })
      if (group) {
        const b = within(group).getAllByRole('button')[0]
        answers.push(b.textContent)
        await user.click(b)
      } else if (screen.queryByRole('textbox')) await user.type(screen.getByRole('textbox'), 'answer')
      await user.click(screen.getByRole('button', { name: /^(Next question|Finish test)$/ }))
    }
    expect(screen.getByRole('heading', { name: 'Practice test results' })).toBeInTheDocument()

    const reviews = screen.getAllByRole('group', { name: 'Answer options' })
    expect(reviews).toHaveLength(answers.length)
    reviews.forEach((group, n) => {
      const buttons = within(group).getAllByRole('button')
      expect(buttons.filter((b) => b.textContent.includes('(your answer'))).toHaveLength(1)
      expect(buttons.filter((b) => b.textContent.includes('(correct answer)') || b.textContent.includes('your answer, correct'))).toHaveLength(1)
      expect(buttons.every((b) => b.disabled)).toBe(true)
      expect(within(buttons.find((b) => b.textContent.includes('(your answer'))).getByText(/your answer/)).toBeInTheDocument()
      expect(n).toBeLessThan(answers.length)
    })
    expect(screen.queryByRole('button', { name: 'Check' })).not.toBeInTheDocument()
  })

  it('shows the explanation under each reviewed question', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/1/mock')
    await user.click(screen.getByRole('button', { name: 'Start practice test' }))
    for (let guard = 0; guard < 30 && !screen.queryByRole('heading', { name: 'Practice test results' }); guard++) {
      const group = screen.queryByRole('group', { name: 'Answer options' })
      if (group) await user.click(within(group).getAllByRole('button')[0])
      else if (screen.queryByRole('textbox')) await user.type(screen.getByRole('textbox'), 'answer')
      await user.click(screen.getByRole('button', { name: /^(Next question|Finish test)$/ }))
    }
    const results = screen.getAllByRole('region', { name: 'Result' })
    expect(results.length).toBeGreaterThan(5)
    results.forEach((r) => expect(r.textContent).toMatch(/Correct!|Not quite\.|Not answered\./))
  })
})

describe('Practice: going back', () => {
  async function answerCurrent(user) {
    const blanks = screen.queryAllByLabelText(/^Blank/)
    if (blanks.length) for (const b of blanks) await user.type(b, 'x')
    else if (screen.queryByPlaceholderText('Type exactly what is printed')) await user.type(screen.getByPlaceholderText('Type exactly what is printed'), 'x')
    else if (screen.queryByRole('group', { name: 'Answer options' })) await user.click(optionButtons()[0])
    else await user.type(screen.getByRole('textbox'), 'my answer')
    await user.click(screen.getByRole('button', { name: /^(Check|Reveal model answer)$/ }))
    if (screen.queryByRole('button', { name: 'Done grading' })) await user.click(screen.getByRole('button', { name: 'Done grading' }))
  }

  it('shows the answered question again, with its feedback, without counting it twice', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/2/practice')
    await user.click(screen.getByRole('button', { name: 'Start session' }))
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    const firstHeading = screen.getByRole('heading', { level: 2 }).textContent

    await answerCurrent(user)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(/Question 2 of/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByText(/Question 1 of/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(firstHeading)
    expect(screen.getByRole('alert')).toHaveTextContent(/Correct!|Not quite\./) // the feedback is still there
    expect(screen.queryByRole('button', { name: /^(Check|Reveal model answer)$/ })).not.toBeInTheDocument() // cannot be answered twice

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(/Question 2 of/)).toBeInTheDocument()
    expect(Object.keys(JSON.parse(localStorage.getItem('scribletics_progress')))).toHaveLength(1)
  })

  it('has no accessibility violations in a reviewed question', async () => {
    const user = userEvent.setup()
    const { container } = renderApp('/s/webprog/2/practice')
    await user.click(screen.getByRole('button', { name: 'Start session' }))
    await answerCurrent(user)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await axe(container)).toHaveNoViolations()
  })
})
