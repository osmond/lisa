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

