import { render, screen, waitFor } from '@testing-library/react'
import useTimelineSummary from '../useTimelineSummary.js'

function Test({ events }) {
  const { summary } = useTimelineSummary(events)
  return <div>{summary || 'loading'}</div>
}

afterEach(() => {
  global.fetch && (global.fetch = undefined)
  localStorage.clear()
  delete process.env.VITE_OPENAI_API_KEY
})

test('fetches summary from OpenAI when key provided', async () => {
  process.env.VITE_OPENAI_API_KEY = 'key'
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ choices: [{ message: { content: 'summary text' } }] }),
    })
  )
  const events = [
    { date: '2025-07-01', label: 'Watered', type: 'water' },
    { date: '2025-07-10', label: 'Fertilized', type: 'fertilize' },
  ]
  render(<Test events={events} />)
  await waitFor(() => screen.getByText('summary text'))
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.openai.com/v1/chat/completions',
    expect.any(Object)
  )
})
