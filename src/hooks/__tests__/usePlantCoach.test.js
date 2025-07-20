import { render, screen, waitFor } from '@testing-library/react'
import usePlantCoach from '../usePlantCoach.js'

const mockPlant = { id: 1, name: 'Aloe', lastWatered: '2024-01-01' }
let forecast = { temp: '70°F', condition: 'Sunny' }

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [mockPlant] }),
}))

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast }),
}))

function Test({ question }) {
  const { answer } = usePlantCoach(question, 1)
  return <div>{answer || 'loading'}</div>
}

afterEach(() => {
  global.fetch && (global.fetch = undefined)
})

test('posts question to /api/coach', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ answer: 'hi' }),
    })
  )
  render(<Test question="How often should I water?" />)
  await waitFor(() => screen.getByText('hi'))
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/coach',
    expect.objectContaining({ method: 'POST' })
  )
})

test('sets error on failure', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }))
  function ErrTest() {
    const { error } = usePlantCoach('q', 1)
    return <div>{error || 'loading'}</div>
  }
  render(<ErrTest />)
  await waitFor(() => screen.getByText('Failed to load answer'))
})
