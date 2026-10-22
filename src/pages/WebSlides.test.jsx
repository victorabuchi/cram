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

describe('Progress on the cards', () => {
  it('counts a question answered right once as done, and mastered only after three right in a row', () => {
    const ep1 = test[0].id
    localStorage.setItem('scribletics_progress', JSON.stringify({ [ep1]: { box: 1, seen: 1, right: 1, due: 0 } }))
    renderApp('/')
    const card = screen.getAllByRole('link').find((l) => /Web Programming I/.test(l.textContent) && /answered correctly/.test(l.textContent))
    expect(card).toHaveTextContent(/1 of \d+ answered correctly · 0 mastered/)
  })

  it('the PDF viewer has zoom controls (or the plain frame where pages cannot be drawn)', () => {
    renderApp('/s/webprog/1/learn')
    expect(screen.getByTitle('Web programming (course intro)')).toBeInTheDocument() // jsdom cannot draw canvases, so the frame is used
  })
})

describe('Backup on the Progress page', () => {
  it('copies a backup code and restores a backup made in another browser', async () => {
    const user = userEvent.setup()
    const ep1 = test[0].id
    localStorage.setItem('scribletics_progress', JSON.stringify({ 'other-question': { box: 1, seen: 1, right: 1, due: 0 } }))
    renderApp('/s/webprog/progress')
    expect(screen.getByText('Move your progress to another browser or phone')).toBeInTheDocument()
    const code = 'cram1:' + btoa(JSON.stringify({ app: 'cram', version: 1, data: { scribletics_progress: { [ep1]: { box: 2, seen: 2, right: 2, due: 0 } } } }))
    vi.stubGlobal('location', { ...window.location, reload: vi.fn() })
    await user.type(screen.getByLabelText(/Restore: paste a backup code/), code)
    await user.click(screen.getByRole('button', { name: 'Restore from code' }))
    const saved = JSON.parse(localStorage.getItem('scribletics_progress'))
    expect(Object.keys(saved).sort()).toEqual([ep1, 'other-question'].sort())
  })

  it('shows a clear message for a code that is not a backup', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/progress')
    await user.type(screen.getByLabelText(/Restore: paste a backup code/), 'hello')
    await user.click(screen.getByRole('button', { name: 'Restore from code' }))
    expect(await screen.findByText(/not a Cram backup/)).toBeInTheDocument()
  })
})
