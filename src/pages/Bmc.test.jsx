import { existsSync } from 'node:fs'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ITEMS } from '../data/content'
import { docs } from '../data/bmc/docs'
import { questions as exercise1 } from '../data/bmc/exercise1'
import { questions as exercise2 } from '../data/bmc/exercise2'
import { questions as exercise3 } from '../data/bmc/exercise3'
import { renderApp } from '../test/helpers.jsx'

describe('Basic Models of Computation: Learn (PDFs) and Exercises only', () => {
  it('every PDF the course points to exists', () => {
    for (const f of [...docs.map((d) => d.file), ...exercise2.map((q) => q.pdf)]) expect(existsSync(`public/docs/${f}`)).toBe(true)
  })

  it('groups lectures 1 to 4 with exercise 1, and lectures 5 and 6 with exercises 2 and 3', () => {
    const titles = (week) => docs.filter((d) => d.week === week).map((d) => d.title)
    expect(titles(1)).toEqual(['Lecture 1', 'Lecture 2', 'Lecture 3-4', 'Exercise 1: questions and answers'])
    expect(titles(2)).toEqual(['Lecture 5', 'Lecture 6', 'Exercise 2: questions and answers', 'Exercise 3: questions and answers'])
  })

  it('shows a lecture as a PDF, with a tab for each document of the group', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/2/learn')
    expect(screen.getByTitle('Lecture 5')).toHaveAttribute('src', expect.stringContaining('bmc-lecture-5.pdf'))
    await user.click(screen.getByRole('button', { name: /Exercise 3/ }))
    expect(screen.getByTitle(/Exercise 3/)).toHaveAttribute('src', expect.stringContaining('bmc-exercise-3.pdf'))
  })

  it('has no Practice or Practice test', () => {
    renderApp('/s/bmc')
    const main = within(screen.getByRole('main'))
    expect(main.queryByText(/Practice all weeks/)).not.toBeInTheDocument()
    expect(main.queryByText(/Practice test/)).not.toBeInTheDocument()
    expect(main.getByText(/Exercises \(all weeks\)/)).toBeInTheDocument()
  })

  it('has the tasks of exercises 1, 2 and 3, each pointing to a page of its answer PDF', () => {
    expect(exercise1.map((q) => q.page)).toEqual([1, 3, 4, 5, 6, 7, 8, 9])
    expect(exercise2.map((q) => q.page)).toEqual([1, 2, 3, 4, 5, 6])
    expect(exercise3.map((q) => q.page)).toEqual([1, 2, 3, 5, 6, 8])
    expect(exercise1.every((q) => q.week === 1) && [...exercise2, ...exercise3].every((q) => q.week === 2)).toBe(true)
  })

  it('lets you solve on paper, show the answer and mark it done', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/2/exercises')
    await user.click(screen.getByRole('button', { name: /Exercise 2, task 1$/ }))
    expect(screen.getByRole('heading', { name: 'X2 T1. Binary numbers' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByRole('region', { name: 'Answer' })).toHaveTextContent('00')
    expect(screen.getAllByRole('img', { name: /teacher's answer/ })).toHaveLength(1)
    expect(screen.getByRole('img', { name: /teacher's answer/ })).toHaveAttribute('src', expect.stringContaining('pages/bmc-exercise-2-1.jpg'))
    expect(screen.queryByTitle(/PDF|answer page/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hide answer' }))
    expect(screen.queryByRole('region', { name: 'Answer' })).not.toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /teacher's answer/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'I solved it' }))
    expect(screen.getByRole('button', { name: /Exercise 2, task 1, done/ })).toBeInTheDocument()
  })

  it('shows both pages for a task that spans two, and every page image exists', () => {
    expect([...exercise1, ...exercise2, ...exercise3].filter((q) => q.pages).map((q) => q.pages)).toEqual([[1, 2], [3, 4]])
    for (const q of [...exercise1, ...exercise2, ...exercise3]) {
      for (const n of q.pages ?? [q.page]) expect(existsSync(`public/docs/pages/${q.pdf.replace('.pdf', '')}-${n}.jpg`)).toBe(true)
    }
  })

  it('lists Exercise 1 and Exercise 2 together across both groups', () => {
    renderApp('/s/bmc/all/exercises')
    expect(screen.getByText(/Exercise 1 · task 1 of 20/)).toBeInTheDocument()
  })
})

describe('Plain-words help on the BMC exercises', () => {
  it('every task has a simple explanation and topics to look up', () => {
    const tasks = ITEMS.filter((i) => i.subject === 'bmc' && i.exercise)
    expect(tasks).toHaveLength(20)
    for (const q of tasks) {
      expect(q.simple?.length, q.id).toBeGreaterThanOrEqual(3)
      expect(q.terms?.length, q.id).toBeGreaterThan(0)
    }
  })

  it('explains the notation of task 1 and opens a Wikipedia summary of a topic', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ title: 'Modular arithmetic', extract: 'Modular arithmetic is a system of arithmetic for integers where numbers wrap around.', titles: { canonical: 'Modular_arithmetic' } }),
    })))
    renderApp('/s/bmc/1/exercises')
    expect(screen.getByRole('heading', { name: /X1 T1/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Explain it simply' }))
    const help = screen.getByRole('region', { name: 'Simple explanation' })
    expect(help).toHaveTextContent('remainder')
    expect(help).toHaveTextContent('δ(q4, 3) = q1')
    await user.click(screen.getByRole('button', { name: 'Hide the simple explanation' }))
    expect(screen.queryByRole('region', { name: 'Simple explanation' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Notation help (Q, Σ, δ)' }))
    const sheet = await screen.findByRole('dialog')
    expect(sheet).toHaveTextContent('start state')
    expect(sheet).toHaveTextContent('accepting states')
    await user.click(within(sheet).getByRole('button', { name: /close/i }))

    expect(screen.queryByText('Look up:')).not.toBeInTheDocument() // topics appear only with the answer
    expect(screen.queryByRole('button', { name: /Modular arithmetic/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: /Modular arithmetic/ }))
    const popup = await screen.findByRole('dialog')
    expect(await within(popup).findByText(/numbers wrap around/)).toBeInTheDocument()
    expect(within(popup).queryByRole('link', { name: 'Open in Glossary' })).not.toBeInTheDocument()
  })
})
