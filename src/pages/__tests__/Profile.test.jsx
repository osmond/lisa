import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Profile from '../Profile.jsx'


jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({
    plants: [
      {
        id: 1,
        name: 'Fern',
        lastWatered: '2025-07-10',
        careLog: [
          { date: '2025-07-09', type: 'Watered', note: 'Lots of water' },
          { date: '2025-07-08', type: 'Pruned', note: 'Trimmed leaves' },
        ],
      },
      {
        id: 2,
        name: 'Palm',
        lastWatered: '2025-07-09',
        careLog: [],
      },
    ],
  }),
}))

test('shows watering streak and recent notes', () => {
  localStorage.setItem('userName', 'Alice')
  jest.useFakeTimers().setSystemTime(new Date('2025-07-10'))
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  )
  expect(screen.getByText(/hello, alice/i)).toBeInTheDocument()
  expect(screen.getByTestId('streak')).toHaveTextContent('2')
  expect(screen.getByText(/trimmed leaves/i)).toBeInTheDocument()
  jest.useRealTimers()

import { UserProvider } from '../../UserContext.jsx'

let mockPlants = []
jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

describe('Profile page', () => {
  beforeEach(() => {
    localStorage.setItem('userName', 'Alice')
    mockPlants = [
      {
        id: 1,
        careLog: [
          { date: '2025-07-10', type: 'Watered', note: 'note1' },
          { date: '2025-07-09', type: 'Watered', note: 'note2' },
          { date: '2025-07-08', type: 'Fertilized', note: 'note3' },
        ],
      },
    ]
  })

  test('renders stored name in greeting', () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Profile />
        </UserProvider>
      </MemoryRouter>
    )
    expect(screen.getByTestId('greeting')).toHaveTextContent('Alice')
  })

  test('computes watering streak correctly', () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Profile />
        </UserProvider>
      </MemoryRouter>
    )
    expect(screen.getByTestId('streak-count').textContent).toBe('2')
  })

  test('shows notes in reverse chronological order', () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Profile />
        </UserProvider>
      </MemoryRouter>
    )
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('note1')
    expect(items[1]).toHaveTextContent('note2')
    expect(items[2]).toHaveTextContent('note3')
  })

})
