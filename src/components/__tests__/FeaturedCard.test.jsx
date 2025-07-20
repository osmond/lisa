import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeaturedCard from '../FeaturedCard.jsx'

beforeAll(() => {
  if (typeof PointerEvent === 'undefined') {
    window.PointerEvent = window.MouseEvent
  }
})

jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))

const plants = [
  { id: 1, name: 'Aloe', image: 'test.jpg', lastWatered: '2025-07-07', nextWater: '2025-07-10' },
  { id: 2, name: 'Pothos', image: 'test2.jpg', lastWatered: '2025-07-08', nextWater: '2025-07-11' },
]

test('shows featured label and care summary', () => {
  render(
    <MemoryRouter>
      <FeaturedCard plants={plants} />
    </MemoryRouter>
  )
  expect(screen.getByText('Featured Plant of the Day')).toBeInTheDocument()
  expect(screen.getByText('Aloe')).toBeInTheDocument()
  expect(screen.getByText('Last watered 3 days ago \u00B7 Needs water today')).toBeInTheDocument()
})

test('swipe does not change plant', () => {
  render(
    <MemoryRouter>
      <FeaturedCard plants={plants} />
    </MemoryRouter>
  )
  const card = screen.getByTestId('featured-card')
  // simulate a left swipe gesture
  fireEvent.pointerDown(card, { clientX: 100 })
  fireEvent.pointerMove(card, { clientX: 20 })
  fireEvent.pointerUp(card, { clientX: 20 })
  // plant should remain the same after swipe
  expect(screen.getByText('Aloe')).toBeInTheDocument()
})

test('arrow keys change plant', () => {
  render(
    <MemoryRouter>
      <FeaturedCard plants={plants} />
    </MemoryRouter>
  )
  const card = screen.getByTestId('featured-card')
  card.focus()
  fireEvent.keyDown(card, { key: 'ArrowRight' })
  expect(screen.getByText('Pothos')).toBeInTheDocument()
  fireEvent.keyDown(card, { key: 'ArrowLeft' })
  expect(screen.getByText('Aloe')).toBeInTheDocument()
})

test('displays plant fact when loaded', async () => {
  process.env.VITE_OPENAI_API_KEY = 'key'
  global.fetch = jest.fn(url => {
    if (url.includes('openai')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ choices: [{ message: { content: 'fun fact' } }] }),
      })
    }
    return Promise.resolve({ json: () => Promise.resolve({ results: [] }) })
  })
  render(
    <MemoryRouter>
      <FeaturedCard plants={plants} />
    </MemoryRouter>
  )
  await screen.findByText('fun fact')
  global.fetch = undefined
  delete process.env.VITE_OPENAI_API_KEY
})
