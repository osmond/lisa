import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home.jsx'

jest.mock('../../WeatherContext.jsx', () => ({
  useWeather: () => ({ forecast: { rainfall: 0 } }),
}))

jest.mock('../../UserContext.jsx', () => ({
  useUser: () => ({ username: 'Jon' }),
}))

const mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

test('shows upbeat message when there are no tasks', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  expect(screen.getByText(/all plants are happy/i)).toBeInTheDocument()
  expect(screen.getByRole('img', { name: /watered/i })).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /add a journal entry/i })
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /set a reminder/i })).toBeInTheDocument()
})

test('care rings render when tasks exist', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length, {
    id: 1,
    name: 'Plant A',
    image: 'a.jpg',
    lastWatered: '2025-07-03',
    nextFertilize: '2025-07-10',
  })

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  expect(screen.getByRole('img', { name: /watered/i })).toBeInTheDocument()
  expect(screen.getByText('0 / 2 tasks done')).toBeInTheDocument()
})

test('featured card appears before care rings', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length, {
    id: 1,
    name: 'Plant A',
    image: 'a.jpg',
    lastWatered: '2025-07-03',
    nextFertilize: '2025-07-10',
  })

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const featured = screen.getByTestId('featured-card')
  const rings = screen.getByRole('img', { name: /watered/i })
  expect(featured).toBeInTheDocument()
  const order = featured.compareDocumentPosition(rings)
  expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test('earliest due task appears first', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(0, mockPlants.length,
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-02',
    },
    {
      id: 2,
      name: 'Plant B',
      image: 'b.jpg',
      lastWatered: '2025-07-03',
    }
  )

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  const tasks = screen.getAllByTestId('task-card')
  expect(tasks[0]).toHaveTextContent('Plant A')
  expect(tasks[1]).toHaveTextContent('Plant B')
})

test('clicking rings filters tasks', () => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  mockPlants.splice(
    0,
    mockPlants.length,
    {
      id: 1,
      name: 'Plant A',
      image: 'a.jpg',
      lastWatered: '2025-07-03',
    },
    {
      id: 2,
      name: 'Plant B',
      image: 'b.jpg',
      lastWatered: '2025-07-10',
      nextFertilize: '2025-07-10',
    }
  )

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )

  expect(screen.getAllByTestId('task-card')).toHaveLength(2)
  const circles = screen
    .getByRole('img', { name: /watered/i })
    .querySelectorAll('circle')
  fireEvent.click(circles[0])
  const tasks = screen.getAllByTestId('task-card')
  expect(tasks).toHaveLength(1)
  expect(tasks[0]).toHaveTextContent('Plant A')
})

