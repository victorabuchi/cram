import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuestionCard from './QuestionCard.jsx'

const setup = (item, props = {}) => {
  const onScore = vi.fn()
  const onNext = vi.fn()
  render(<QuestionCard item={item} instant lastLabel="Next" onScore={onScore} onNext={onNext} {...props} />)
  return { onScore, onNext, user: userEvent.setup() }
}

const mcq = { id: 'm1', kind: 'mcq', q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'], why: 'It is the markup language of the web.' }

describe('multiple choice', () => {
  it('needs an answer before checking', async () => {
    const { user, onScore } = setup(mcq)
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(onScore).not.toHaveBeenCalled()
  })

  it('shows success and the explanation for the right answer, then moves on', async () => {
    const { user, onScore, onNext } = setup(mcq)
    await user.click(screen.getByRole('button', { name: 'HyperText Markup Language' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(onScore).toHaveBeenCalledWith(1, { chosen: 'HyperText Markup Language' })
    expect(screen.getByRole('alert')).toHaveTextContent('Correct!')
    expect(screen.getByRole('alert')).toHaveTextContent('markup language of the web')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(onNext).toHaveBeenCalled()
  })

  it('scores a wrong answer as 0 and says so', async () => {
    const { user, onScore } = setup(mcq)
    await user.click(screen.getByRole('button', { name: 'High Tech Modern Language' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(onScore.mock.calls[0][0]).toBe(0)
    expect(screen.getByRole('alert')).toHaveTextContent('Not quite.')
  })

  it('gives no feedback in test mode and goes straight on', async () => {
    const { user, onScore, onNext } = setup(mcq, { instant: false, lastLabel: 'Next question' })
    await user.click(screen.getByRole('button', { name: 'High Tech Modern Language' }))
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    expect(onScore).toHaveBeenCalledOnce()
    expect(onNext).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('fill in the blanks', () => {
  const fill = { id: 'f1', kind: 'fill', title: 'Get an element', code: "const el = document.{{1}}('add-button');", answers: [['getElementById']] }

  it('accepts the right answer', async () => {
    const { user, onScore } = setup(fill)
    await user.type(screen.getByLabelText('Blank 1'), 'getElementById')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(onScore).toHaveBeenCalledWith(1, { chosen: undefined })
  })

  it('shows the answer when wrong', async () => {
    const { user } = setup(fill)
    await user.type(screen.getByLabelText('Blank 1'), 'getElement')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Answer: getElementById')
  })
})

describe('explain the code', () => {
  const explain = { id: 'e1', kind: 'explain', q: 'Explain this.', code: 'x', keyPoints: ['point A', 'point B'], model: 'The model answer.' }

  it('reveals the model answer, then scores by ticked key points', async () => {
    const { user, onScore } = setup(explain)
    await user.type(screen.getByRole('textbox'), 'my answer')
    await user.click(screen.getByRole('button', { name: 'Reveal model answer' }))
    expect(screen.getByText('The model answer.')).toBeInTheDocument()
    await user.click(screen.getByLabelText('point A'))
    await user.click(screen.getByRole('button', { name: 'Done grading' }))
    expect(onScore).toHaveBeenCalledWith(0.5, { text: 'my answer' })
    expect(screen.getByRole('alert')).toHaveTextContent('1 of 2')
  })
})

describe('Learn more links after the answer (Web Programming I)', () => {
  const css = { id: 'c1', subject: 'webprog', kind: 'mcq', q: 'Which CSS selector has the highest specificity value?', options: ['#main (id selector)', '.item (class selector)', 'p (element selector)'], why: 'Specificity order: id beats class beats element.' }

  it('shows MDN and W3Schools links under the explanation', async () => {
    const { user } = setup(css)
    expect(screen.queryByText('Learn more:')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^#main/ }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Learn more:')
    const links = within(alert).getAllByRole('link')
    expect(links.map((l) => l.getAttribute('href'))).toContain('https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity')
    expect(links.map((l) => l.getAttribute('href'))).toContain('https://www.w3schools.com/css/css_specificity.asp')
    expect(links.every((l) => l.getAttribute('target') === '_blank')).toBe(true)
  })

  it('is not shown for other courses', async () => {
    const { user } = setup({ ...css, subject: 'bmc' })
    await user.click(screen.getByRole('button', { name: /^#main/ }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.queryByText('Learn more:')).not.toBeInTheDocument()
  })
})
