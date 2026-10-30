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
    expect(within(select).getByRole('option', { name: /Exercise 3 \(0\/6 done\) ★/ })).toBeInTheDocument() // has tasks that came in extra practice
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

  it('marks the tasks that came in extra practice and links to those test questions', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/exercises?exercise=Exercise+3&task=4')
    expect(screen.getByRole('heading', { name: 'X3 T4. What does the automaton accept?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exercise 3, task 4, came in extra practice' })).toHaveTextContent('4★')
    expect(screen.getByRole('button', { name: 'Exercise 3, task 1' })).toHaveTextContent(/^1$/)
    expect(screen.getByText(/Came in extra practice/).parentElement).toHaveTextContent('2025 set Q2, 2024 set Q2, 2024 practice set Q2 (exact)')
    await user.click(screen.getByRole('link', { name: '2024 practice set Q2' }))
    expect(screen.getByRole('heading', { name: /2024 practice set \(\)/ })).toBeInTheDocument()
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

describe('No Practice page: the exercises and the extra practice are the practice', () => {
  it('is not in the top bar or on a week page, and its old address opens the exercises of that week', () => {
    const { unmount } = renderApp('/s/bmc')
    expect(within(screen.getByRole('navigation', { name: 'Main' })).queryByRole('link', { name: 'Practice' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Practice/ })).not.toBeInTheDocument()
    unmount()
    const week = renderApp('/s/bmc/1')
    expect(within(screen.getByRole('main')).queryByRole('link', { name: /Practice/ })).not.toBeInTheDocument()
    week.unmount()
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

describe('Extra practice (solved)', () => {
  it('is in the BMC top bar and starts with the 2026 set, written down from memory', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc')
    await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Extra practice' }))
    expect(screen.getByRole('heading', { name: '2026 set (written down from memory)' })).toBeInTheDocument()
    expect(within(screen.getByRole('group', { name: 'Tests' })).getAllByRole('button').map((b) => b.textContent)).toEqual(['2026 set', '2025 set ()', '2024 set', '2024 practice set ()'])
    expect(screen.getAllByRole('article').map((a) => a.getAttribute('aria-label'))).toEqual([
      '2026 set, question 1. Integer factorization: in P? In NP?',
      '2026 set, question 2. Draw the languages as finite automata',
      '2026 set, question 3. Regular or not? Three grammars',
      '2026 set, question 4. Which model recognizes each language?',
    ])
    expect(screen.getByText(/there is no photo of the paper/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Show the original question sheet' })).not.toBeInTheDocument()
    expect(screen.getByRole('article', { name: /2026 set, question 2/ })).toHaveTextContent('From the exercises: X7 t4 (exact)')
    expect(screen.getByRole('article', { name: /2026 set, question 4/ })).toHaveTextContent('From the exercises: X5 T4 (exact)')
    const q3 = within(screen.getByRole('article', { name: /2026 set, question 3/ }))
    expect(q3.getByText(/B → b \| bBb \| ε/)).toBeInTheDocument()
    await user.click(q3.getByRole('button', { name: 'Show answer' }))
    expect(q3.getByRole('region', { name: 'Answer' })).toHaveTextContent('b) ε | aa*b*')
    const q2 = within(screen.getByRole('article', { name: /2026 set, question 2/ }))
    await user.click(q2.getByRole('button', { name: 'Show answer' }))
    expect(q2.getByText('e) (0|1)^8')).toBeInTheDocument()
  })

  it('still has the 2025 set with its three questions', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/extra-practice')
    await user.click(screen.getByRole('button', { name: '2025 set ()' }))
    expect(screen.getByRole('heading', { name: /2025 set \(\)/ })).toBeInTheDocument()
    expect(screen.getAllByRole('article').map((a) => a.getAttribute('aria-label'))).toEqual([
      '2025 set, question 1. The knapsack problem (8 p)',
      '2025 set, question 2. The language of an automaton (10 p)',
      '2025 set, question 3. Which grammar is not regular? (10 p)',
    ])
  })

  it('shows the Finnish original, the original paper and the answer with the partition steps', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/extra-practice?test=set-2025')
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

  it('switches to the 2024 set: the same questions as 2025, with its own photos', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/extra-practice')
    await user.click(screen.getByRole('button', { name: '2024 set' }))
    expect(screen.getByRole('heading', { name: /^2024 set \(Paper, 28 points\)/ })).toBeInTheDocument()
    expect(screen.getByText(/word for word the same as the 2025 set/)).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('article', { name: '2024 set, question 1. The knapsack problem (8 p)' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show the original question sheet' }))
    const photos = screen.getAllByRole('img', { name: /Paper, page/ })
    expect(photos.map((i) => i.getAttribute('src').replace(/.*\//, ''))).toEqual(['bmc-set-2024-1.jpg', 'bmc-set-2024-2.jpg'])
  })

  it('switches to the 2024 practice set', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/extra-practice')
    await user.click(screen.getByRole('button', { name: '2024 practice set ()' }))
    expect(screen.getByRole('heading', { name: /2024 practice set \(\)/ })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(4)
    const q1 = screen.getByRole('article', { name: /question 1\. NP/ })
    await user.click(within(q1).getByRole('button', { name: 'Show answer' }))
    expect(within(q1).getByRole('region', { name: 'Answer' })).toHaveTextContent('NP-complete: in NP AND NP-hard')
  })

  it('says on each question which exercise tasks it comes from, without the big table', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/extra-practice?test=set-2024')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByText('Which exercises the tests come from')).not.toBeInTheDocument()
    expect(screen.getByRole('article', { name: /2024 set, question 2/ })).toHaveTextContent('From the exercises: X3 T4, X3 T5 (exact)')
    await user.click(screen.getByRole('button', { name: '2024 practice set ()' }))
    expect(screen.getByRole('article', { name: /2024 practice set, question 1/ })).toHaveTextContent('From the exercises: X6 T1, X6 T2, X7 t1 (same topic)')
    await user.click(within(screen.getByRole('article', { name: /2024 practice set, question 3/ })).getByRole('link', { name: 'X5 T2' }))
    expect(screen.getByRole('heading', { name: 'X5 T2. Regular or not? Three grammars' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Exercise sheet' })).toHaveValue('Exercise 5')
  })

  it('is only for Basic Models of Computation', () => {
    renderApp('/s/webprog/all/extra-practice')
    expect(screen.getByRole('heading', { name: 'Web Programming I' })).toBeInTheDocument()
  })

  it('sends the old Extra practice address to Extra practice', () => {
    renderApp('/s/bmc/all/test')
    expect(screen.getByRole('heading', { name: /2026 set \(30\.10\.2026\)/ })).toBeInTheDocument()
  })
})

describe('2026 set: the exercise tasks the tests came from, the 2026 set first', () => {
  it('is in the BMC top bar: the four questions of the 2026 set, then the earlier ones, each task once', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc')
    await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: '2026 set' }))
    expect(screen.getByRole('heading', { level: 1, name: '2026 set' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['From the 2026 set', 'From the earlier tests (2025, 2024 and the 2024 practice set)'])
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      '1. Factorization: in P? In NP? (like X6 T1)',
      '2. Draw the languages as finite automata (X7 t4)',
      '3. Regular or not? Three grammars (X5 T2)',
      '4. Which model recognizes each language? (X5 T4)',
      '5. The hexagon automaton (X3 T4 + X3 T5)',
      '6. Which grammar is not regular? (X5 T2)',
      '7. In P? In NP? Why? (X6 T1)',
      '8. NP: explain the terms (X6 T1 + X6 T2 + X7 t1)',
    ])
    expect(screen.getAllByRole('article').map((a) => a.getAttribute('aria-label').replace(/\..*/, ''))).toEqual(['2026 set, question 1', 'X7 t4', 'X5 T2', 'X5 T4', 'X3 T4', 'X3 T5', 'X6 T1', 'X6 T2', 'X7 t1'])
    expect(screen.getByRole('region', { name: 'Which grammar is not regular?' })).toHaveTextContent('X5 T2 is above.')
    expect(screen.getByRole('region', { name: 'NP: explain the terms' })).toHaveTextContent('X6 T1 is above.')
    expect(screen.getByRole('region', { name: 'Draw the languages as finite automata' })).toHaveTextContent('Came in: 2026 set Q2 (exact)')
  })

  it('question 1 is the factorization question of the test, not the subset sum exercise, with what to write', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/set-2026')
    const section = within(screen.getByRole('region', { name: 'Factorization: in P? In NP?' }))
    const q1 = within(section.getByRole('article'))
    expect(q1.getByRole('heading', { level: 4 })).toHaveTextContent('2026 set, question 1. Integer factorization: in P? In NP?')
    expect(q1.getByText(/the prime numbers k1, k2, k3, … whose product is k/)).toBeInTheDocument()
    expect(q1.getByText('What is the time complexity of solving this problem when the value of k is given? How do you analyze it? Does this problem belong to class P or NP?')).toBeInTheDocument()
    expect(section.queryByText(/Subset sum problem/)).not.toBeInTheDocument()
    expect(q1.queryByRole('button', { name: /Show/ })).not.toBeInTheDocument() // no teacher's page for it
    await user.click(section.getByRole('button', { name: 'What to write in the test' }))
    const write = section.getByRole('region', { name: 'What to write in the test' })
    expect(write).toHaveTextContent('√k ≈ 10^(n/2) divisions')
    expect(write).toHaveTextContent('How to analyze it')
    expect(write).toHaveTextContent('→ checked in polynomial time → NP')
  })

  it('opens from the practice set address', () => {
    renderApp('/s/bmc/all/second-set-2026')
    expect(screen.getByRole('heading', { level: 1, name: '2026 set' })).toBeInTheDocument()
  })

  it('shows only the lecturer\'s answer under each task: no typed answer, no simple explanation, no look-ups', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/set-2026')
    const t5 = screen.getByRole('article', { name: 'X3 T5. Minimal? And what if state 3 accepts?' })
    await user.click(within(t5).getByRole('button', { name: 'Show the lecturer\'s answer' }))
    expect(within(t5).getByRole('heading', { level: 5, name: 'The lecturer\'s answer' })).toBeInTheDocument()
    expect(within(t5).getAllByRole('img', { name: /teacher's answer/ }).map((i) => i.getAttribute('src').replace(/.*\//, ''))).toEqual(['bmc-exercise-3-6.jpg', 'bmc-exercise-3-7.jpg']) // a) and b) with the minimized DFA
    expect(within(t5).queryByRole('region', { name: 'Answer' })).not.toBeInTheDocument()
    expect(within(t5).queryByRole('button', { name: 'Explain it simply' })).not.toBeInTheDocument()
    expect(within(t5).queryByText('Look up:')).not.toBeInTheDocument()
    const x7 = screen.getByRole('article', { name: 'X7 t4. Draw the languages as finite automata' })
    await user.click(within(x7).getByRole('button', { name: 'Show the lecturer\'s answer' }))
    expect(within(x7).queryByText('a) a*cb*', { selector: 'h5' })).not.toBeInTheDocument() // the drawn automata are not the lecturer's
    expect(within(x7).getByRole('img', { name: /teacher's answer/ })).toBeInTheDocument()
    await user.click(within(x7).getByRole('button', { name: 'I solved it' }))
    const hexagon = screen.getByRole('region', { name: 'The hexagon automaton' })
    expect(hexagon).toHaveTextContent('Came in: 2025 set Q2, 2024 set Q2, 2024 practice set Q2 (exact)')
    await user.click(within(hexagon).getByRole('link', { name: '2024 set Q2' }))
    expect(screen.getByRole('heading', { name: /^2024 set \(Paper, 28 points\)/ })).toBeInTheDocument()
  })

  it('has "What to write in the test" under the tasks of each group: the short answer with the steps', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/set-2026')
    expect(screen.getAllByRole('button', { name: 'What to write in the test' })).toHaveLength(8)
    expect(screen.queryByRole('region', { name: 'What to write in the test' })).not.toBeInTheDocument()
    const region = screen.getByRole('region', { name: 'The hexagon automaton' })
    const hexagon = within(region)
    const [last] = hexagon.getAllByRole('article').slice(-1)
    expect(last.compareDocumentPosition(hexagon.getByRole('button', { name: 'What to write in the test' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await user.click(hexagon.getByRole('button', { name: 'What to write in the test' }))
    const write = hexagon.getByRole('region', { name: 'What to write in the test' })
    expect(write).toHaveTextContent('P1 = {0}, {1,2,3}, {4}, {5}')
    expect(write).toHaveTextContent('P1 = {0,3}, {1,4}, {2,5}')
    await user.click(hexagon.getByRole('button', { name: 'Hide what to write' }))
    expect(hexagon.queryByRole('region', { name: 'What to write in the test' })).not.toBeInTheDocument()
  })

  it('extra practice questions have it too', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/extra-practice?test=set-b-2024')
    const q1 = within(screen.getByRole('article', { name: /2024 practice set, question 1/ }))
    await user.click(q1.getByRole('button', { name: 'What to write in the test' }))
    expect(q1.getByRole('region', { name: 'What to write in the test' })).toHaveTextContent('NP-complete: in NP and NP-hard')
    expect(screen.getAllByRole('button', { name: /What to write in the test|Hide what to write/ })).toHaveLength(4) // feedback too
  })

  it('switches to practice quiz: the same questions with other values, answered as what to write in the test', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc/all/set-2026')
    await user.click(screen.getByRole('button', { name: 'Practice quiz: other values (17)' }))
    expect(screen.getAllByRole('article').map((a) => a.getAttribute('aria-label').replace(/\..*/, ''))).toEqual([
      'Practice 1', 'Practice 1', 'Practice 2', 'Practice 2', 'Practice 3', 'Practice 3', 'Practice 4', 'Practice 4',
      'Practice 5', 'Practice 5', 'Practice 6', 'Practice 6', 'Practice 7', 'Practice 7', 'Practice 7', 'Practice 8', 'Practice 8',
    ])
    expect(screen.queryByRole('button', { name: 'What to write in the test' })).not.toBeInTheDocument()
    const draw = within(screen.getByRole('article', { name: /^Practice 2\.2\./ }))
    await user.click(draw.getByRole('button', { name: 'Show what to write in the test' }))
    expect(draw.getByRole('region', { name: 'What to write in the test' })).toHaveTextContent('accepting: q1 and q2 (b* can be empty)')
    expect(draw.queryByText('Look up:')).not.toBeInTheDocument()
    expect(draw.getByText('d) (ab|ba)*')).toBeInTheDocument()
    const octagon = within(screen.getByRole('article', { name: 'Practice 5.2. The octagon (mod 8)' }))
    expect(octagon.getByText(/δ\(7,a\)=0, δ\(7,b\)=1/)).toBeInTheDocument()
    await user.click(octagon.getByRole('button', { name: 'Show what to write in the test' }))
    expect(octagon.getByRole('region', { name: 'What to write in the test' })).toHaveTextContent('P3 = {0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}')
    expect(octagon.getByText('d) the minimized automaton (mod 4)')).toBeInTheDocument()
    await user.click(octagon.getByRole('button', { name: 'I solved it' }))
    await user.click(screen.getByRole('button', { name: 'Exercise tasks' }))
    expect(screen.getByRole('article', { name: 'X3 T4. What does the automaton accept?' })).toBeInTheDocument()
  })

  it('is only for Basic Models of Computation', () => {
    renderApp('/s/webprog/all/set-2026')
    expect(screen.getByRole('heading', { name: 'Web Programming I' })).toBeInTheDocument()
  })
})
