import { existsSync } from 'node:fs'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { docs } from '../data/webprog/docs'
import { questions as test } from '../data/webprog/practiceSet'
import { renderApp } from '../test/helpers.jsx'

describe('Web Programming I: slides in Learn', () => {
  it('every slide PDF exists', () => {
    for (const d of docs) expect(existsSync(`public/docs/${d.file}`)).toBe(true)
  })

  it('week 1 opens the slides as PDFs, one tab per document', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/1/learn')
    expect(screen.getByTitle('Web programming (course intro)')).toHaveAttribute('src', expect.stringContaining('web-0-web-programming.pdf'))
    await user.click(screen.getByRole('button', { name: 'CSS' }))
    expect(screen.getByTitle('CSS')).toHaveAttribute('src', expect.stringContaining('web-3-css.pdf'))
    expect(screen.queryByText(/without slides yet/)).not.toBeInTheDocument()
  })

  it('a week without slides keeps its learn cards', () => {
    renderApp('/s/webprog/5/learn')
    expect(screen.getByRole('button', { name: /Why React/ })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Documents' })).not.toBeInTheDocument()
  })

  it('all weeks: the slides on top and the notes of the weeks without slides below', () => {
    renderApp('/s/webprog/all/learn')
    expect(screen.getByRole('group', { name: 'Documents' })).toBeInTheDocument()
    expect(screen.getByText(/Notes for the weeks without slides yet/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Why React/ })).toBeInTheDocument()
  })
})

describe('Web Programming I: all test questions', () => {
  it('is in the top bar', () => {
    renderApp('/s/webprog')
    expect(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'All test questions' })).toBeInTheDocument()
  })

  it('shows all 26 questions in the Moodle order, with the answers hidden', () => {
    renderApp('/s/webprog/all/questions')
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(titles).toEqual(test.map((q) => `Question ${q.setNo}`))
    expect(screen.queryByText('(correct answer)')).not.toBeInTheDocument()
    expect(screen.getAllByText('Not answered')).toHaveLength(26)
  })

  it('does not list the correct option first, and shows it on request', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/all/questions')
    const q = test.find((x) => x.setNo === 13)
    const article = document.getElementById('q-13')
    expect(within(article).getByText(q.q)).toBeInTheDocument()
    expect(within(article).getAllByRole('listitem')).toHaveLength(q.options.length)
    await user.click(within(article).getByRole('button', { name: 'Show answer' }))
    expect(within(article).getByText('(correct answer)').parentElement).toHaveTextContent('textContent')
    expect(within(article).getByText(/sets the text of an element/)).toBeInTheDocument()
    await user.click(within(article).getByRole('button', { name: 'Hide answer' }))
    expect(within(article).queryByText('(correct answer)')).not.toBeInTheDocument()
  })

  it('shows the code and the model answer of a "based on the given code" question', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/all/questions')
    const article = document.getElementById('q-10')
    expect(within(article).getByText(/numbers.filter/, { exact: false })).toBeInTheDocument()
    await user.click(within(article).getByRole('button', { name: 'Show answer' }))
    expect(within(article).getByText(/Model answer:/)).toBeInTheDocument()
  })

  it('shows every answer with the switch', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/all/questions')
    await user.click(screen.getByLabelText('Show all answers'))
    expect(screen.getAllByRole('button', { name: 'Hide answer' })).toHaveLength(26)
  })
})
