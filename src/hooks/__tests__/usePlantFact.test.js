import { render, screen, waitFor } from '@testing-library/react'
import usePlantFact from '../usePlantFact.js'
jest.mock('../../OpenAIContext.jsx', () => ({
  useOpenAI: () => ({ enabled: true }),
}))

function Test({ name }) {
  const { fact } = usePlantFact(name)
  return <div>{fact || 'loading'}</div>
}

afterEach(() => {
  global.fetch && (global.fetch = undefined)
  localStorage.clear()
})

test('fetches fact from API', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ fact: 'gpt fact' }),
    })
  )
  render(<Test name="Aloe" />)
  await waitFor(() => screen.getByText('gpt fact'))
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/plant-fact',
    expect.any(Object)
  )
})

test('falls back to wikipedia summary', async () => {
  global.fetch = jest.fn(requestUrl => {
    if (requestUrl.includes('/api/plant-fact')) {
      return Promise.resolve({ ok: false })
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ extract: 'Rose is a plant. Second.' }),
    })
  })
  render(<Test name="Rose" />)
  await waitFor(() => screen.getByText('Rose is a plant'))
  expect(global.fetch).toHaveBeenCalledTimes(2)
})
