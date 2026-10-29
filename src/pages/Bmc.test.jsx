import { existsSync } from 'node:fs'
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
    expect([...exercise1, ...exercise2, ...exercise3, ...exercise4].filter((q) => q.pages).map((q) => q.pages)).toEqual([[1, 2], [3, 4], [2, 3], [6, 7], [8, 9]])
    for (const q of [...exercise1, ...exercise2, ...exercise3, ...exercise4]) {
      for (const n of q.pages ?? [q.page]) expect(existsSync(`public/docs/pages/${q.pdf.replace('.pdf', '')}-${n}.jpg`)).toBe(true)
    }
  })

  it('lists Exercise 1 and Exercise 2 together across both groups', () => {
    renderApp('/s/bmc/all/exercises')
    expect(screen.getByText(/Exercise 1 · task 1 of 44/)).toBeInTheDocument()
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

describe('Practice: the exercise tasks again with other values', () => {
  it('is a tool of the course, with a week tile', () => {
    const { unmount } = renderApp('/s/bmc')
    expect(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Practice' })).toBeInTheDocument()
    unmount()
    renderApp('/s/bmc/1')
    expect(within(screen.getByRole('main')).getByRole('link', { name: /Practice/ })).toBeInTheDocument()
  })

  it('has 26 practice tasks (8 in group 1, 12 in group 2, 6 in group 3)', () => {
    const { unmount } = renderApp('/s/bmc/1/variants')
    expect(screen.getByText(/Practice task 1 of 8/)).toBeInTheDocument()
    unmount()
    const second = renderApp('/s/bmc/2/variants')
    expect(screen.getByText(/Practice task 1 of 12/)).toBeInTheDocument()
    second.unmount()
    renderApp('/s/bmc/3/variants')
    expect(screen.getByText(/Practice task 1 of 6/)).toBeInTheDocument()
  })

  it('shows the question with other values and then the answer, with a diagram', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/variants')
    expect(screen.getByRole('heading', { name: 'P1 T1. Sum modulo 5' })).toBeInTheDocument()
    expect(screen.getByText(/Σ = \{1, 2, 4\}/)).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Answer' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByRole('region', { name: 'Answer' })).toHaveTextContent('q((i + k) mod 5)')
    expect(screen.getByText('The answer as a diagram')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'I solved it' }))
    expect(screen.getByRole('button', { name: /Practice task 1, done/ })).toBeInTheDocument()
  })

  it('"I need to practise this" on an exercise takes you to the practice task of the same exercise', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/2/exercises')
    await user.click(screen.getByRole('button', { name: /Exercise 2, task 2$/ }))
    expect(screen.getByRole('heading', { name: 'X2 T2. Minimize the automaton' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    await user.click(screen.getByRole('button', { name: 'I need to practise this' }))
    expect(await screen.findByRole('heading', { name: 'P2 T2. Minimize the automaton' })).toBeInTheDocument()
    expect(screen.getByText(/the same idea as/)).toHaveTextContent('X2 T2. Minimize the automaton')
    await user.click(screen.getByRole('button', { name: 'Show answer' }))
    expect(screen.getByRole('region', { name: 'Answer' })).toHaveTextContent('three states')
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

  it('groups 4 and 5 have Learn and Exercises (exercises 5, 6 and 7 have no practice versions yet)', () => {
    const { unmount } = renderApp('/s/bmc/4')
    let main = within(screen.getByRole('main'))
    expect(main.getByRole('link', { name: /Learn/ })).toBeInTheDocument()
    expect(main.getByRole('link', { name: /Exercises/ })).toBeInTheDocument()
    expect(main.queryByRole('link', { name: /Practice/ })).not.toBeInTheDocument()
    unmount()
    renderApp('/s/bmc/5/exercises')
    main = within(screen.getByRole('main'))
    expect(main.getByText(/Exercise 6 · task 1 of 12/)).toBeInTheDocument()
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

describe('Extra practice (solved)', () => {
  it('is in the BMC top bar and shows the 2025 final test with its three questions', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc')
    await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Extra practice' }))
    expect(screen.getByRole('heading', { name: /Final test / })).toBeInTheDocument()
    expect(screen.getAllByRole('article').map((a) => a.getAttribute('aria-label'))).toEqual([
      'Final 2025, question 1. The knapsack problem (8 p)',
      'Final 2025, question 2. The language of an automaton (10 p)',
      'Final 2025, question 3. Which grammar is not regular? (10 p)',
    ])
  })

  it('shows the Finnish original, the original paper and the answer with the partition steps', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/extra-practice')
    const q2 = screen.getByRole('article', { name: /question 2/ })
    await user.click(within(q2).getByRole('button', { name: 'Show the Finnish original' }))
    expect(within(q2).getByRole('region', { name: 'Finnish original' })).toHaveTextContent('Minkä mittaisia sanoja automaatti hyväksyy?')
    await user.click(within(q2).getByRole('button', { name: 'Show answer' }))
    const answer = within(q2).getByRole('region', { name: 'Answer' })
    expect(answer).toHaveTextContent('P1 = {0}, {1, 2, 3}, {4}, {5}')
    expect(answer).toHaveTextContent('|w|a + 2|w|b ≡ 0 (mod 3)')
    expect(within(q2).getByText('d) the minimized automaton (mod 3)')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show the original question sheet' }))
    expect(screen.getAllByRole('img', { name: /Set , page/ })).toHaveLength(2)
  })

  it('switches to the 2024 practice set', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/extra-practice')
    await user.click(screen.getByRole('button', { name: 'Practice set ' }))
    expect(screen.getByRole('heading', { name: /Practice set / })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(4)
    const q1 = screen.getByRole('article', { name: /question 1\. NP/ })
    await user.click(within(q1).getByRole('button', { name: 'Show answer' }))
    expect(within(q1).getByRole('region', { name: 'Answer' })).toHaveTextContent('NP-complete: in NP AND NP-hard')
  })

  it('is only for Basic Models of Computation', () => {
    renderApp('/s/webprog/all/extra-practice')
    expect(screen.getByRole('heading', { name: 'Web Programming I' })).toBeInTheDocument()
  })

  it('sends the old Extra practice address to Extra practice', () => {
    renderApp('/s/bmc/all/test')
    expect(screen.getByRole('heading', { name: /Final test / })).toBeInTheDocument()
  })
})
