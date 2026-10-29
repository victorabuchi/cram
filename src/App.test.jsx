import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { scopedItems } from './data/content'
import { fakeWikipedia, REACT_PAGE, renderApp } from './test/helpers.jsx'

// jsdom has no canvas, so charts are replaced by a plain element that keeps the accessible name.
vi.mock('react-chartjs-2', () => ({ Bar: (props) => <div role={props.role} aria-label={props['aria-label']} /> }))

describe('navigation', () => {
  it('goes dashboard → subject → week → learn', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByRole('link', { name: /Web Programming I/ }))
    expect(await screen.findByRole('heading', { name: 'Web Programming I' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /Week 5/ }))
    expect(await screen.findByRole('heading', { name: /Week 5: React basics/ })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /Learn/ }))
    expect(await screen.findByRole('heading', { name: /^Learn/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Why React/ })).toBeInTheDocument()
  })

  it('moves focus to the page content after a route change', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog')
    await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Progress' }))
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('falls back to the dashboard for an unknown route', () => {
    renderApp('/nope')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })
})

describe('subjects', () => {
  it('lists both courses on the dashboard', () => {
    renderApp('/')
    expect(screen.getByRole('link', { name: /Web Programming I/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Basic Models of Computation/ })).toBeInTheDocument()
  })

  it('shows a logo on each week card', async () => {
    renderApp('/s/webprog')
    const week1 = screen.getByRole('link', { name: /Week 1/ })
    expect(within(week1).getByAltText('HTML')).toBeInTheDocument()
    expect(within(week1).getByAltText('CSS')).toBeInTheDocument()
    expect(within(screen.getByRole('link', { name: /Week 5/ })).getByAltText('React')).toBeInTheDocument()
    screen.getAllByRole('link', { name: /Week \d/ }).forEach((card) => expect(within(card).getAllByRole('img').length).toBeGreaterThan(0))
  })

  it('has the two groups of Basic Models of Computation, with the lectures as PDFs', async () => {
    const user = userEvent.setup()
    renderApp('/s/bmc')
    await user.click(screen.getByRole('link', { name: /Week 1/ }))
    expect(await screen.findByRole('heading', { name: /Finite automata and regular expressions/ })).toBeInTheDocument()
    await user.click(within(screen.getByRole('main')).getByRole('link', { name: /Learn/ }))
    expect(screen.getByTitle('Lecture 1')).toHaveAttribute('src', expect.stringContaining('bmc-lecture-1.pdf'))
  })
})

describe('course tools in the top bar', () => {
  const nav = () => within(screen.getByRole('navigation', { name: 'Main' }))

  it('shows only the Dashboard outside a course', () => {
    renderApp('/')
    expect(nav().getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(nav().queryByRole('link', { name: 'Progress' })).not.toBeInTheDocument()
    expect(nav().queryByRole('link', { name: 'Glossary' })).not.toBeInTheDocument()
    expect(nav().queryByRole('link', { name: 'Automata lab' })).not.toBeInTheDocument()
  })

  it('shows the Glossary, and not the Automata lab, inside Web Programming I', () => {
    renderApp('/s/webprog/5/learn')
    expect(nav().getByRole('link', { name: 'Glossary' })).toBeInTheDocument()
    expect(nav().queryByRole('link', { name: 'Automata lab' })).not.toBeInTheDocument()
  })

  it('shows the Automata lab, and no Glossary, inside Basic Models of Computation', () => {
    renderApp('/s/bmc/1')
    expect(nav().getByRole('link', { name: 'Automata lab' })).toBeInTheDocument()
    expect(nav().queryByRole('link', { name: 'Glossary' })).not.toBeInTheDocument()
  })

  it('opens each tool from the top bar', async () => {
    const user = userEvent.setup()
    fakeWikipedia(REACT_PAGE)
    renderApp('/s/webprog')
    await user.click(nav().getByRole('link', { name: 'Glossary' }))
    expect(await screen.findByRole('heading', { name: 'Glossary' })).toBeInTheDocument()
  })

  it('sends the old tool addresses to the right course', () => {
    fakeWikipedia(REACT_PAGE)
    renderApp('/automata')
    expect(screen.getByRole('heading', { name: 'Automata lab' })).toBeInTheDocument()
  })
})

describe('practice session', () => {
  it('runs a question, records progress and shows the summary at the end', async () => {
    const user = userEvent.setup()
    const total = scopedItems('webprog', 5).filter((i) => i.listNo).length // practice asks the question set's questions of the week
    expect(total).toBeGreaterThan(5)
    renderApp('/s/webprog/5/practice')
    expect(screen.getByText(new RegExp(`\\(${total} now\\)`))).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start session' }))
    expect(await screen.findByText(new RegExp(`Question 1 of ${total}`))).toBeInTheDocument()

    // Answer the first question whatever its kind (blank / typed answer / choice / essay).
    const answerFirst = async () => {
      const fillBox = screen.queryAllByLabelText(/^Blank/)
      if (fillBox.length) for (const b of fillBox) await user.type(b, 'x')
      else if (screen.queryByPlaceholderText('Type exactly what is printed')) await user.type(screen.getByPlaceholderText('Type exactly what is printed'), 'x')
      else if (screen.queryByRole('group', { name: 'Answer options' })) await user.click(within(screen.getByRole('group', { name: 'Answer options' })).getAllByRole('button')[0])
      else await user.type(screen.getByRole('textbox'), 'my answer')
    }
    for (let i = 0; i < total; i++) {
      await answerFirst()
      const submit = screen.getByRole('button', { name: /^(Check|Reveal model answer)$/ })
      await user.click(submit)
      if (screen.queryByRole('button', { name: 'Done grading' })) await user.click(screen.getByRole('button', { name: 'Done grading' }))
      await user.click(screen.getByRole('button', { name: /^(Next|Finish)$/ }))
    }
    expect(await screen.findByRole('heading', { name: new RegExp(`/ ${total} correct`) })).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('scribletics_progress'))
    expect(Object.keys(stored)).toHaveLength(total)
  }, 60000) // answers every question of the week, which is slow on a busy machine
})

describe('practice test', () => {
  it('runs without feedback and ends with an estimated score out of 30', async () => {
    const user = userEvent.setup()
    renderApp('/s/webprog/2/mock')
    await user.click(screen.getByRole('button', { name: 'Start practice test' }))
    for (let guard = 0; guard < 30; guard++) {
      if (screen.queryByRole('heading', { name: 'Practice test results' })) break
      const group = screen.queryByRole('group', { name: 'Answer options' })
      if (group) await user.click(within(group).getAllByRole('button')[0])
      else if (screen.queryByRole('textbox')) await user.type(screen.getByRole('textbox'), 'answer')
      await user.click(screen.getByRole('button', { name: /^(Next question|Finish test)$/ }))
    }
    expect(screen.getByRole('heading', { name: 'Practice test results' })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/Estimated score: \d+ \/ 30/)
    await user.click(screen.getByRole('button', { name: 'Save results to my progress' }))
    expect(Object.keys(JSON.parse(localStorage.getItem('scribletics_progress'))).length).toBeGreaterThan(0)
  })
})

describe('Learn cards: term popups (MDN, with a Wikipedia fallback)', () => {
  const VITE_PAGE = { 'Vite_(software)': { title: 'Vite (software)', description: 'Build tool', extract: 'Vite is a free and open-source front-end build tool.' } }
  const MDN_PAGE = `---
title: React
slug: Learn_web_development/Core/Frameworks_libraries/React_getting_started
---

React is a **JavaScript** library for building user interfaces, see {{glossary("API", "the API")}}.
`
  const stubMdn = () => vi.stubGlobal('fetch', vi.fn(async (url) => (String(url).includes('raw.githubusercontent.com/mdn/content')
    ? { ok: true, status: 200, text: async () => MDN_PAGE }
    : { ok: false, status: 404, json: async () => ({}) })))

  it('shows the MDN explanation in a popup, with a link to the full MDN page', async () => {
    const user = userEvent.setup()
    stubMdn()
    renderApp('/s/webprog/5/learn')
    await user.click(screen.getByRole('button', { name: /Why React/ }))
    await user.click((await screen.findAllByRole('button', { name: /^React\s*: open the explanation$/ }))[0])
    const dialog = await screen.findByRole('dialog')
    expect(await within(dialog).findByText(/React is a JavaScript library for building user interfaces, see the API\./)).toBeInTheDocument()
    expect(within(dialog).queryByRole('link', { name: /W3Schools/ })).not.toBeInTheDocument()
    expect(within(dialog).getAllByRole('link', { name: /MDN/ })[0]).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/React_getting_started')
    expect(within(dialog).getByText(/CC BY-SA 2\.5/)).toBeInTheDocument()
  })

  it('uses a Wikipedia summary for a term MDN has no page for, then saves it', async () => {
    const user = userEvent.setup()
    const f = fakeWikipedia(VITE_PAGE)
    renderApp('/s/webprog/5/learn')
    await user.click(screen.getByRole('button', { name: /Starting a React project with Vite/ }))
    await user.click((await screen.findAllByRole('button', { name: /^Vite\s*: open the explanation$/ }))[0])

    const dialog = await screen.findByRole('dialog')
    expect(await within(dialog).findByText(/free and open-source front-end/)).toBeInTheDocument()
    expect(f).toHaveBeenCalledWith(expect.stringContaining('/summary/Vite_(software)'), expect.anything())

    await user.click(within(dialog).getByRole('button', { name: 'Save to my terms' }))
    expect(within(dialog).getByRole('button', { name: 'Remove from my terms' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('scribletics_saved_terms'))).toEqual([{ key: 'Vite_(software)', title: 'Vite (software)', note: '' }])
  })

  it('shows an error message when the explanation cannot be loaded', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}), text: async () => '' }))
    renderApp('/s/webprog/5/learn')
    await user.click(screen.getByRole('button', { name: /Starting a React project with Vite/ }))
    await user.click((await screen.findAllByRole('button', { name: /^Vite\s*: open the explanation$/ }))[0])
    expect(await within(await screen.findByRole('dialog')).findByText(/status 500/)).toBeInTheDocument()
  })
})

describe('Glossary', () => {
  const pages = {
    ...REACT_PAGE,
    'React_(disambiguation)': { title: 'React disambiguation', description: 'Other uses', extract: 'x' },
    JSON: { title: 'JSON', description: 'Data format', extract: 'JSON is an open standard file format.' },
    REST: { title: 'REST', description: 'Architecture', extract: 'REST is a software architectural style.' },
  }

  it('searches, shows the article and other matches, remembers recent searches', async () => {
    const user = userEvent.setup()
    fakeWikipedia(pages)
    renderApp('/s/webprog/glossary')
    expect(screen.getByLabelText('Search term')).toHaveFocus()
    await user.type(screen.getByLabelText('Search term'), 'react{enter}')
    expect(await screen.findByRole('heading', { name: 'React (software)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /React disambiguation/ })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('scribletics_recent_searches'))).toEqual(['react'])
  })

  it('says so when nothing matches', async () => {
    const user = userEvent.setup()
    fakeWikipedia(pages)
    renderApp('/s/webprog/glossary')
    await user.type(screen.getByLabelText('Search term'), 'qqqq{enter}')
    expect(await screen.findByText(/No article found/)).toBeInTheDocument()
  })

  it('opens a term from the By week tab', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      text: async () => '---\ntitle: JSON\nslug: Web/JavaScript/Reference/Global_Objects/JSON\n---\n\nThe **JSON** namespace object is an open standard file format helper.\n',
    })))
    renderApp('/s/webprog/glossary')
    await user.click(screen.getByRole('tab', { name: 'By week' }))
    await user.click(screen.getByRole('button', { name: 'Week 4: JavaScript I + II: DOM, libraries, async, REST, fetch' }))
    const panel = screen.getByRole('tabpanel', { name: 'By week' })
    await user.click(await within(panel).findByRole('button', { name: 'JSON' }))
    expect(await screen.findByText(/open standard file format helper/)).toBeInTheDocument()
  })

  it('keeps saved terms with editable notes', async () => {
    const user = userEvent.setup()
    fakeWikipedia(pages)
    renderApp('/s/webprog/glossary?term=React_(software)')
    await user.click(await screen.findByRole('button', { name: 'Save to my terms' }))
    await user.click(screen.getByRole('tab', { name: 'My terms' }))
    await user.type(screen.getByLabelText('Your note about React (software)'), 'UI library')
    expect(JSON.parse(localStorage.getItem('scribletics_saved_terms'))[0].note).toBe('UI library')
    await user.click(screen.getByRole('button', { name: 'Remove React (software)' }))
    expect(await screen.findByText(/Nothing saved yet/)).toBeInTheDocument()
  })
})

describe('Progress page (one per course)', () => {
  it('counts only this course and resets only this course', async () => {
    const user = userEvent.setup()
    localStorage.setItem('scribletics_progress', JSON.stringify({
      'set-1': { box: 4, seen: 5, right: 5, due: 0 },
      'bmc1-c1': { box: 4, seen: 2, right: 2, due: 0 },
    }))
    renderApp('/s/webprog/progress')
    expect(screen.getByText('questions mastered').previousSibling).toHaveTextContent(/^1\//)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Reset progress in this course' }))
    expect(screen.getByText('questions mastered').previousSibling).toHaveTextContent(/^0\//)
    expect(JSON.parse(localStorage.getItem('scribletics_progress'))).toEqual({ 'bmc1-c1': expect.objectContaining({ box: 4 }) })
  })

  it('shows Basic Models of Computation on its own', () => {
    localStorage.setItem('scribletics_progress', JSON.stringify({ 'set-1': { box: 4, seen: 5, right: 5, due: 0 } }))
    renderApp('/s/bmc/progress')
    expect(screen.getByRole('heading', { name: /Progress/ })).toHaveTextContent('Basic Models of Computation')
    expect(screen.getByText('questions mastered').previousSibling).toHaveTextContent(/^0\/44$/)
  })

  it('keeps study days per course, and moves old single-course data to Web Programming I', () => {
    localStorage.setItem('scribletics_days', JSON.stringify({ [new Date().toISOString().slice(0, 10)]: 4 }))
    const { unmount } = renderApp('/s/webprog/progress')
    expect(screen.getByText('answered today').previousSibling).toHaveTextContent('4')
    unmount()
    renderApp('/s/bmc/progress')
    expect(screen.getByText('answered today').previousSibling).toHaveTextContent('0')
  })

  it('sends the old global address to the dashboard', () => {
    renderApp('/progress')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })
})

describe('accessibility (axe)', () => {
  const routes = ['/', '/s/webprog', '/s/webprog/5', '/s/webprog/5/learn', '/s/webprog/5/practice', '/s/webprog/5/mock', '/s/webprog/progress', '/s/bmc/progress', '/s/webprog/glossary']
  it.each(routes)('has no detectable violations on %s', async (route) => {
    fakeWikipedia(REACT_PAGE)
    const { container } = renderApp(route)
    await screen.findByRole('main')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has a skip link as the first focusable element', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.tab()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus()
  })
})
