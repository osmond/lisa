import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MyPlants from '../MyPlants.jsx'

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: [] }),
}))

test('shows add plant button when no plants', () => {
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )
  const link = screen.getByRole('link', { name: /add plant/i })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/add')
})
