import { render, screen, waitFor, act } from '@testing-library/react'
import useCarePlan from '../useCarePlan.js'
jest.mock('../../OpenAIContext.jsx', () => ({
  useOpenAI: () => ({ enabled: true }),
}))

function Test({ details }) {
  const { plan, generate } = useCarePlan()
  return (
    <div>
      <button onClick={() => generate(details)}>go</button>
      {plan && <span>{plan.text}</span>}
    </div>
  )
}

afterEach(() => {
  global.fetch && (global.fetch = undefined)
})

test('posts details to /api/care-plan', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ text: 'ok' }) })
  )
  render(<Test details={{ name: 'Snake' }} />)
  await act(async () => {
    screen.getByText('go').click()
  })
  await waitFor(() => screen.getByText('ok'))
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/care-plan',
    expect.objectContaining({ method: 'POST' })
  )
})

test('returns fallback plan on failure', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'bad' }) })
  )
  function Fallback() {
    const { plan, error, generate } = useCarePlan()
    return (
      <div>
        <button onClick={() => generate({ name: 'Snake' })}>go</button>
        <span data-testid="error">{error}</span>
        {plan && <span data-testid="water">{plan.water}</span>}
      </div>
    )
  }
  render(<Fallback />)
  await act(async () => {
    screen.getByText('go').click()
  })
  await waitFor(() => screen.getByTestId('error'))
  expect(screen.getByTestId('error')).toHaveTextContent('Failed to generate plan')
  expect(screen.getByTestId('water')).toHaveTextContent('0')
})

