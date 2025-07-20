import { render, screen, waitFor } from '@testing-library/react'
import usePlantFact from '../usePlantFact.js'

const originalFetch = global.fetch

function Test({ name }) {
  const { fact } = usePlantFact(name)
  return <div>{fact || 'loading'}</div>
}

afterEach(() => {
  global.fetch = originalFetch
  delete process.env.VITE_OPENAI_API_KEY
  localStorage.clear()
})

test('fetches fact from OpenAI when key provided', async () => {
  process.env.VITE_OPENAI_API_KEY = 'key'
  global.fetch = jest.fn(url =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ choices: [{ message: { content: 'gpt fact' } }] }),
    })
  )
  render(<Test name="Aloe" />)
  await waitFor(() => screen.getByText('gpt fact'))
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.openai.com/v1/chat/completions',
    expect.any(Object)
  )
})

test('falls back to wikipedia summary', async () => {
  process.env.VITE_OPENAI_API_KEY = 'key'
  global.fetch = jest.fn(url => {
    if (url.includes('openai')) {
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
