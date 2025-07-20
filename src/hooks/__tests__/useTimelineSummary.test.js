import { render, screen, waitFor } from '@testing-library/react'
import useTimelineSummary from '../useTimelineSummary.js'
jest.mock('../../OpenAIContext.jsx', () => ({
  useOpenAI: () => ({ enabled: true }),
}))

function Test({ events }) {
  const { summary, error, loading } = useTimelineSummary(events)
  return (
    <div>
      {loading && 'loading'}
      {summary}
      {error}
    </div>
  )
}

afterEach(() => {
  global.fetch && (global.fetch = undefined)
  delete process.env.VITE_OPENAI_API_KEY
})

test('fetches summary from OpenAI', async () => {
  process.env.VITE_OPENAI_API_KEY = 'key'
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ choices: [{ message: { content: 'hello summary' } }] }),
    })
  )
  render(<Test events={[{ date: '2025-07-01', label: 'Watered', type: 'water' }]} />)
  await waitFor(() => screen.getByText('hello summary'))
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.openai.com/v1/chat/completions',
    expect.any(Object)
  )
})

test('sets error on failure', async () => {
  process.env.VITE_OPENAI_API_KEY = 'key'
  global.fetch = jest.fn(() => Promise.resolve({ ok: false }))
  render(<Test events={[{ date: '2025-07-01', label: 'Watered', type: 'water' }]} />)
  await waitFor(() => screen.getByText('Failed to load summary'))
})
