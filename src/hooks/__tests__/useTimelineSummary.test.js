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
})

test('fetches summary from API', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ summary: 'hello summary' }),
    })
  )
  render(<Test events={[{ date: '2025-07-01', label: 'Watered', type: 'water' }]} />)
  await waitFor(() => screen.getByText('hello summary'))
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/timeline-summary',
    expect.any(Object)
  )
})

test('sets error on failure', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false }))
  render(<Test events={[{ date: '2025-07-01', label: 'Watered', type: 'water' }]} />)
  await waitFor(() => screen.getByText('Failed to load summary'))
})
