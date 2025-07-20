import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Coach from '../Coach.jsx'
import { usePlants } from '../../PlantContext.jsx'

jest.mock('../../hooks/usePlantCoach.js', () => ({
  __esModule: true,
  default: () => ({ answer: '', loading: false, error: '' }),
}))

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: jest.fn(),
}))

const usePlantsMock = usePlants

test('shows plant specific sample questions', () => {
  usePlantsMock.mockReturnValue({
    plants: [{ id: 1, name: 'Aloe', lastWatered: '2025-07-01' }],
  })
  render(
    <MemoryRouter initialEntries={['/plant/1/coach']}>
      <Routes>
        <Route path="/plant/:id/coach" element={<Coach />} />
      </Routes>
    </MemoryRouter>
  )
  expect(
    screen.getByText(/How often should I water my Aloe/i)
  ).toBeInTheDocument()
})
