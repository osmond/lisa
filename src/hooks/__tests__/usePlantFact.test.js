import { render, screen, waitFor } from '@testing-library/react'
import usePlantFact from '../usePlantFact.js'

function Test({ name }) {
  const { fact } = usePlantFact(name)
  return <div>{fact || 'loading'}</div>
}

afterEach(() => {
  global.fetch && (global.fetch = undefined)
  localStorage.clear()
})

test('fetches fact from api and caches it', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ fact: 'fact' }) })
  )
  const { unmount } = render(<Test name="Aloe" />)
  await waitFor(() => screen.getByText('fact'))
  expect(global.fetch).toHaveBeenCalledWith('/api/plant-fact?name=Aloe')
  // second call should use cache
  global.fetch.mockClear()
  unmount()
  render(<Test name="Aloe" />)
  await waitFor(() => screen.getByText('fact'))
  expect(global.fetch).not.toHaveBeenCalled()
})
