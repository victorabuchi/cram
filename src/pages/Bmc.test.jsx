import { existsSync, readdirSync } from 'node:fs'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ITEMS } from '../data/content'
import { docs } from '../data/bmc/docs'
import { questions as exercise1 } from '../data/bmc/exercise1'
import { questions as exercise2 } from '../data/bmc/exercise2'
import { questions as exercise3 } from '../data/bmc/exercise3'
import { questions as exercise4 } from '../data/bmc/exercise4'
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
    expect(exercise4.map((q) => q.page)).toEqual([1, 2, 4, 5, 6, 8])
    expect(exercise4.every((q) => q.week === 3)).toBe(true)
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
    expect([...exercise1, ...exercise2, ...exercise3, ...exercise4].filter((q) => q.pages).map((q) => q.pages)).toEqual([[1, 2], [3, 4], [6, 7], [2, 3], [6, 7], [8, 9]])
    for (const q of [...exercise1, ...exercise2, ...exercise3, ...exercise4]) {
      for (const n of q.pages ?? [q.page]) expect(existsSync(`public/docs/pages/${q.pdf.replace('.pdf', '')}-${n}.jpg`)).toBe(true)
    }
  })

  it('every page of every answer PDF belongs to a task (none is left out of Show answer)', () => {
    const tasks = ITEMS.filter((i) => i.subject === 'bmc' && i.exercise)
    for (const pdf of [...new Set(tasks.map((q) => q.pdf))]) {
      const name = pdf.replace('.pdf', '')
      const files = readdirSync('public/docs/pages').filter((f) => f.startsWith(`${name}-`)).map((f) => Number(f.slice(name.length + 1, -4)))
      const used = new Set(tasks.filter((q) => q.pdf === pdf).flatMap((q) => q.pages ?? [q.page]))
      expect(files.filter((n) => !used.has(n)), pdf).toEqual([])
    }
  })

  it('shows one exercise sheet at a time, picked from a dropdown grouped by week', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/exercises')
    const select = screen.getByRole('combobox', { name: 'Exercise sheet' })
    expect(within(select).getAllByRole('option').map((o) => o.value)).toEqual(['Exercise 1', 'Exercise 2', 'Exercise 3', 'Exercise 4', 'Exercise 5', 'Exercise 6', 'Exercise 7'])
    expect([...select.querySelectorAll('optgroup')].map((g) => g.label)).toEqual(expect.arrayContaining(['Week 5: Complexity (P and NP), LL(1) parsing and review']))
    expect(screen.getByText(/Exercise 1 · task 1 of 8/)).toBeInTheDocument()
    expect(within(screen.getByRole('navigation', { name: 'Task navigation' })).getAllByRole('button')).toHaveLength(8)
    await user.click(screen.getByRole('button', { name: /Exercise 1, task 3$/ }))
    await user.selectOptions(select, 'Exercise 4')
    expect(screen.getByText(/Exercise 4 · task 1 of 6/)).toBeInTheDocument() // a new sheet starts at its first task
    expect(select).toHaveValue('Exercise 4')
  })

  it('a week page lists only the sheets of that week, and a week with one sheet needs no dropdown', () => {
    const { unmount } = renderApp('/s/bmc/2/exercises')
    expect(within(screen.getByRole('combobox', { name: 'Exercise sheet' })).getAllByRole('option')).toHaveLength(2)
    expect(screen.getByText(/Exercise 2 · task 1 of 6/)).toBeInTheDocument()
    unmount()
    renderApp('/s/bmc/1/exercises')
    expect(screen.queryByRole('combobox', { name: 'Exercise sheet' })).not.toBeInTheDocument()
  })

  it('opens a sheet and a task from the address', () => {
    renderApp('/s/bmc/all/exercises?exercise=Exercise+3&task=4')
    expect(screen.getByRole('heading', { name: 'X3 T4. What does the automaton accept?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exercise 3, task 1' })).toHaveTextContent(/^1$/)
  })
})

describe('Plain-words help on the BMC exercises', () => {
  it('every task has a simple explanation and topics to look up', () => {
    const tasks = ITEMS.filter((i) => i.subject === 'bmc' && i.exercise)
    expect(tasks).toHaveLength(44)
    for (const q of tasks) {
      expect(q.simple?.length, q.id).toBeGreaterThanOrEqual(3)
      expect(q.terms?.length, q.id).toBeGreaterThan(0)
    }
  })

  it('after Show answer: a simple explanation on request and a Wikipedia summary of a topic', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ title: 'Modular arithmetic', extract: 'Modular arithmetic is a system of arithmetic for integers where numbers wrap around.', titles: { canonical: 'Modular_arithmetic' } }),
    })))
    renderApp('/s/bmc/1/exercises')
    expect(screen.getByRole('heading', { name: /X1 T1/ })).toBeInTheDocument()
    expect(screen.queryByText(/Notation/)).not.toBeInTheDocument() // no cheat sheet on the platform
    expect(screen.queryByRole('button', { name: 'Explain it simply' })).not.toBeInTheDocument() // only after Show answer

    expect(screen.queryByText('Look up:')).not.toBeInTheDocument() // topics appear only with the answer
    expect(screen.queryByRole('button', { name: /Modular arithmetic/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'Explain it simply' }))
    const help = screen.getByRole('region', { name: 'Simple explanation' })
    expect(help).toHaveTextContent('remainder')
    expect(help).toHaveTextContent('δ(q4, 3) = q1')
    await user.click(screen.getByRole('button', { name: 'Hide the simple explanation' }))
    expect(screen.queryByRole('region', { name: 'Simple explanation' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Modular arithmetic/ }))
    const popup = await screen.findByRole('dialog')
    expect(await within(popup).findByText(/numbers wrap around/)).toBeInTheDocument()
    expect(within(popup).queryByRole('link', { name: 'Open in Glossary' })).not.toBeInTheDocument()
  })
})

describe('Exercises keep your place', () => {
  it('the old variants address opens the exercises of that week', () => {
    renderApp('/s/bmc/2/variants')
    expect(screen.getByRole('heading', { name: /Exercises/ })).toHaveTextContent('Week 2')
  })

  it('marking a task "Still unsure" keeps you on the exercise', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/2/exercises')
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'Still unsure' }))
    expect(screen.getByRole('heading', { name: 'X2 T1. Binary numbers' })).toBeInTheDocument()
  })
})

describe('Groups 3 and 4: pushdown automata, context-sensitive grammars and Turing machines', () => {
  it('group 3 has lectures 7 and 8 and exercise 4; group 4 lectures 9 and 10 and exercise 5; group 5 exercises 6 and 7', () => {
    const titles = (week) => docs.filter((d) => d.week === week).map((d) => d.title)
    expect(titles(3)).toEqual(['Lecture 7', 'Lecture 8', 'Exercise 4: questions and answers'])
    expect(titles(4)).toEqual(['Lecture 9', 'Lecture 10', 'Exercise 5: questions and answers'])
    expect(titles(5)).toEqual(['Exercise 6: questions and answers', 'Exercise 7: questions and answers'])
  })

  it('names the groups and opens the slides', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/3/learn')
    expect(screen.getByTitle('Lecture 7')).toHaveAttribute('src', expect.stringContaining('bmc-lecture-7.pdf'))
    await user.click(screen.getByRole('button', { name: /Exercise 4/ }))
    expect(screen.getByTitle(/Exercise 4/)).toHaveAttribute('src', expect.stringContaining('bmc-exercise-4.pdf'))
  })

  it('groups 4 and 5 have Learn and Exercises', () => {
    const { unmount } = renderApp('/s/bmc/4')
    let main = within(screen.getByRole('main'))
    expect(main.getByRole('link', { name: /Learn/ })).toBeInTheDocument()
    expect(main.getByRole('link', { name: /Exercises/ })).toBeInTheDocument()
    expect(main.queryByRole('link', { name: /Practice/ })).not.toBeInTheDocument()
    unmount()
    renderApp('/s/bmc/5/exercises')
    main = within(screen.getByRole('main'))
    expect(main.getByText(/Exercise 6 · task 1 of 6/)).toBeInTheDocument()
  })

  it('shows the PDA answer of exercise 4 task 1 and the parse trees of task 6 in their own layout', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/3/exercises')
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByRole('region', { name: 'Answer' })).toHaveTextContent('A → B: b, Z ; cZ')
    await user.click(screen.getByRole('button', { name: /Exercise 4, task 6$/ }))
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    const answer = screen.getByRole('region', { name: 'Answer' })
    expect(answer).toHaveTextContent('n*(n+n)')
    expect(within(answer).getAllByText(/└─/, { selector: 'code' }).length).toBeGreaterThan(0)
  })
})

describe('Practice: the exercise topics with other values', () => {
  it('is in the BMC top bar, with eight sections and 17 questions', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc')
    await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Practice' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      '1. Factorization: in P? In NP?',
      '2. Draw the languages as finite automata',
      '3. Regular or not? Three grammars',
      '4. Which model recognizes each language?',
      '5. The hexagon automaton',
      '6. Which grammar is not regular?',
      '7. In P? In NP? Why?',
      '8. NP: explain the terms',
    ])
    expect(screen.getAllByRole('article')).toHaveLength(17)
  })

  it('shows the answer with the steps and the diagram, and saves that you solved it', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/practice')
    const octagon = within(screen.getByRole('article', { name: 'Practice 5.2. The octagon (mod 8)' }))
    expect(octagon.getByText(/δ\(7,a\)=0, δ\(7,b\)=1/)).toBeInTheDocument()
    await user.click(octagon.getByRole('button', { name: 'Show answer' }))
    expect(octagon.getByRole('region', { name: 'Answer' })).toHaveTextContent('P3 = {0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}')
    expect(octagon.getByText('d) the minimized automaton (mod 4)')).toBeInTheDocument()
    await user.click(octagon.getByRole('button', { name: 'I solved it' }))
    expect(octagon.getByRole('button', { name: 'I solved it' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('a drawing question has its automata in the answer', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/practice')
    const draw = within(screen.getByRole('article', { name: /^Practice 2\.2\./ }))
    await user.click(draw.getByRole('button', { name: 'Show answer' }))
    expect(draw.getByRole('region', { name: 'Answer' })).toHaveTextContent('accepting: q1 and q2 (b* can be empty)')
    expect(draw.getByText('d) (ab|ba)*')).toBeInTheDocument()
  })
})
