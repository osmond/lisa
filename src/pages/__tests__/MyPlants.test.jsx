import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MyPlants from '../MyPlants.jsx'

let mockPlants = []

jest.mock('../../PlantContext.jsx', () => ({
  usePlants: () => ({ plants: mockPlants }),
}))

afterEach(() => {
  mockPlants = []
})

test('shows add plant button when no plants', () => {
  mockPlants = []
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )
  const link = screen.getByRole('link', { name: /add plant/i })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/add')
})

test('renders add tile in grid when plants exist', () => {
  mockPlants = [
    { id: 1, name: 'Aloe', image: '/a.jpg' },
  ]
  render(
    <MemoryRouter>
      <MyPlants />
    </MemoryRouter>
  )
  const addTile = screen.getByRole('link', { name: /add plant/i })
  expect(addTile).toBeInTheDocument()
  expect(addTile).toHaveAttribute('href', '/add')
})
