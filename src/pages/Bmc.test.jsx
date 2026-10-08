import { existsSync } from 'node:fs'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { docs } from '../data/bmc/docs'
import { questions as exercise2 } from '../data/bmc/exercise2'
import { renderApp } from '../test/helpers.jsx'

describe('Basic Models of Computation: Learn (PDFs) and Exercises only', () => {
  it('every PDF the course points to exists', () => {
    for (const f of [...docs.map((d) => d.file), ...exercise2.map((q) => q.pdf)]) expect(existsSync(`public/docs/${f}`)).toBe(true)
  })

  it('shows the lecture as a PDF, not as cards', () => {
    renderApp('/s/bmc/3/learn')
    expect(screen.getByTitle(/Lecture 3-4/)).toHaveAttribute('src', expect.stringContaining('bmc-lecture-3-4.pdf'))
    expect(screen.queryByRole('button', { name: /What a DFA is/ })).not.toBeInTheDocument()
  })

  it('has a tab for each document of a week', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/4/learn')
    expect(screen.getByTitle(/Lecture 5/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Exercise 2/ }))
    expect(screen.getByTitle(/Exercise 2/)).toHaveAttribute('src', expect.stringContaining('bmc-exercise-2.pdf'))
  })

  it('has no Practice or Practice test', () => {
    renderApp('/s/bmc')
    const main = within(screen.getByRole('main'))
    expect(main.queryByText(/Practice all weeks/)).not.toBeInTheDocument()
    expect(main.queryByText(/Practice test/)).not.toBeInTheDocument()
    expect(main.getByText(/Exercises \(all weeks\)/)).toBeInTheDocument()
  })

  it('has the six Exercise 2 tasks, one per page of the answer PDF', () => {
    expect(exercise2.map((q) => q.page)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('lets you solve on paper, show the answer and mark it done', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/4/exercises')
    await user.click(screen.getByRole('button', { name: /Exercise 2, task 1$/ }))
    expect(screen.getByRole('heading', { name: 'X2 T1. Binary numbers' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByRole('region', { name: 'Answer' })).toHaveTextContent('00')
    expect(screen.getByTitle(/answer page/)).toHaveAttribute('src', expect.stringContaining('page=1'))
    await user.click(screen.getByRole('button', { name: 'I solved it' }))
    expect(screen.getByRole('button', { name: /Exercise 2, task 1, done/ })).toBeInTheDocument()
  })

  it('lists Exercise 1 and Exercise 2 together across all weeks', () => {
    renderApp('/s/bmc/all/exercises')
    expect(screen.getByText(/Exercise 1 · task 1 of 15/)).toBeInTheDocument()
  })
})
