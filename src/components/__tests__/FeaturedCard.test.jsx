import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeaturedCard from '../FeaturedCard.jsx'
import { usePlants } from '../../PlantContext.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants
const markWatered = jest.fn()

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

beforeEach(() => {
  markWatered.mockClear()
  usePlantsMock.mockReturnValue({ markWatered })
})

test('shows featured label and care summary', () => {
  render(
    <MemoryRouter>
      <FeaturedCard plants={plants} />
    </MemoryRouter>
  )
  expect(screen.getByText('🌿 Featured Plant of the Day')).toBeInTheDocument()
  expect(screen.getByText('Aloe')).toBeInTheDocument()
  expect(screen.getByText('Last watered 3 days ago \u00B7 Needs water today')).toBeInTheDocument()
})

test('swipe changes plant', () => {
  render(
    <MemoryRouter>
      <FeaturedCard plants={plants} />
    </MemoryRouter>
  )
  const card = screen.getByTestId('featured-card')
  fireEvent.pointerDown(card, { clientX: 100 })
  fireEvent.pointerMove(card, { clientX: 20 })
  fireEvent.pointerUp(card, { clientX: 20 })
  expect(screen.getByText('Pothos')).toBeInTheDocument()
})

test('shows Water Now button when watering is due', () => {
  render(
    <MemoryRouter>
      <FeaturedCard plants={[plants[0]]} />
    </MemoryRouter>
  )
  expect(screen.getByText('Water Now')).toBeInTheDocument()
})

test('does not show Water Now button when not due', () => {
  render(
    <MemoryRouter>
      <FeaturedCard plants={[plants[1]]} />
    </MemoryRouter>
  )
  expect(screen.queryByText('Water Now')).not.toBeInTheDocument()
})

test('clicking Water Now marks plant watered', () => {
  render(
    <MemoryRouter>
      <FeaturedCard plants={[plants[0]]} />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByText('Water Now'))
  expect(markWatered).toHaveBeenCalledWith(1, '')
})
