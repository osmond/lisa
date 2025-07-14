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
})
