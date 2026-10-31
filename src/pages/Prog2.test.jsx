import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from '../test/helpers.jsx'

describe('Programming II (Java) has only Learn and Code exercises', () => {
  it('shows only those two on a week page', () => {
    renderApp('/s/prog2/3')
    const main = within(screen.getByRole('main'))
    expect(main.getByRole('link', { name: /Learn/ })).toBeInTheDocument()
    expect(main.getByRole('link', { name: /Code exercises/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Practice/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Practice test/ })).not.toBeInTheDocument()
  })

  it('sends Practice and Mock urls back to the course page', () => {
    renderApp('/s/prog2/all/practice')
    expect(screen.getByRole('heading', { name: 'Programming II (Java)' })).toBeInTheDocument()
  })

  it('Web Programming I keeps Practice (no separate Practice test), with the Moodle practice questions', () => {
    renderApp('/s/webprog')
    const main = within(screen.getByRole('main'))
    expect(main.getByText('Practice all weeks')).toBeInTheDocument()
    expect(main.queryByText(/Practice test/)).not.toBeInTheDocument()
  })

  it('a Web Programming I week has Learn and Practice only (plus the code exercises in week 4)', () => {
    const { unmount } = renderApp('/s/webprog/1')
    let main = within(screen.getByRole('main'))
    expect(main.getByRole('link', { name: /Learn/ })).toBeInTheDocument()
    expect(main.getByRole('link', { name: /Practice/ })).toBeInTheDocument()
    expect(main.queryByRole('link', { name: /Practice test/ })).not.toBeInTheDocument()
    expect(main.queryByRole('link', { name: /Code exercises/ })).not.toBeInTheDocument()
    unmount()
    renderApp('/s/webprog/4')
    main = within(screen.getByRole('main'))
    expect(main.getByRole('link', { name: /Code exercises/ })).toBeInTheDocument()
  })

  it('has learn cards for every week', () => {
    renderApp('/s/prog2/7/learn')
    expect(screen.getByRole('button', { name: /JavaFX: the structure/ })).toBeInTheDocument()
  })

  it('types a Java answer, checks it and shows the solution', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') })) // no Java runner
    renderApp('/s/prog2/6/code')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(await screen.findByRole('table', { name: 'Test results' })).toBeInTheDocument()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Show solution' }))
    expect(within(document.body).getByText(/One possible solution/)).toBeInTheDocument()
  })

  it('runs the code with the Java runner when it is running, and compares the output', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn(async (url) => ({
      json: async () => (String(url).endsWith('/health')
        ? { ok: true, java: true }
        : { ok: true, stage: 'run', stdout: 'Same\nNot same\nSame\nNot same\n', stderr: '', timedOut: false }),
    }))
    vi.stubGlobal('fetch', fetchMock)
    renderApp('/s/prog2/1/code')
    await user.click(screen.getByRole('button', { name: 'Question 2' }))
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(await screen.findByText('Your Java ran and printed the right output!', { selector: 'strong' })).toBeInTheDocument()
    expect(screen.getByLabelText('Expected output')).toHaveTextContent(/Same\s*Not same\s*Same\s*Not same/)
    const run = fetchMock.mock.calls.find(([u]) => String(u).endsWith('/run'))
    expect(JSON.parse(run[1].body).main).toBe('Main')
  })

  it('shows the compiler message when the code does not compile', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async (url) => ({
      json: async () => (String(url).endsWith('/health')
        ? { ok: true, java: true }
        : { ok: false, stage: 'compile', stdout: '', stderr: 'Main.java:3: error: \';\' expected', timedOut: false }),
    })))
    renderApp('/s/prog2/1/code')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(await screen.findByText('Your code does not compile.')).toBeInTheDocument()
    expect(screen.getByLabelText('Compiler or runtime message')).toHaveTextContent("error: ';' expected")
  })

  it('falls back to the pattern checks, and says so, when the runner is not running', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') }))
    renderApp('/s/prog2/1/code')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(await screen.findByText(/The Java runner is not running/)).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Test results' })).toBeInTheDocument()
  })
})
