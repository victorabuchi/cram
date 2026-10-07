import { screen, within } from '@testing-library/react'
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

  it('leaves Practice and Practice test in the other courses', () => {
    renderApp('/s/webprog')
    const main = within(screen.getByRole('main'))
    expect(main.getByText('Practice all weeks')).toBeInTheDocument()
    expect(main.getByText(/Practice test/)).toBeInTheDocument()
  })

  it('has learn cards for every week', () => {
    renderApp('/s/prog2/7/learn')
    expect(screen.getByRole('button', { name: /JavaFX: the structure/ })).toBeInTheDocument()
  })

  it('types a Java answer, checks it and shows the solution', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    renderApp('/s/prog2/6/code')
    await user.click(screen.getByRole('button', { name: 'Check' }))
    expect(screen.getByRole('table', { name: 'Test results' })).toBeInTheDocument()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Show solution' }))
    expect(within(document.body).getByText(/One possible solution/)).toBeInTheDocument()
  })
})
